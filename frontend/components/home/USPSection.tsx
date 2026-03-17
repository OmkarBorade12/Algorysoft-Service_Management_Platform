'use client';
import { USP_ITEMS } from '@/lib/data';
import { FiTarget, FiZap, FiTrendingUp, FiShield, FiTool, FiGlobe, FiMessageCircle, FiServer, FiAward } from 'react-icons/fi';
import { HiOutlineRocketLaunch } from 'react-icons/hi2';
import { MdOutlineDesignServices } from 'react-icons/md';

const USP_SVG_ICONS: Record<string, React.ReactNode> = {
    '🎯': <FiTarget size={28} />,
    '⚡': <FiZap size={28} />,
    '📈': <FiTrendingUp size={28} />,
    '🔒': <FiShield size={28} />,
    '🛠️': <FiTool size={28} />,
    '🌐': <FiGlobe size={28} />,
};

const PROCESS_ICONS = [
    <FiMessageCircle key={0} size={22} />,
    <MdOutlineDesignServices key={1} size={22} />,
    <FiServer key={2} size={22} />,
    <HiOutlineRocketLaunch key={3} size={22} />,
];

export default function USPSection() {
    return (
        <section style={{
            padding: '90px 0',
            background: 'var(--bg-secondary)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(109,176,58,0.10) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(109,176,58,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: 'var(--pista-xlight)', color: 'var(--pista-dark)',
                        border: '1.5px solid var(--pista-border)', borderRadius: '9999px',
                        padding: '5px 18px', fontSize: '0.78rem', fontWeight: '700',
                        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px',
                    }}>
                        <FiAward size={13} /> Why AlgorySoft
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: '900', color: 'var(--text-primary)', marginTop: '8px' }}>
                        Why Businesses Choose <span style={{ color: 'var(--pista-primary)' }}>AlgorySoft?</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '12px', maxWidth: '520px', margin: '12px auto 0' }}>
                        We don't just build websites. We build digital growth engines for your business — fast, beautiful, and results-driven.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {USP_ITEMS.map((usp, i) => (
                        <div
                            key={i}
                            style={{
                                background: '#ffffff', border: '1.5px solid var(--border-solid)',
                                borderRadius: '20px', padding: '28px 24px',
                                boxShadow: 'var(--shadow-card)',
                                animation: `fadeInUp 0.5s ${i * 0.08}s ease both`,
                                transition: 'all 0.25s ease', cursor: 'default',
                            }}
                            onMouseEnter={e => {
                                const el = e.currentTarget as HTMLDivElement;
                                el.style.transform = 'translateY(-4px)';
                                el.style.borderColor = 'var(--pista-primary)';
                                el.style.boxShadow = '0 10px 30px rgba(109,176,58,0.16)';
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget as HTMLDivElement;
                                el.style.transform = '';
                                el.style.borderColor = '';
                                el.style.boxShadow = 'var(--shadow-card)';
                            }}
                        >
                            <div style={{
                                fontSize: '2.2rem', marginBottom: '16px',
                                background: 'var(--pista-xlight)', width: '64px', height: '64px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '16px', border: '1.5px solid var(--pista-border)',
                                color: 'var(--pista-primary)',
                            }}>
                                {USP_SVG_ICONS[usp.icon] || <FiZap size={28} />}
                            </div>
                            <h3 style={{ fontSize: '1.12rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
                                {usp.title}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.65' }}>
                                {usp.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Process steps */}
                <div style={{
                    marginTop: '64px',
                    background: '#ffffff',
                    border: '1.5px solid var(--border-solid)',
                    borderRadius: '24px',
                    padding: '40px',
                    boxShadow: 'var(--shadow-card)',
                }}>
                    <h3 style={{ textAlign: 'center', fontWeight: '800', fontSize: '1.4rem', marginBottom: '36px', color: 'var(--text-primary)' }}>
                        How It <span style={{ color: 'var(--pista-primary)' }}>Works</span>
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0' }}>
                        {[
                            { step: '01', icon: PROCESS_ICONS[0], title: 'Consultation', desc: 'Tell us about your business & goals' },
                            { step: '02', icon: PROCESS_ICONS[1], title: 'Design & Proposal', desc: 'We send a design mockup + quote' },
                            { step: '03', icon: PROCESS_ICONS[2], title: 'Development', desc: 'We build your site in 7–14 days' },
                            { step: '04', icon: PROCESS_ICONS[3], title: 'Launch & Support', desc: 'Go live with 1-year free support' },
                        ].map((step, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '16px', position: 'relative' }}>
                                {i < 3 && (
                                    <div style={{
                                        position: 'absolute', right: '0', top: '28px',
                                        width: '30px', height: '2px',
                                        background: 'var(--pista-border)',
                                    }} />
                                )}
                                <div style={{
                                    width: '52px', height: '52px', borderRadius: '50%',
                                    background: 'var(--pista-xlight)',
                                    border: '2px solid var(--pista-border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.5rem', margin: '0 auto 12px',
                                    color: 'var(--pista-primary)',
                                }}>
                                    {step.icon}
                                </div>
                                <div style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--pista-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Step {step.step}</div>
                                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{step.title}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{step.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
