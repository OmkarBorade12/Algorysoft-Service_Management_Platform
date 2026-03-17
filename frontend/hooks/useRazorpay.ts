'use client';
import { useCallback } from 'react';

interface RazorpayOptions {
    amount: number;       // in INR (we convert to paise)
    currency?: string;
    name: string;
    email: string;
    phone: string;
    description?: string;
    onSuccess: (paymentId: string, orderId: string, signature: string) => void;
    onFailure: (error: string) => void;
}

// Load Razorpay script dynamically
function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if ((window as any).Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.head.appendChild(script);
    });
}

export function useRazorpay() {
    const initiatePayment = useCallback(async (opts: RazorpayOptions) => {
        // Step 1: Load the Razorpay SDK
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            opts.onFailure('Failed to load Razorpay SDK. Check your internet connection.');
            return;
        }

        // Step 2: Create an order on our server (server knows secret key)
        let orderData;
        try {
            const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Math.round(opts.amount * 100), // Convert ₹ to paise
                    currency: opts.currency || 'INR',
                    receipt: `rcpt_${Date.now()}`,
                    notes: {
                        customer_name: opts.name,
                        customer_email: opts.email,
                    },
                }),
            });

            orderData = await res.json();

            if (!res.ok || !orderData.orderId) {
                opts.onFailure(orderData.error || 'Could not create payment order. Please try again.');
                return;
            }
        } catch {
            opts.onFailure('Network error. Please check your connection and try again.');
            return;
        }

        // Step 3: Open the Razorpay checkout modal
        const razorpayOptions = {
            key: orderData.keyId,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'AlgorySoft',
            description: opts.description || 'Project Purchase',
            image: '/logo.png', // Add your logo to /public
            order_id: orderData.orderId,
            prefill: {
                name: opts.name,
                email: opts.email,
                contact: opts.phone,
            },
            theme: {
                color: '#6db03a', // Your brand pista green
            },
            config: {
                display: {
                    blocks: {
                        utib: { name: 'Pay via UPI', instruments: [{ method: 'upi' }] },
                        other: { name: 'Other Methods' },
                    },
                    sequence: ['block.utib', 'block.other'],
                    preferences: { show_default_blocks: true },
                },
            },
            handler: async (response: any) => {
                // Step 4: Verify payment signature on our server
                try {
                    const verifyRes = await fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderDetails: {
                                name: opts.name,
                                email: opts.email,
                                phone: opts.phone,
                                amount: opts.amount,
                            },
                        }),
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        opts.onSuccess(
                            response.razorpay_payment_id,
                            response.razorpay_order_id,
                            response.razorpay_signature
                        );
                    } else {
                        opts.onFailure(verifyData.error || 'Payment verification failed. Please contact support.');
                    }
                } catch {
                    opts.onFailure('Verification network error. Your payment may have gone through — please check with support.');
                }
            },
            modal: {
                ondismiss: () => {
                    opts.onFailure('Payment cancelled by user');
                },
            },
        };

        const rzp = new (window as any).Razorpay(razorpayOptions);
        rzp.on('payment.failed', (response: any) => {
            opts.onFailure(response.error?.description || 'Payment failed. Please try again.');
        });
        rzp.open();
    }, []);

    return { initiatePayment };
}
