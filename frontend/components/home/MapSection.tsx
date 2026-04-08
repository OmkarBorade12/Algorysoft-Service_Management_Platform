'use client';
import { FiMapPin, FiExternalLink } from 'react-icons/fi';

export default function MapSection() {
    const address = "RAJIV GANDHI NAGAR, GADAG, KARNATAKA India (IN), Pin Code:- 582101 582101";
    const encodedAddress = encodeURIComponent(address);
    // Standard Google Maps search URL
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    
    // Standard iframe embed URL (search query based)
    const embedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return (
        <section style={{ padding: '90px 0', background: 'var(--bg-secondary)', borderTop: '1.5px solid var(--border-solid)' }}>
            <div className="container">
                <div className="section-header" style={{ marginBottom: '40px' }}>
                    <div>
                        <span className="badge badge-category" style={{ marginBottom: '12px' }}>Find Us</span>
                        <h2 className="section-title">Our <span>Headquarters</span></h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px' }}>
                            Visit our main office in Gadag, Karnataka.
                        </p>
                    </div>
                    <a 
                        href={googleMapsUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="view-all-link"
                        style={{ alignSelf: 'center' }}
                    >
                        View on Maps <FiExternalLink style={{ marginLeft: '4px' }} />
                    </a>
                </div>

                <div 
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '500px',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)',
                        border: '2px solid var(--border-solid)',
                        background: '#e5eddf',
                    }}
                >
                    <iframe
                        title="AlgorySoft Office Map"
                        width="100%"
                        height="100%"
                        style={{ border: 0, borderRadius: '28px' }}
                        src={embedUrl}
                        loading="lazy"
                        allowFullScreen
                    ></iframe>
                    
                    {/* Floating Info Card */}
                    <div 
                        onClick={() => window.open(googleMapsUrl, '_blank')}
                        style={{
                            position: 'absolute',
                            bottom: '30px',
                            left: '30px',
                            right: '30px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(12px)',
                            padding: '20px 28px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            boxShadow: '0 15px 45px rgba(40, 80, 16, 0.15)',
                            zIndex: 10,
                            border: '1.5px solid var(--pista-border)',
                            cursor: 'pointer',
                        }}
                    >
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '14px',
                            background: 'var(--pista-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(109, 176, 58, 0.3)',
                        }}>
                            <FiMapPin size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>Registered Office</div>
                            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '400px' }}>{address}</div>
                        </div>
                        <div style={{
                             fontSize: '0.85rem',
                             fontWeight: 700,
                             color: 'var(--pista-dark)',
                             background: 'var(--pista-xlight)',
                             padding: '8px 18px',
                             borderRadius: '99px',
                             display: 'flex',
                             alignItems: 'center',
                             gap: '6px',
                             transition: 'all 0.2s',
                        }}>
                            Get Directions
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
