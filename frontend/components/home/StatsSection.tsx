'use client';
import { FiGlobe, FiZap, FiAward } from 'react-icons/fi';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { useAppSelector } from '@/hooks/useRedux';

export default function StatsSection() {
    const orders = useAppSelector(s => s.orders.items);
    const reviews = useAppSelector(s => s.reviews.reviews);

    const websitesDelivered = orders.length;
    const happyBusinesses = new Set(orders.map(o => o.clientEmail)).size;
    const avgRating = reviews.length ? (reviews.reduce((acc: number, rv) => acc + rv.rating, 0) / reviews.length).toFixed(1) : '5.0';

    const stats = [
        { num: websitesDelivered.toString(), label: 'Websites Delivered', icon: <FiGlobe size={28} /> },
        { num: happyBusinesses.toString(), label: 'Happy Businesses', icon: <HiOutlineOfficeBuilding size={28} /> },
        { num: '7–14', label: 'Days Avg. Delivery', icon: <FiZap size={28} /> },
        { num: `${avgRating}★`, label: 'Client Satisfaction', icon: <FiAward size={28} /> },
    ];

    return (
        <section style={{
            padding: '0',
            background: 'var(--pista-dark)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 50%, rgba(135,200,80,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                }}>
                    {stats.map((s, i) => (
                        <div key={i} style={{
                            textAlign: 'center',
                            padding: '36px 20px',
                            borderRight: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                        }}>
                            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center', color: '#a8dc78' }}>{s.icon}</div>
                            <div style={{
                                fontSize: '2.6rem',
                                fontWeight: '900',
                                color: '#a8dc78',
                                lineHeight: '1',
                                fontFamily: 'Outfit, sans-serif',
                            }}>{s.num}</div>
                            <div style={{
                                fontSize: '0.88rem',
                                color: 'rgba(255,255,255,0.7)',
                                marginTop: '6px',
                                fontWeight: '500',
                            }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
