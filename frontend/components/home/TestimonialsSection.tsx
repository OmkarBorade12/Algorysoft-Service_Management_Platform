'use client';
import { useAppSelector } from '@/hooks/useRedux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FiMessageSquare, FiMapPin } from 'react-icons/fi';

const TESTIMONIALS = [
    {
        id: 1,
        name: 'Arjun Mehta',
        company: 'FreshBite Restaurants, Gadag, Karnataka, India',
        role: 'Founder & CEO',
        rating: 5,
        avatar: 'A',
        text: 'AlgorySoft built our complete online ordering system in 10 days. Revenue from online orders jumped 3x within the first month. Outstanding quality and support!',
    },
    {
        id: 2,
        name: 'Priya Sharma',
        company: 'Glam Studio, Hyderabad',
        role: 'Owner',
        rating: 5,
        avatar: 'P',
        text: 'Our salon booking website is absolutely stunning. Client appointments went up by 60% after launch. The 1-year free support gives us real peace of mind.',
    },
    {
        id: 3,
        name: 'Rahul Nair',
        company: 'CloudStack Solutions, Chennai',
        role: 'CTO',
        rating: 5,
        avatar: 'R',
        text: 'We needed a complex SaaS dashboard in under 2 weeks — they delivered on time, within budget, and the code quality is exceptional. Highly recommended.',
    },
    {
        id: 4,
        name: 'Sneha Kapoor',
        company: 'Kapoor Properties, Mumbai',
        role: 'Director',
        rating: 5,
        avatar: 'S',
        text: 'Our real estate listing platform has been a game-changer. The advanced search, map view, and lead forms generate 50+ qualified leads every week. Fantastic work!',
    },
];

const AVATAR_COLORS = ['#548f2b', '#3f6d20', '#6db03a', '#87c850'];

export default function TestimonialsSection() {
    const { reviews } = useAppSelector(s => s.reviews);
    
    // Convert redux reviews to testimonial format, use mock as fallback if empty why 
    const approvedReviews = reviews.filter(r => r.status === 'approved');
    
    const displayItems = approvedReviews.length > 0 ? approvedReviews.map((r, idx) => ({
        id: r.id,
        name: r.userName,
        company: 'AlgorySoft Customer',
        role: 'Verified Client',
        rating: r.rating,
        avatar: r.userName.charAt(0).toUpperCase(),
        text: r.text
    })) : TESTIMONIALS;

    return (
        <section style={{ padding: '90px 0', background: 'var(--bg-tertiary)', position: 'relative', overflow: 'hidden' }}>
            <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '600px', height: '300px',
                background: 'radial-gradient(ellipse, rgba(109,176,58,0.10) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: 'var(--pista-xlight)', color: 'var(--pista-dark)',
                        border: '1.5px solid var(--pista-border)', borderRadius: '9999px',
                        padding: '5px 18px', fontSize: '0.78rem', fontWeight: '700',
                        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px',
                    }}>
                        <FiMessageSquare size={13} /> Client Success Stories
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: '900', color: 'var(--text-primary)', marginTop: '8px' }}>
                        What Our <span style={{ color: 'var(--pista-primary)' }}>Business Clients</span> Say
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '10px', maxWidth: '500px', margin: '10px auto 0' }}>
                        Real results from real businesses across India.
                    </p>
                </div>

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    style={{ paddingBottom: '48px' }}
                >
                    {displayItems.map((t, idx) => (
                        <SwiperSlide key={t.id}>
                            <div style={{
                                background: '#ffffff', border: '1.5px solid var(--border-solid)',
                                borderRadius: '20px', padding: '28px 24px',
                                boxShadow: 'var(--shadow-card)', height: '100%',
                                display: 'flex', flexDirection: 'column',
                            }}>
                                {/* Stars */}
                                <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                                    {Array(t.rating).fill(0).map((_, i) => (
                                        <span key={i} style={{ color: '#e8960a', fontSize: '1rem' }}>★︎</span>
                                    ))}
                                </div>

                                {/* Big quote */}
                                <div style={{ fontSize: '3rem', lineHeight: '1', color: 'var(--pista-border)', fontFamily: 'Georgia, serif', marginBottom: '4px', marginTop: '-8px' }}>"</div>

                                <p style={{ fontSize: '0.93rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px', flex: 1 }}>
                                    {t.text}
                                </p>

                                <div style={{ height: '1px', background: 'var(--border-solid)', marginBottom: '16px' }} />

                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '50%',
                                        background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: '800', fontSize: '1rem', color: '#fff', flexShrink: 0,
                                    }}>
                                        {t.avatar}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)' }}>{t.name}</div>
                                        <div style={{ fontSize: '0.74rem', color: 'var(--pista-primary)', fontWeight: 600 }}>{t.role}</div>
                                        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.company}</div>
                                    </div>
                                    <div style={{
                                        background: 'var(--pista-xlight)', border: '1px solid var(--pista-border)',
                                        borderRadius: '9999px', padding: '3px 10px',
                                        fontSize: '0.7rem', fontWeight: '700', color: 'var(--pista-dark)', flexShrink: 0,
                                    }}>
                                        Verified ✓︎
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Logos bar */}
                <div style={{
                    marginTop: '16px', textAlign: 'center',
                    color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 500,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', flexWrap: 'wrap',
                }}>
                    <FiMapPin size={13} style={{ color: 'var(--pista-primary)', flexShrink: 0 }} />
                    Trusted by businesses in Gadag, Karnataka, India · Hyderabad · Mumbai · Chennai · Delhi
                </div>
            </div>
        </section>
    );
}
