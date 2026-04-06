import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ──────────────────────────────────────────────────────────────
// Razorpay Payment Verification API Route
// CRITICAL: Verifies HMAC-SHA256 signature to confirm payment authenticity
// This prevents fake/tampered payments from being recorded as successful
// ──────────────────────────────────────────────────────────────

const RAZORPAY_KEY_SECRET   = process.env.RAZORPAY_KEY_SECRET   || 'Krz8zLCym5WC1icsNwJEqLWy';
const NEXT_PUBLIC_API_URL   = process.env.NEXT_PUBLIC_API_URL   || 'https://api.algorysoft.com';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderDetails,
            dbOrderIds,
        } = body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { success: false, error: 'Missing required payment verification fields' },
                { status: 400 }
            );
        }

        // ── HMAC-SHA256 Signature Verification ──
        // Razorpay signs: orderId + "|" + paymentId  using the key secret
        const expectedSignature = crypto
            .createHmac('sha256', RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (!isSignatureValid) {
            console.error('[Razorpay] Signature mismatch — possible fraud attempt');
            return NextResponse.json(
                { success: false, error: 'Payment verification failed. Signature mismatch.' },
                { status: 400 }
            );
        }

        // ── Payment is VERIFIED — update backend orders to "Paid" ──
        if (dbOrderIds && Array.isArray(dbOrderIds)) {
            for (const id of dbOrderIds) {
                try {
                    await fetch(`${NEXT_PUBLIC_API_URL}/api/orders/${id}/`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            status: 'Paid',
                            razorpay_payment_id,
                            razorpay_order_id,
                        }),
                    });
                } catch (err) {
                    console.error('[Razorpay] Failed to update backend order:', id, err);
                }
            }
        }

        console.log('[Razorpay] ✅ Payment verified:', razorpay_payment_id);

        return NextResponse.json({
            success: true,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            message: 'Payment verified and recorded successfully',
        });

    } catch (err: any) {
        console.error('[Razorpay] Verification exception:', err);
        return NextResponse.json(
            { success: false, error: 'Internal server error: ' + (err.message || 'Unknown error') },
            { status: 500 }
        );
    }
}
