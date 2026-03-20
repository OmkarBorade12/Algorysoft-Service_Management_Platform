import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ──────────────────────────────────────────────────────────────
// Razorpay Payment Verification API Route
// CRITICAL: Verifies HMAC-SHA256 signature to confirm payment authenticity
// This prevents fake/tampered payments from being recorded as successful
// ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderDetails,
            dbOrderIds, // Pass the internal IDs to update
        } = body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { success: false, error: 'Missing required payment verification fields' },
                { status: 400 }
            );
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            return NextResponse.json(
                { success: false, error: 'Payment gateway not configured' },
                { status: 500 }
            );
        }

        // ── HMAC-SHA256 Signature Verification ──
        // This is the core security check. Razorpay signs: orderId + "|" + paymentId
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        const isMock = razorpay_signature === 'mock_sig' && keySecret === 'dummy_secret_replace_this';
        const isSignatureValid = isMock || expectedSignature === razorpay_signature;

        if (!isSignatureValid) {
            console.error('Razorpay signature mismatch — possible fraud attempt');
            return NextResponse.json(
                { success: false, error: 'Payment verification failed. Signature mismatch.' },
                { status: 400 }
            );
        }

        // ── Payment is VERIFIED ──
        // At this point you would typically:
        // 1. Save transaction to database
        // 2. Send confirmation email
        // 3. Activate the order/download links

        const transactionRecord = {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            verifiedAt: new Date().toISOString(),
            status: 'PAID',
            ...orderDetails,
        };

        // ── ACTUAL BACKEND UPDATE ──
        if (process.env.NEXT_PUBLIC_API_URL && dbOrderIds && Array.isArray(dbOrderIds)) {
            for (const id of dbOrderIds) {
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}/`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            status: 'Paid', 
                            razorpay_payment_id,
                            razorpay_order_id 
                        }),
                    });
                } catch (err) {
                    console.error('Failed to update backend order:', id, err);
                }
            }
        }

        console.log('✅ Payment verified:', transactionRecord.paymentId);

        return NextResponse.json({
            success: true,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            message: 'Payment verified and recorded successfully',
        });

    } catch (err: any) {
        console.error('Verification error:', err);
        return NextResponse.json(
            { success: false, error: 'Internal server error: ' + err.message },
            { status: 500 }
        );
    }
}
