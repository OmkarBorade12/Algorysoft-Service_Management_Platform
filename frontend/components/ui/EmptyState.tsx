'use client';
import Image from 'next/image';
import Link from 'next/link';

interface EmptyStateProps {
    imageNum: 1 | 2;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    imageOnly?: boolean;
}

export default function EmptyState({ imageNum, title, description, buttonText, buttonLink, imageOnly = false }: EmptyStateProps) {
    const imageUrl = `/empty${imageNum}.jpeg`;

    return (
        <div className="empty-state-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '60px 24px',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            <div style={{ position: 'relative', width: '280px', height: '280px', marginBottom: imageOnly ? '0' : '32px' }}>
                <Image
                    src={imageUrl}
                    alt="Empty state"
                    fill
                    style={{ objectFit: 'contain', borderRadius: '24px' }}
                    priority
                />
            </div>
            {!imageOnly && (
                <>
                    {title && (
                        <h3 style={{
                            fontSize: '1.8rem',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            marginBottom: '12px',
                            letterSpacing: '-0.5px'
                        }}>
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: '1.1rem',
                            maxWidth: '400px',
                            lineHeight: 1.6,
                            marginBottom: '32px'
                        }}>
                            {description}
                        </p>
                    )}
                    {buttonText && buttonLink && (
                        <Link href={buttonLink} className="btn-primary" style={{ padding: '12px 32px' }}>
                            {buttonText}
                        </Link>
                    )}
                </>
            )}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
