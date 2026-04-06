import { NextRequest, NextResponse } from 'next/server';

// ──────────────────────────────────────────────────────────────
// Razorpay Order Creation API Route
// This runs ONLY on the server — secret key never exposed to client
// Keys are read from env vars with fallback to hardcoded values
// ──────────────────────────────────────────────────────────────

// ── Razorpay credentials ──────────────────────────────────────
// Reads from environment variables first; falls back to literal keys
// so the payment gateway works even if .env.local is not on the server.
const RAZORPAY_KEY_ID     = process.env.RAZORPAY_KEY_ID     || 'rzp_live_Sa5LfPcuU0tmIf';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'Krz8zLCym5WC1icsNwJEqLWy';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, currency = 'INR', receipt, notes } = body;

        // Validate amount
        if (!amount || typeof amount !== 'number' || amount < 1) {
            return NextResponse.json(
                { error: 'Invalid amount. Minimum ₹1 (100 paise)' },
                { status: 400 }
            );
        }

        console.log('[Razorpay] Creating order:', { amount, currency, keyId: RAZORPAY_KEY_ID.slice(0, 12) + '...' });

        // Build order payload — amount is already in paise (sent from client as INR × 100)
        const orderPayload = {
            amount: Math.round(amount),
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes: notes || {},
        };

        const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

        const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader,
            },
            body: JSON.stringify(orderPayload),
        });

        if (!razorpayRes.ok) {
            const errData = await razorpayRes.json();
            console.error('[Razorpay] Order creation failed:', errData);
            return NextResponse.json(
                { error: errData?.error?.description || 'Failed to create payment order. Check your Razorpay keys.' },
                { status: razorpayRes.status }
            );
        }

        const order = await razorpayRes.json();
        console.log('[Razorpay] Order created:', order.id);

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: RAZORPAY_KEY_ID, // Safe to send — this is the public key
        });

    } catch (err: any) {
        console.error('[Razorpay] Create order exception:', err);
        return NextResponse.json(
            { error: 'Internal server error: ' + (err.message || 'Unknown error') },
            { status: 500 }
        );
    }
}
