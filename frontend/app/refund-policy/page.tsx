import React from 'react';
import styles from '../legal.module.css';

export const metadata = {
    title: 'Refund Policy | AlgorySoft',
    description: 'Learn about AlgorySoft’s refund and cancellation policies for software development and digital services.',
};

const RefundPolicyPage = () => {
    return (
        <main className={styles.legalPage}>
            <div className="container">
                <header className={styles.header}>
                    <h1 className={styles.title}>Refund Policy</h1>
                    <p className={styles.updated}>Last Updated: April 8, 2026</p>
                </header>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Fairness & Transparency</h2>
                        <p className={styles.text}>
                            AlgorySoft aims to maintain fairness and transparency in all project engagements. Since software 
                            development and digital services involve extensive planning, research, design effort, and resource 
                            allocation from day one, refunds are handled based on the project stage and the type of service provided.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>General Refund Rules</h2>
                        <p className={styles.text}>
                            To ensure the sustainability of our professional services, we adhere to the following refund guidelines:
                        </p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}><strong>Advance Payments:</strong> Payments made for project booking, initial planning, or resource allocation are generally non-refundable as they secure project availability.</li>
                            <li className={styles.listItem}><strong>Work-in-Progress:</strong> If a project is cancelled after development has started, refunds may only apply to the remaining unworked portion of the project.</li>
                            <li className={styles.listItem}><strong>Delivered Work:</strong> Completed milestones, delivered designs, source files, or strategic consultation work are strictly non-refundable.</li>
                            <li className={styles.listItem}><strong>Subscriptions:</strong> Monthly maintenance, hosting, domain registration, and third-party subscription charges are non-refundable once activated or billed.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Project Cancellation</h2>
                        <p className={styles.text}>
                            If a client chooses to cancel a project after work has officially commenced, AlgorySoft will deduct 
                            charges equivalent to the work completed, engineering time spent, and any third-party costs 
                            already incurred before calculating any eligible refund amount.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Refund Timeline</h2>
                        <p className={styles.text}>
                            Approved refunds are typically processed within <strong>7 to 14 business days</strong>. Refunds will be 
                            issued through the original payment method or another mutually agreed-upon method in writing.
                        </p>
                    </section>

                    <div className={styles.contactBox}>
                        <h3 className={styles.contactTitle}>Refund Request?</h3>
                        <p className={styles.text}>
                            If you have any questions or wish to initiate a discussion regarding a project refund, please contact us.
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

export default RefundPolicyPage;
