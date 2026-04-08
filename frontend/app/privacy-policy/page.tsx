import React from 'react';
import styles from '../legal.module.css';

export const metadata = {
    title: 'Privacy Policy | AlgorySoft',
    description: 'Our commitment to protecting your data. Learn how AlgorySoft collects, uses, and safeguards your information.',
};

const PrivacyPolicyPage = () => {
    return (
        <main className={styles.legalPage}>
            <div className="container">
                <header className={styles.header}>
                    <h1 className={styles.title}>Privacy Policy</h1>
                    <p className={styles.updated}>Last Updated: April 8, 2026</p>
                </header>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Introduction</h2>
                        <p className={styles.text}>
                            At AlgorySoft, accessible from www.algorysoft.com, one of our main priorities is the privacy of our visitors. 
                            This Privacy Policy document contains types of information that is collected and recorded by AlgorySoft and how we use it. 
                            We prioritize user privacy and ensure responsible data handling at every stage of our service delivery.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Information We Collect</h2>
                        <p className={styles.text}>
                            We collect information that you provide directly to us to facilitate our services and improve your experience. 
                            The types of information we may collect include:
                        </p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}><strong>Personal Identifiers:</strong> Name, email address, and phone number.</li>
                            <li className={styles.listItem}><strong>Business Information:</strong> Company name and detailed project requirements.</li>
                            <li className={styles.listItem}><strong>Financial Data:</strong> Billing details and transaction records for service fulfillment.</li>
                            <li className={styles.listItem}><strong>Communication History:</strong> Records of your inquiries, support requests, and feedback.</li>
                            <li className={styles.listItem}><strong>Usage Data:</strong> Information about how you use our website, collected to optimize performance.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
                        <p className={styles.text}>
                            The information we collect is used to power our mission of delivering reliable digital solutions:
                        </p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Responding to your inquiries and providing accurate service quotations.</li>
                            <li className={styles.listItem}>Developing and delivering the custom software, apps, and websites you request.</li>
                            <li className={styles.listItem}>Improving our website performance and the quality of our services.</li>
                            <li className={styles.listItem}>Sending important project updates, security alerts, and administrative messages.</li>
                            <li className={styles.listItem}>Complying with legal obligations and protecting against fraudulent activity.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Data Protection</h2>
                        <p className={styles.text}>
                            AlgorySoft implements robust security measures to protect your data from unauthorized access, alteration, 
                            disclosure, or destruction. We limit access to your personal information to employees and contractors 
                            who need that information to process it for us.
                        </p>
                    </section>

                    <div className={styles.contactBox}>
                        <h3 className={styles.contactTitle}>Questions or Concerns?</h3>
                        <p className={styles.text}>
                            If you have any questions about our Privacy Policy or data practices, please reach out to our team.
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

export default PrivacyPolicyPage;
