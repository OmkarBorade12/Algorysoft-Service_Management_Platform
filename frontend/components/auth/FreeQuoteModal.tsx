'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { closeModals } from '@/store/slices/uiSlice';
import { addRequestThunk } from '@/store/slices/requestsSlice';
import toast from 'react-hot-toast';
import { FiX, FiSend, FiMessageSquare, FiUser, FiMail, FiPhone, FiBriefcase } from 'react-icons/fi';
import styles from './AuthModal.module.css'; // Reusing styles

export default function FreeQuoteModal() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(s => s.auth);
    const [form, setForm] = useState({
        client: user?.name || '',
        email: user?.email || '',
        phone: '',
        business: '',
        requirements: '',
        timeline: '2 weeks',
        budget: '₹10k - ₹25k'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.requirements) return toast.error('Please enter your requirements');
        setLoading(true);
        try {
            await dispatch(addRequestThunk({
                ...form,
                status: 'New'
            })).unwrap();
            toast.success('Request sent! Our team will contact you shortly. 🚀');
            dispatch(closeModals());
        } catch (err: any) {
            toast.error(err.message || 'Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && dispatch(closeModals())}>
            <div className="modal-content animate-fadeInUp" style={{ maxWidth: '600px' }}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiMessageSquare size={20} /> Get a Free Quote
                    </h2>
                    <p className={styles.modalSub}>Tell us about your project requirements</p>
                    <button className={styles.closeBtn} onClick={() => dispatch(closeModals())}><FiX size={18} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiUser size={14}/> Name</label>
                            <input type="text" className="form-input" value={form.client} onChange={e => setForm({...form, client: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiMail size={14}/> Email</label>
                            <input type="email" className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiPhone size={14}/> Phone</label>
                            <input type="tel" className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiBriefcase size={14}/> Business Name</label>
                            <input type="text" className="form-input" value={form.business} onChange={e => setForm({...form, business: e.target.value})} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tell us what you need built</label>
                        <textarea 
                            className="form-input" 
                            style={{ height: '100px', paddingTop: '12px' }} 
                            placeholder="e.g. I want an E-commerce site for my clothing brand with 10 products..."
                            value={form.requirements}
                            onChange={e => setForm({...form, requirements: e.target.value})}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                            <label className="form-label">Timeline</label>
                            <select className="form-input" value={form.timeline} onChange={e => setForm({...form, timeline: e.target.value})}>
                                <option>1 week</option>
                                <option>2 weeks</option>
                                <option>1 month</option>
                                <option>More than 1 month</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Estimated Budget</label>
                            <select className="form-input" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})}>
                                <option>Under ₹10k</option>
                                <option>₹10k - ₹25k</option>
                                <option>₹25k - ₹50k</option>
                                <option>₹50k+</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }} disabled={loading}>
                        <FiSend /> {loading ? 'Sending...' : 'Send Request →'}
                    </button>
                </form>
            </div>
        </div>
    );
}
