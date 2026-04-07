'use client';
import { useState } from 'react';
import { useAppDispatch } from '@/hooks/useRedux';
import { closeModals, openRegister } from '@/store/slices/uiSlice';
import { setUser } from '@/store/slices/authSlice';
import { setCartUser } from '@/store/slices/cartSlice';
import { setWishlistUser } from '@/store/slices/wishlistSlice';
import toast from 'react-hot-toast';
import styles from './AuthModal.module.css';
import { FiX, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { loginUser } from '@/lib/localUsers';
import SocialAuthButtons from './SocialAuthButtons';

export default function LoginModal() {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Try the real backend first
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.algorysoft.com';
            const res = await fetch(`${apiBase}/api/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                dispatch(setUser({ id: data.user.id, name: data.user.name, email: data.user.email, token: data.token, role: data.user.role || 'customer' }));
                dispatch(setCartUser(data.user.email));
                dispatch(setWishlistUser(data.user.email));
                toast.success(`Welcome back, ${data.user.name}! 🎉︎︎`);
                dispatch(closeModals());
            } else {
                toast.error(data.message || 'Invalid email or password');
            }
        } catch {
            // Backend unavailable — validate against locally registered users only
            const found = loginUser(email, password);
            if (found) {
                dispatch(setUser({ id: found.id, name: found.name, email: found.email, role: found.role }));
                dispatch(setCartUser(found.email));
                dispatch(setWishlistUser(found.email));
                toast.success(`Welcome back, ${found.name}! 🎉︎︎`);
                dispatch(closeModals());
            } else {
                toast.error('No account found with these credentials. Please register first.');
            }
        }

        setLoading(false);
    };
    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && dispatch(closeModals())}>
            <div className="modal-content animate-fadeInUp">
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiLogIn size={20} /> Welcome Back</h2>
                    <p className={styles.modalSub}>Sign in to access your projects</p>
                    <button className={styles.closeBtn} onClick={() => dispatch(closeModals())}><FiX size={18} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingRight: '45px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '5px'
                                }}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className={styles.forgot}>
                        <a href="/forgot-password" className={styles.forgotLink}>Forgot password?</a>
                    </div>
                    <button type="submit" className="btn-primary" style={{ ...{ width: '100%', justifyContent: 'center' } }} disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In →'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>or continue with</span>
                </div>

                <SocialAuthButtons mode="login" />

                <p className={styles.switchText}>
                    Don&apos;t have an account?{' '}
                    <button className={styles.switchBtn} onClick={() => dispatch(openRegister())}>Register here</button>
                </p>
            </div>
        </div>
    );
}
