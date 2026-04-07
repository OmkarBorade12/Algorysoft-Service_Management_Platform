'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { PHONE, EMAIL, WORKING_HOURS, WHATSAPP, LINKEDIN, INSTAGRAM } from '@/lib/data';
import { useAppSelector } from '@/hooks/useRedux';
import { FaWhatsapp, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FiClock, FiPhone, FiMail, FiChevronRight, FiGlobe } from 'react-icons/fi';
import { CATEGORY_ICON_MAP } from '@/lib/icons';

export default function Footer() {
    const categories = useAppSelector((s) => s.categories.items);
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerGrid}`}>
                {/* Brand */}
                <div className={styles.brand}>
                    <Image src="/logo-wide.jpeg" alt="AlgorySoft" width={160} height={44} className={styles.logo} style={{ objectFit: 'contain' }} />
                    <p className={styles.brandDesc}>
                        India's premier digital solution partner for businesses. We deliver premium, 
                        scalable web applications, custom software solutions, and end-to-end 
                        digital transformation to help your brand lead in the modern era.
                    </p>
                    <div className={styles.socialLinks}>
                        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className={`${styles.socialBtn} ${styles.socialWa}`} title="WhatsApp"><FaWhatsapp size={18} /></a>
                        <a href={INSTAGRAM} target="_blank" rel="noreferrer" className={`${styles.socialBtn} ${styles.socialIg}`} title="Instagram"><FaInstagram size={18} /></a>
                        <a href={LINKEDIN} target="_blank" rel="noreferrer" className={`${styles.socialBtn} ${styles.socialLi}`} title="LinkedIn"><FaLinkedinIn size={18} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className={styles.colTitle}>Quick Links</h4>
                    <ul className={styles.links}>
                        {['Home', 'About Us', 'Projects', 'Contact Us', 'FAQ'].map((link) => (
                            <li key={link}><Link href={link === 'Home' ? '/' : `/${link.toLowerCase().replace(/ /g, '-')}`} className={styles.link} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiChevronRight size={13} style={{ color: 'var(--pista-primary)', flexShrink: 0 }} /> {link}</Link></li>
                        ))}
                    </ul>
                </div>

                {/* Project Categories */}
                <div>
                    <h4 className={styles.colTitle}>Top Categories</h4>
                    <ul className={styles.links}>
                        {categories.slice(0, 8).map((cat) => (
                            <li key={cat.id}>
                                <Link href={`/projects?category=${cat.slug}`} className={styles.link} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                    <span style={{ color: 'var(--pista-primary)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{CATEGORY_ICON_MAP[cat.slug] || <FiGlobe size={14} />}</span>
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className={styles.colTitle}>Contact Us</h4>
                    <div className={styles.contactItems}>
                        <div className={styles.contactItem}>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiClock size={17} /></span>
                            <div>
                                <div className={styles.contactLabel}>Working Hours</div>
                                <div className={styles.contactValue}>{WORKING_HOURS}</div>
                            </div>
                        </div>
                        <div className={styles.contactItem}>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiPhone size={17} /></span>
                            <div>
                                <div className={styles.contactLabel}>Phone</div>
                                <a href={`tel:${PHONE}`} className={`${styles.contactValue} ${styles.contactLink}`}>{PHONE}</a>
                            </div>
                        </div>
                        <div className={styles.contactItem}>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366' }}><FaWhatsapp size={18} /></span>
                            <div>
                                <div className={styles.contactLabel}>WhatsApp</div>
                                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className={`${styles.contactValue} ${styles.contactLink}`}>Chat Now</a>
                            </div>
                        </div>
                        <div className={styles.contactItem}>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiMail size={17} /></span>
                            <div>
                                <div className={styles.contactLabel}>Email</div>
                                <a href={`mailto:${EMAIL}`} className={`${styles.contactValue} ${styles.contactLink}`}>{EMAIL}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        © {new Date().getFullYear()} AlgorySoft. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {['Privacy Policy', 'Terms & Conditions', 'Refund Policy'].map((t) => (
                            <Link key={t} href={`/${t.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className={styles.policyFooterLink}>
                                {t}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
