'use client';
import { useState } from 'react';
import { useAppDispatch } from '@/hooks/useRedux';
import { closeModals, openLogin } from '@/store/slices/uiSlice';
import { setUser } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import styles from './AuthModal.module.css';
import { FiX, FiUserPlus } from 'react-icons/fi';
import { registerUser } from '@/lib/localUsers';
import SocialAuthButtons from './SocialAuthButtons';

export default function RegisterModal() {
    const dispatch = useAppDispatch();
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', mobile: '', city: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) { toast.error('Please agree to Terms & Conditions'); return; }
        if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
        setLoading(true);

        try {
            // 1. Try real backend first
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.algorysoft.com';
            const res = await fetch(`${apiBase}/api/auth/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, name: `${form.firstName} ${form.lastName}` }),
            });
            const data = await res.json();
            if (res.ok) {
                dispatch(setUser({ id: data.user.id, name: data.user.name, email: data.user.email, token: data.token, role: data.user.role || 'customer' }));
                toast.success('Account created successfully! 🎉');
                dispatch(closeModals());
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch {
            // Backend unavailable — save to localStorage
            const saved = registerUser({
                name: `${form.firstName} ${form.lastName}`,
                email: form.email,
                password: form.password,
                role: 'customer',
                mobile: form.mobile,
                city: form.city,
            });

            if (!saved) {
                toast.error('An account with this email already exists. Please sign in.');
                setLoading(false);
                return;
            }

            dispatch(setUser({ id: saved.id, name: saved.name, email: saved.email, role: saved.role }));
            toast.success('Account created successfully! 🎉');
            dispatch(closeModals());
        }

        setLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && dispatch(closeModals())}>
            <div className="modal-content animate-fadeInUp" style={{ maxWidth: '560px' }}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiUserPlus size={20} /> Create Account</h2>
                    <p className={styles.modalSub}>Join 500+ businesses powered by AlgorySoft</p>
                    <button className={styles.closeBtn} onClick={() => dispatch(closeModals())}><FiX size={18} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input type="text" className="form-input" placeholder="John" value={form.firstName} onChange={update('firstName')} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input type="text" className="form-input" placeholder="Doe" value={form.lastName} onChange={update('lastName')} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Mobile Number</label>
                        <input type="tel" className="form-input" placeholder="+91 98765 43210" value={form.mobile} onChange={update('mobile')} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">City</label>
                        <input type="text" className="form-input" placeholder="Bangalore" value={form.city} onChange={update('city')} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={update('password')} required minLength={6} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input type="password" className="form-input" placeholder="••••••••" value={form.confirmPassword} onChange={update('confirmPassword')} required />
                        </div>
                    </div>
                    <div className={styles.checkboxRow}>
                        <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                        <label htmlFor="terms" className={styles.checkboxLabel}>
                            I agree to the <a href="/terms-conditions" className={styles.policyLink}>Terms &amp; Conditions</a> and{' '}
                            <a href="/privacy-policy" className={styles.policyLink}>Privacy Policy</a>
                        </label>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account →'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>or continue with</span>
                </div>

                <SocialAuthButtons mode="register" />

                <p className={styles.switchText}>
                    Already have an account?{' '}
                    <button className={styles.switchBtn} onClick={() => dispatch(openLogin())}>Sign in here</button>
                </p>
            </div>
        </div>
    );
}
