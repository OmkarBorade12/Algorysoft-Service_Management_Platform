import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
    FiCode, FiSmartphone, FiCpu, FiLayout, FiShoppingBag, FiTool, 
    FiCheckCircle, FiClock, FiMessageSquare, FiTrendingUp, FiTarget, FiEye
} from 'react-icons/fi';
import styles from './about.module.css';

export const metadata = {
    title: 'About AlgorySoft | Leading Digital Solution Provider',
    description: 'Learn about AlgorySoft, a technology company founded by Ikhlas Gadagin, focused on delivering premium web, mobile, and AI solutions.',
};

const AboutPage = () => {
    return (
        <main className={styles.aboutPage}>
            <div className="container">
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <span className={styles.heroBadge}>Excellence in Technology</span>
                        <h1 className={styles.heroTitle}>Engineering the Future of Digital Business</h1>
                        <p className={styles.heroSubtitle}>
                            AlgorySoft is a premier technology partner dedicated to engineering sophisticated, 
                            scalable, and intuitive digital solutions that empower modern brands to lead.
                        </p>
                    </div>
                </section>

                {/* About Section */}
                <section className={styles.section}>
                    <div className={styles.grid}>
                        <div className={styles.founderContent}>
                            <h2 className={styles.sectionTitle} style={{ textAlign: 'left', margin: '0 0 30px' }}>Our Identity</h2>
                            <p className={styles.founderBio}>
                                Founded by visionary entrepreneur <strong>Ikhlas Gadagin</strong>, AlgorySoft was established with a 
                                clear mandate: bridge the gap between complex business challenges and elegant technical solutions. 
                                We combine technology, creativity, and practical business understanding to build products 
                                that are not only functional but also valuable in real-world environments.
                            </p>
                            <p className={styles.founderBio} style={{ marginTop: '20px' }}>
                                Headquartered in Gadag, Karnataka, we have grown into a trusted technology partner for startups, 
                                businesses, and enterprises worldwide, delivering impactful software products and long-term digital value.
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className={styles.founderImage} style={{ width: '100%', height: 'auto', aspectRatio: '4/3' }}>
                                <Image 
                                    src="/algorysoft.jpeg" 
                                    alt="AlgorySoft Workplace" 
                                    width={600} 
                                    height={450} 
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className={styles.missionVision}>
                    <div className={styles.mvCard}>
                        <span className={styles.mvLabel}>The Why</span>
                        <FiTarget className={styles.cardIcon} style={{ margin: '0 0 20px' }} />
                        <h3 className={styles.mvTitle}>Our Mission</h3>
                        <p className={styles.mvText}>
                            To help businesses grow through innovative, reliable, and scalable digital 
                            solutions tailored to real-world needs and future-proof architectures.
                        </p>
                    </div>
                    <div className={styles.mvCard}>
                        <span className={styles.mvLabel}>The Goal</span>
                        <FiEye className={styles.cardIcon} style={{ margin: '0 0 20px' }} />
                        <h3 className={styles.mvTitle}>Our Vision</h3>
                        <p className={styles.mvText}>
                            To become a global technology partner of choice, recognized for delivering 
                            unparalleled software quality and transformative digital strategy.
                        </p>
                    </div>
                </section>

                {/* What We Do */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Our Expertise</h2>
                    <div className={styles.grid}>
                        {[
                            { icon: <FiLayout />, title: 'Custom Websites', desc: 'Bespoke, responsive, and SEO-optimized website development for brands.' },
                            { icon: <FiCode />, title: 'Web Applications', desc: 'Powerful enterprise applications built with modern stacks like React and Next.js.' },
                            { icon: <FiCpu />, title: 'SaaS Development', desc: 'End-to-end SaaS product engineering from concept to scalable cloud deployment.' },
                            { icon: <FiSmartphone />, title: 'Android Apps', desc: 'High-performance, user-centric mobile applications for the Android ecosystem.' },
                            { icon: <FiTrendingUp />, title: 'AI & Machine Learning', desc: 'Integrating intelligent algorithms and automation to optimize business processes.' },
                            { icon: <FiShoppingBag />, title: 'E-commerce', desc: 'Robust online stores designed for high conversion and seamless management.' },
                            { icon: <FiEye />, title: 'UI/UX Design', desc: 'Human-centric, premium designs that enhance user engagement and brand value.' },
                            { icon: <FiTool />, title: 'Software Support', desc: 'Comprehensive maintenance and long-term technical support for all products.' },
                        ].map((item, index) => (
                            <div key={index} className={styles.card}>
                                <div className={styles.cardIcon}>{item.icon}</div>
                                <h4 className={styles.cardTitle}>{item.title}</h4>
                                <p className={styles.cardText}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className={styles.section} style={{ background: 'var(--bg-secondary)', padding: '80px 40px', borderRadius: 'var(--radius-2xl)' }}>
                    <h2 className={styles.sectionTitle}>Why Choose AlgorySoft</h2>
                    <div className={styles.grid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                        {[
                            { icon: <FiCheckCircle />, title: 'Client-Focused', desc: 'Your business goals are at the heart of our development process.' },
                            { icon: <FiTrendingUp />, title: 'Scalable Code', desc: 'Clean, maintainable architecture that grows with your business.' },
                            { icon: <FiMessageSquare />, title: 'Transparency', desc: 'Clear communication and honest feedback at every step.' },
                            { icon: <FiClock />, title: 'Timely Delivery', desc: 'We respect deadlines and deliver quality within the agreed timeline.' },
                        ].map((item, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <div className={styles.cardIcon} style={{ margin: '0 auto 20px' }}>{item.icon}</div>
                                <h4 className={styles.cardTitle}>{item.title}</h4>
                                <p className={styles.cardText}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Company Details */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Corporate Profile</h2>
                    <div className={styles.detailsList}>
                        {[
                            { label: 'Company Name', value: 'AlgorySoft' },
                            { label: 'Founder', value: 'Ikhlas Gadagin' },
                            { label: 'Presence', value: 'Gadag, Karnataka, India' },
                            { label: 'Email', value: 'algorysoft@gmail.com' },
                            { label: 'Website', value: 'www.algorysoft.com' },
                        ].map((detail, index) => (
                            <div key={index} className={styles.detailItem}>
                                <span className={styles.detailLabel}>{detail.label}</span>
                                <span className={styles.detailValue}>{detail.value}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link href="/contact" className="btn-primary">
                            Get In Touch With Us
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default AboutPage;
