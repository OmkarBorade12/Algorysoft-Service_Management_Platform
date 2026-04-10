'use client';
import React, { useState } from 'react';
import { FiBriefcase, FiArrowRight, FiSend, FiCheckCircle, FiUpload, FiFileText, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import styles from './careers.module.css';

const CareersPage = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        position: '',
        portfolio: '',
        message: ''
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeFile) {
            toast.error('Please upload your resume / CV');
            return;
        }
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('email', form.email);
            formData.append('phone', form.phone);
            formData.append('position', form.position);
            formData.append('portfolio', form.portfolio);
            formData.append('message', form.message);
            formData.append('resume', resumeFile);

            const res = await fetch('/api/careers', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                setSubmitted(true);
                toast.success('Application sent! We will get back to you soon.');
            } else {
                const data = await res.json();
                toast.error(data.message || 'Something went wrong.');
            }
        } catch (err) {
            toast.error('Connection error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { title: 'Full Stack Developer', type: 'Full-time', desc: 'Build scalable web applications using React, Next.js, and Node.js.' },
        { title: 'UI/UX Designer', type: 'Remote/Office', desc: 'Create modern, human-centric designs for premium business solutions.' },
        { title: 'Android Developer', type: 'Full-time', desc: 'Develop high-performance mobile apps with a focus on user experience.' },
        { title: 'AI/ML Engineer', type: 'Full-time', desc: 'Integrate intelligent automation and machine learning into our core products.' }
    ];

    if (submitted) {
        return (
            <main className={styles.careersPage}>
                <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <div style={{ background: 'var(--pista-xlight)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', color: 'var(--pista-primary)' }}>
                        <FiCheckCircle size={40} />
                    </div>
                    <h1 className={styles.heroTitle}>Application Submitted!</h1>
                    <p className={styles.heroSubtitle}>
                        Thank you for your interest in joining AlgorySoft. Our HR team will review your 
                        profile and get in touch if your skills match our requirements.
                    </p>
                    <div style={{ marginTop: '40px' }}>
                        <button onClick={() => setSubmitted(false)} className="btn-secondary">Go Back</button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.careersPage}>
            <div className="container">
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>Build the Future with AlgorySoft</h1>
                    <p className={styles.heroSubtitle}>
                        Join a mission-driven team dedicated to engineering modern, scalable solutions 
                        for the next generation of digital businesses.
                    </p>
                </header>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Open Opportunities</h2>
                    <div className={styles.rolesGrid}>
                        {roles.map((role, i) => (
                            <div key={i} className={styles.roleCard}>
                                <span className={styles.roleBadge}>{role.type}</span>
                                <h3 className={styles.roleTitle}>{role.title}</h3>
                                <p className={styles.roleDesc}>{role.desc}</p>
                                <a href="#apply" className={styles.applyLink}>Apply Now <FiArrowRight /></a>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.formSection} id="apply">
                    <div className={styles.formCard}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div className="badge badge-category" style={{ marginBottom: '12px' }}>Join the Squad</div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Submit Your Application</h2>
                            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Tell us about your skills and we will find the perfect fit.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGrid}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-input" placeholder="Your Name" value={form.name} onChange={update('name')} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input type="tel" className="form-input" placeholder="+91 00000 00000" value={form.phone} onChange={update('phone')} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Position Interested In</label>
                                    <select className="form-input" value={form.position} onChange={update('position')} required>
                                        <option value="">Select a Role</option>
                                        {roles.map((r, i) => <option key={i} value={r.title}>{r.title}</option>)}
                                        <option value="Other">Other / General Interest</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Resume / CV (PDF, DOCX)</label>
                                    <div className={styles.fileUploadContainer}>
                                        <input
                                            type="file"
                                            id="resume-upload"
                                            className={styles.hiddenInput}
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                            required
                                        />
                                        <label htmlFor="resume-upload" className={styles.filePicker}>
                                            {resumeFile ? (
                                                <div className={styles.fileInfo}>
                                                    <FiFileText size={20} />
                                                    <span className={styles.fileName}>{resumeFile.name}</span>
                                                    <button 
                                                        type="button" 
                                                        className={styles.removeFile} 
                                                        onClick={(e) => { e.preventDefault(); setResumeFile(null); }}
                                                    >
                                                        <FiX />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className={styles.uploadPlaceholder}>
                                                    <FiUpload size={24} />
                                                    <span>Click to upload or drag & drop</span>
                                                    <small>PDF, DOCX (Max 5MB)</small>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Portfolio or GitHub Link (Optional)</label>
                                    <input type="url" className="form-input" placeholder="https://..." value={form.portfolio} onChange={update('portfolio')} />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label className="form-label">Your Message or Cover Note</label>
                                <textarea className="form-input" rows={5} placeholder="Tell us why you want to join AlgorySoft..." value={form.message} onChange={update('message')}></textarea>
                            </div>
                            <div style={{ marginTop: '30px' }}>
                                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                                    {loading ? 'Submitting...' : <><FiSend /> Submit Application</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default CareersPage;
