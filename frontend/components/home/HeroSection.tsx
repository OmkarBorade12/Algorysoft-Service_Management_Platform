'use client';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { openRegister, openQuote } from '@/store/slices/uiSlice';
import styles from './HeroSection.module.css';
import Link from 'next/link';
import { FiShoppingBag, FiBarChart2, FiZap, FiCheckCircle, FiStar, FiMapPin, FiPenTool, FiTrendingUp, FiTool } from 'react-icons/fi';
import { HiOutlineRocketLaunch } from 'react-icons/hi2';

const TECH_TAGS = ['E-Commerce', 'SaaS Dashboard', 'Landing Pages', 'Corporate Sites', 'Web Apps', 'Booking Systems', 'Fintech', 'EdTech'];


export default function HeroSection() {
    const dispatch = useAppDispatch();
    const products = useAppSelector(s => s.products.items);
    const orders = useAppSelector(s => s.orders.items);
    const websitesDelivered = orders.length;
    const happyClients = new Set(orders.map(o => o.client_email)).size;
    const reviews = useAppSelector(s => s.reviews.reviews);
    const avgRating = reviews.length ? (reviews.reduce((acc: number, rv) => acc + rv.rating, 0) / reviews.length).toFixed(1) : '5.0';

    const getCount = (slug: string) => products.filter(p => 
        p.category?.toLowerCase() === slug || 
        p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug || 
        p.tags?.some(t => t.toLowerCase() === slug)
    ).length;

    const ecomCount = getCount('e-commerce');
    const saasCount = getCount('saas');
    const landingCount = getCount('landing-pages');

    const FLOATING_CARDS = [
        { icon: <FiShoppingBag size={22} style={{ color: '#6db03a' }} />, title: 'E-Commerce', sub: `${ecomCount} Solutions`, delay: 0 },
        { icon: <FiBarChart2 size={22} style={{ color: '#6db03a' }} />, title: 'SaaS Apps', sub: `${saasCount} Solutions`, delay: 1 },
        { icon: <HiOutlineRocketLaunch size={22} style={{ color: '#6db03a' }} />, title: 'Landing Pages', sub: `${landingCount} Designs`, delay: 2 },
        { icon: <FiCheckCircle size={22} style={{ color: '#6db03a' }} />, title: '1-Year Support', sub: 'Free & Included', delay: 0.5 },
    ];

    return (
        <section className={styles.hero}>
            {/* Background effects */}
            <div className={styles.bgGrid} />
            <div className={`${styles.orb} ${styles.orb1}`} />
            <div className={`${styles.orb} ${styles.orb2}`} />

            <div className={`container ${styles.heroContent}`}>
                {/* LEFT — copy */}
                <div className={styles.left}>
                    <div className={styles.badge}>
                        <span className={styles.badge_dot} />
                        <FiStar size={13} style={{ color: 'var(--pista-primary)' }} /> India&apos;s #1 Business Web Solutions Partner
                    </div>

                    <h1 className={styles.heading}>
                        <span className={styles.highlight}>Stunning</span><br />
                        That Grow Your<br />
                        <span className={styles.highlight}>Business Online</span>
                    </h1>

                    <p className={styles.subHeading}>
                        Custom e-commerce stores, corporate websites, SaaS dashboards &amp; web apps —
                        <br />built fast, SEO-ready, and fully handed over with 1-year free support.
                    </p>

                    <div className={styles.features}>
                        {[
                            { icon: <FiZap size={13} />, text: '7–14 Day Delivery' },
                            { icon: <FiPenTool size={13} />, text: '100% Custom Design' },
                            { icon: <FiTrendingUp size={13} />, text: 'SEO Optimised' },
                            { icon: <FiTool size={13} />, text: '1-Year Free Support' },
                        ].map((f) => (
                            <span key={f.text} className={styles.featureTag} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>{f.icon} {f.text}</span>
                        ))}
                    </div>

                    <div className={styles.ctaRow}>
                        <Link href="/projects" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 34px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <HiOutlineRocketLaunch size={17} /> View All Solutions
                        </Link>
                        <button
                            className="btn-secondary"
                            style={{ fontSize: '1rem', padding: '14px 32px' }}
                            onClick={() => dispatch(openQuote())}
                        >
                            Get Free Quote
                        </button>
                    </div>

                    <div className={styles.tags}>
                        {TECH_TAGS.map((t) => (
                            <Link key={t} href={`/projects?search=${t}`} className={styles.techTag}>{t}</Link>
                        ))}
                    </div>

                    {/* Trust row */}
                    <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '1px' }}>
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <FiStar key={i} size={13} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                                ))}
                            </div>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                {avgRating}/5 from {happyClients} Clients
                            </span>
                        </div>
                        <span style={{ color: 'var(--border-solid)' }}>|</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}><HiOutlineRocketLaunch size={14} style={{ color: 'var(--pista-primary)' }} /> {websitesDelivered} Websites Delivered</span>
                        <span style={{ color: 'var(--border-solid)' }}>|</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}><FiMapPin size={13} style={{ color: 'var(--pista-primary)' }} /> Bangalore, India</span>
                    </div>
                </div>

                {/* RIGHT — visual */}
                <div className={styles.right}>
                    <div className={styles.heroVisual}>
                        <div className={styles.logoCard}>
                            <Image src="/logo.jpeg" alt="AlgorySoft" width={90} height={90} className={styles.heroLogo} />
                            <span className={styles.logoName}>AlgorySoft</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, textAlign: 'center' }}>
                                Business Web Solutions
                            </span>
                        </div>

                        {FLOATING_CARDS.map((card, i) => {
                            const positions = [
                                styles.card1, styles.card2,
                                styles.card3, styles.card4,
                            ];
                            return (
                                <div
                                    key={i}
                                    className={`${styles.floatCard} ${positions[i]}`}
                                    style={{ animationDelay: `${card.delay}s` }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'var(--pista-xlight)', borderRadius: '10px', flexShrink: 0 }}>{card.icon}</span>
                                    <div>
                                        <p className={styles.cardTitle}>{card.title}</p>
                                        <p className={styles.cardSub}>{card.sub}</p>
                                    </div>
                                </div>
                            );
                        })}

                        <div className={styles.ringOuter} />
                        <div className={styles.ringInner} />
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className={styles.scrollHint}>
                <div className={styles.scrollLine} />
                <span>Explore Solutions</span>
            </div>
        </section>
    );
}
