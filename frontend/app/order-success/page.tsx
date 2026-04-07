'use client';
import Link from 'next/link';

export default function OrderSuccessPage() {
    return (
        <div className="container" style={{ padding: '100px 0', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                background: 'var(--bg-card)',
                padding: '60px 40px',
                borderRadius: '32px',
                border: '1px solid var(--dark-pista-bright)',
                boxShadow: '0 0 60px rgba(82, 183, 136, 0.15)',
                textAlign: 'center',
                maxWidth: '600px',
                width: '100%'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'var(--gradient-accent)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    margin: '0 auto 32px',
                    animation: 'float 3s ease-in-out infinite'
                }}>
                    ✅︎︎
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Order Successful!</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
                    Thank you for choosing AlgorySoft. Your order has been confirmed and the project details have been sent to your email.
                </p>

                <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '16px', marginBottom: '32px', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--dark-pista-bright)' }}>What happens next?</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        <li style={{ display: 'flex', gap: '12px' }}>
                            <span style={{ color: 'var(--dark-pista-bright)' }}>1.</span> Download links will be activated in your dashboard within 5 minutes.
                        </li>
                        <li style={{ display: 'flex', gap: '12px' }}>
                            <span style={{ color: 'var(--dark-pista-bright)' }}>2.</span> Our technical team will reach out to schedule the free installation setup.
                        </li>
                        <li style={{ display: 'flex', gap: '12px' }}>
                            <span style={{ color: 'var(--dark-pista-bright)' }}>3.</span> You can always access 24/7 support via WhatsApp for any queries.
                        </li>
                    </ul>
                </div>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link href="/dashboard" className="btn-primary" style={{ padding: '14px 28px' }}>
                        Go to Dashboard
                    </Link>
                    <Link href="/projects" className="btn-secondary" style={{ padding: '14px 28px' }}>
                        Browse More
                    </Link>
                </div>
            </div>
        </div>
    );
}
