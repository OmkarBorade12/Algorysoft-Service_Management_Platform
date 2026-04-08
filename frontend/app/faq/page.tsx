'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FiChevronDown, FiHelpCircle, FiMessageCircle, FiArrowRight } from 'react-icons/fi';
import styles from './faq.module.css';

const FAQPage = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const faqs = [
        {
            q: "What services does AlgorySoft provide?",
            a: "AlgorySoft is a full-stack digital solution studio. We specialize in custom website development, enterprise web applications, high-performance Android apps, SaaS platform engineering, AI-driven automation systems, human-centric UI/UX design, and robust e-commerce ecosystems. We also provide ongoing technical maintenance and post-launch support."
        },
        {
            q: "Do you work with startups and small businesses?",
            a: "Absolutely. We are passionate about empowering startups and emerging businesses. We work closely with entrepreneurs to transform their ideas into scalable digital products, offering flexible models that suit growing scales."
        },
        {
            q: "Can AlgorySoft build custom software based on business requirements?",
            a: "Yes, bespoke software is our core strength. We don't believe in one-size-fits-all solutions. Our engineering team builds software from scratch, tailored specifically to your unique business logic, operational workflows, and growth targets."
        },
        {
            q: "Do you provide maintenance and support after project delivery?",
            a: "Yes, we believe in long-term partnerships. Depending on your project agreement, we offer comprehensive post-launch support, including bug fixes, security updates, feature enhancements, and server maintenance to ensure your product remains state-of-the-art."
        },
        {
            q: "How can a client start a project with AlgorySoft?",
            a: "The process is simple. Connect with us via our contact form, email, or WhatsApp. Share your high-level requirements, and we will schedule a consultation to discuss the scope, timeline, and provide a detailed quotation."
        },
        {
            q: "Does AlgorySoft offer internship or fresher opportunities?",
            a: "Yes, we are always looking for fresh talent and innovative minds. Internship and entry-level opportunities are announced periodically based on our current project demands. You can check our Careers page for any active openings."
        }
    ];

    const toggleFaq = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <main className={styles.faqPage}>
            <div className="container">
                <header className={styles.header}>
                    <div className="badge badge-category" style={{ marginBottom: '16px' }}>Help Center</div>
                    <h1 className={styles.title}>Frequently Asked Questions</h1>
                    <p className={styles.subtitle}>
                        Find answers to common questions about our services, process, and 
                        how we help businesses grow.
                    </p>
                </header>

                <div className={styles.faqContainer}>
                    {faqs.map((faq, i) => (
                        <div 
                            key={i} 
                            className={`${styles.faqItem} ${activeIndex === i ? styles.active : ''}`}
                        >
                            <div 
                                className={styles.faqHeader} 
                                onClick={() => toggleFaq(i)}
                            >
                                <span className={styles.question}>{faq.q}</span>
                                <FiChevronDown className={styles.arrow} />
                            </div>
                            <div className={styles.faqContent}>
                                <div className={styles.answer}>
                                    {faq.a}
                                    {i === 5 && (
                                        <div style={{ marginTop: '15px' }}>
                                            <Link href="/careers" className="view-all-link" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>
                                                View Careers <FiArrowRight size={12} />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <section className={styles.supportBox}>
                    <FiHelpCircle size={40} color="var(--pista-primary)" style={{ marginBottom: '20px' }} />
                    <h2 className={styles.supportTitle}>Still have questions?</h2>
                    <p className={styles.subtitle} style={{ marginBottom: '32px' }}>
                        If you couldn't find the answer you were looking for, our team is 
                        ready to help you with your specific needs.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/contact" className="btn-primary">
                            Contact Support
                        </Link>
                        <a href="https://wa.me/917899533525" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiMessageCircle /> WhatsApp Us
                        </a>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default FAQPage;
