'use client';
import React from 'react';

interface PaymentHandshakeProps {
    status: 'initializing' | 'authenticating' | 'processing' | 'success';
    message?: string;
}

export default function PaymentHandshake({ status, message }: PaymentHandshakeProps) {
    const titles = {
        initializing: 'Establishing Secure Handshake...',
        authenticating: 'Bank Identity Verification...',
        processing: 'Encrypted Transaction Processing...',
        success: 'Payment Secured & Verified!'
    };

    const icons = {
        initializing: '🛡️',
        authenticating: '🏦',
        processing: '⚡',
        success: '✅'
    };

    const progress = {
        initializing: 25,
        authenticating: 50,
        processing: 85,
        success: 100
    };

    return (
        <div style={{ 
            position: 'fixed', inset: 0, background: 'rgba(18, 25, 38, 0.9)', 
            backdropFilter: 'blur(12px)', zIndex: 10000, 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
            <div style={{ 
                background: '#ffffff', padding: '48px', borderRadius: '32px', 
                width: '100%', maxWidth: '440px', textAlign: 'center', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid #e3e8ef',
                animation: 'berryFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                <div style={{ 
                    fontSize: '4rem', marginBottom: 24, 
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    height: 100, width: 100, margin: '0 auto 24px',
                    background: '#f8fafc', borderRadius: '50%',
                    border: '1px solid #e3e8ef'
                }} className={status !== 'success' ? 'handshake-lock' : ''}>
                    {icons[status]}
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#121926', marginBottom: 12, letterSpacing: '-0.02em' }}>
                    {titles[status]}
                </h2>
                
                {message && <p style={{ color: '#697586', marginBottom: 24, fontSize: '0.95rem' }}>{message}</p>}

                <div style={{ width: '100%', height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden', marginTop: 12 }}>
                    <div style={{ 
                        height: '100%', background: status === 'success' ? '#10b981' : '#5e35b1', 
                        transition: 'width 0.8s cubic-bezier(0.65, 0, 0.35, 1)',
                        width: `${progress[status]}%` 
                    }} className={status !== 'success' ? 'handshake-progress' : ''} />
                </div>

                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, color: '#10b981', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <span style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%' }}></span>
                        {status === 'success' ? 'Transaction Complete' : '256-bit AES Encryption Active'}
                    </div>
                    {status !== 'success' && (
                        <div style={{ fontSize: '0.65rem', color: '#687586', fontFamily: 'monospace', opacity: 0.6 }}>
                            SECURE_HANDSHAKE_ID: TXN_{Math.random().toString(36).substring(2, 10).toUpperCase()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
