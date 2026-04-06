'use client';
import { useState } from 'react';
import { EMAIL, PHONE, WORKING_HOURS } from '@/lib/data';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success('Your message has been sent successfully! 📧');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                toast.error('Failed to send message. Please try again.');
            }
        } catch (err) {
            console.error('Contact Form Error:', err);
            toast.error('Something went wrong. Please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container" style={{ padding: '80px 24px', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', textAlign: 'center' }}>Contact Us</h1>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '40px', fontSize: '1.1rem' }}>
                We&apos;re here to help with your engineering project needs.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '60px' }}>
                <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📍</div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Visit Us</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>123 Hub Layout, Sector 4<br />Bangalore, KA 560034</p>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📞</div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Call Us</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{PHONE}<br />{WORKING_HOURS}</p>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✉️</div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Email Us</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{EMAIL}<br />24/7 Support Available</p>
                </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Send a Message</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Subject</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="How can we help?"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Message</label>
                        <textarea
                            className="form-input"
                            rows={5}
                            placeholder="Type your message here..."
                            style={{ resize: 'vertical' }}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ justifySelf: 'start', marginTop: '10px' }}
                        disabled={submitting}
                    >
                        {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
}
