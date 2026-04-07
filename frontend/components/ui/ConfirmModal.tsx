import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 24 }}>
            <div style={{ background: '#ffffff', borderRadius: 16, padding: 32, maxWidth: 400, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', animation: 'fadeInUp 0.3s ease' }}>
                <h3 style={{ margin: '0 0 12px', color: '#c62828', display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.25rem' }}>
                    ⚠︎︎︎ {title}
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: 24, lineHeight: 1.5 }}>
                    {message}
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button 
                        onClick={onCancel} 
                        style={{ padding: '8px 16px', border: '1px solid #d1d5db', background: 'transparent', borderRadius: 8, color: '#4b5563', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => { onConfirm(); onCancel(); }}
                        style={{ padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
