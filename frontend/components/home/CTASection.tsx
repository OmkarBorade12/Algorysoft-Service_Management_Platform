'use client';
import { useAppDispatch } from '@/hooks/useRedux';
import { openRegister } from '@/store/slices/uiSlice';
import Link from 'next/link';
import { WHATSAPP } from '@/lib/data';
import { FiShield, FiPackage, FiTrendingUp, FiGlobe } from 'react-icons/fi';
import { HiOutlineRocketLaunch } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';

export default function CTASection() {
    const dispatch = useAppDispatch();

    return (
        <section style={{
            padding: '90px 0',
            background: 'var(--bg-primary)',
            borderTop: '1.5px solid var(--border-solid)',
        }}>
            <div className="container">
                <div style={{
                    background: 'var(--pista-dark)',
                    borderRadius: '32px',
                    padding: '70px 48px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(63, 109, 32, 0.3)',
                }}>
                    {/* Grid overlay */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'linear-gradient(rgba(168,220,120,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(168,220,120,0.06) 1px, transparent 1px)',
                        backgroundSize: '40px 40px', borderRadius: '32px', pointerEvents: 'none',
                    }} />
                    <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(135,200,80,0.2), transparent 70%)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(109,176,58,0.2), transparent 70%)', borderRadius: '50%' }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: 'rgba(168,220,120,0.15)', color: '#a8dc78',
                            border: '1px solid rgba(168,220,120,0.3)', borderRadius: '9999px',
                            padding: '5px 18px', fontSize: '0.78rem', fontWeight: '700',
                            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px',
                        }}>
                            <HiOutlineRocketLaunch size={13} /> Get Your Website Built
                        </span>

                        <h2 style={{
                            fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: '900',
                            marginBottom: '16px', color: '#ffffff', lineHeight: '1.15',
                        }}>
                            Ready to Take Your Business<br />
                            <span style={{
                                background: 'linear-gradient(135deg, #a8dc78, #cff09a)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>
                                Online — Professionally?
                            </span>
                        </h2>

                        <p style={{
                            fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)',
                            maxWidth: '580px', margin: '0 auto 40px', lineHeight: '1.7',
                        }}>
                            Join 200+ businesses that trust AlgorySoft for fast, beautiful, and high-converting websites.
                            Get a free consultation and quote today.
                        </p>

                        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/projects" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '15px 36px',
                                background: 'linear-gradient(135deg, #a8dc78, #87c850)',
                                color: '#1a2410', borderRadius: '9999px',
                                fontWeight: '800', fontSize: '1rem', textDecoration: 'none',
                                boxShadow: '0 6px 24px rgba(135,200,80,0.4)',
                            }}>
                                Browse Solutions <FiGlobe size={16} />
                            </Link>
                            <button
                                onClick={() => dispatch(openRegister())}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '15px 36px',
                                    background: 'transparent', color: '#ffffff',
                                    border: '2px solid rgba(255,255,255,0.35)',
                                    borderRadius: '9999px', fontWeight: '700', fontSize: '1rem',
                                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                }}
                            >
                                Get Free Quote
                            </button>
                            <a
                                href={`https://wa.me/${WHATSAPP}`}
                                target="_blank" rel="noreferrer"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '15px 36px',
                                    background: '#25D366', color: 'white',
                                    borderRadius: '9999px', fontWeight: '700', fontSize: '1rem',
                                    textDecoration: 'none',
                                    boxShadow: '0 6px 24px rgba(37,211,102,0.35)',
                                }}
                            >
                                <FaWhatsapp size={18} /> Chat on WhatsApp
                            </a>
                        </div>

                        {/* Trust indicators */}
                        <div style={{
                            marginTop: '44px', display: 'flex',
                            justifyContent: 'center', gap: '32px', flexWrap: 'wrap',
                        }}>
                            {[
                                { icon: <FiShield size={13} />, text: 'Secure & Scalable' },
                                { icon: <FiPackage size={13} />, text: 'Full Source Code' },
                                { icon: <HiOutlineRocketLaunch size={13} />, text: '1-Year Free Support' },
                                { icon: <FiTrendingUp size={13} />, text: 'SEO Optimised' },
                            ].map((item) => (
                                <span key={item.text} style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.6)', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    {item.icon} {item.text}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
