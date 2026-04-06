import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ──────────────────────────────────────────────────────────────
// Razorpay Order Creation API Route
// This runs ONLY on the server — secret key never exposed to client
// ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, currency = 'INR', receipt, notes } = body;

        // Validate input
        if (!amount || typeof amount !== 'number' || amount < 1) {
            return NextResponse.json(
                { error: 'Invalid amount. Minimum ₹1' },
                { status: 400 }
            );
        }

        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            console.error('Razorpay keys not configured');
            return NextResponse.json(
                { error: 'Payment gateway not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local' },
                { status: 500 }
            );
        }

        // Create Razorpay order via REST API (avoids SDK import issues in Next.js edge)
        const orderPayload = {
            amount: Math.round(amount), // amount is already in paise (sent from client as INR * 100)
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes: notes || {},
        };

        const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

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
            console.error('Razorpay order error:', errData);
            return NextResponse.json(
                { error: errData?.error?.description || 'Failed to create payment order' },
                { status: razorpayRes.status }
            );
        }

        const order = await razorpayRes.json();

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId, // Safe to send to client (not secret)
        });

    } catch (err: any) {
        console.error('Create order error:', err);
        return NextResponse.json(
            { error: 'Internal server error: ' + err.message },
            { status: 500 }
        );
    }
}
