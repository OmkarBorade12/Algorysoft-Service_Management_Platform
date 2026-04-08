import React from 'react';
import styles from '../legal.module.css';

export const metadata = {
    title: 'Terms & Conditions | AlgorySoft',
    description: 'The terms and conditions governing the use of AlgorySoft services, software development, and website.',
};

const TermsConditionsPage = () => {
    return (
        <main className={styles.legalPage}>
            <div className="container">
                <header className={styles.header}>
                    <h1 className={styles.title}>Terms & Conditions</h1>
                    <p className={styles.updated}>Last Updated: April 8, 2026</p>
                </header>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Agreement to Terms</h2>
                        <p className={styles.text}>
                            By accessing or using AlgorySoft’s website and services, users agree to comply with and be bound by these 
                            Terms and Conditions. These terms govern the use of the website, inquiries, proposals, software development 
                            services, and all related communications between you and AlgorySoft.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Scope of Services</h2>
                        <p className={styles.text}>
                            AlgorySoft provides professional software engineering and digital transformation services, including:
                        </p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Custom Web Development & Modern Web Applications</li>
                            <li className={styles.listItem}>SaaS Product Engineering & Cloud Solutions</li>
                            <li className={styles.listItem}>Mobile Application Development (Android)</li>
                            <li className={styles.listItem}>AI-Powered Solutions & Process Automation</li>
                            <li className={styles.listItem}>UI/UX Design, Technical Consultation, and Maintenance</li>
                        </ul>
                        <p className={styles.text} style={{ marginTop: '15px' }}>
                            The specific scope, timeline, deliverables, and payment terms for each individual project will be 
                            explicitly defined in a separate proposal, quotation, or service agreement.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Client Responsibilities</h2>
                        <p className={styles.text}>
                            To ensure the successful delivery of high-quality solutions, clients are expected to:
                        </p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Provide accurate and comprehensive project requirements.</li>
                            <li className={styles.listItem}>Share necessary content, credentials, and approvals within agreed timelines.</li>
                            <li className={styles.listItem}>Adhere strictly to the payment schedule defined in the service agreement.</li>
                            <li className={styles.listItem}>Review deliverables and provide constructive feedback within a reasonable timeframe.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Intellectual Property Rights</h2>
                        <p className={styles.text}>
                            Unless otherwise agreed in writing, the ownership of final project deliverables will be transferred to 
                            the client after full and final payment has been received. 
                        </p>
                        <p className={styles.text} style={{ marginTop: '10px' }}>
                            AlgorySoft may retain the right to showcase non-confidential work in its professional portfolio for 
                            marketing purposes, unless explicitly restricted by a contractual Non-Disclosure Agreement (NDA).
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
                        <p className={styles.text}>
                            AlgorySoft, its founder Ikhlas Gadagin, and its team will not be liable for any indirect, incidental, 
                            or consequential damages arising from the use of its website or services. We provide our services with 
                            due diligence and professional care, but overall success depends on multiple factors including client 
                            cooperation and external environment.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Updates to These Terms</h2>
                        <p className={styles.text}>
                            These terms may be updated from time to time to reflect changes in our business practices or legal 
                            requirements. Continued use of the website or our professional services after such updates constitutes 
                            full acceptance of the revised Terms and Conditions.
                        </p>
                    </section>

                    <div className={styles.contactBox}>
                        <h3 className={styles.contactTitle}>Legal Inquiries?</h3>
                        <p className={styles.text}>
                            If you have any questions regarding our Terms and Conditions, please feel free to reach out.
                        </p>
                        <p className={styles.text} style={{ marginTop: '10px', fontWeight: 700, color: 'var(--pista-primary)' }}>
                            Email: algorysoft@gmail.com
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default TermsConditionsPage;
