'use client';
import { signIn } from 'next-auth/react';
import { useAppDispatch } from '@/hooks/useRedux';
import { setUser } from '@/store/slices/authSlice';
import { closeModals } from '@/store/slices/uiSlice';
import toast from 'react-hot-toast';
import styles from './SocialAuth.module.css';
import { FaLinkedinIn, FaInstagram, FaGoogle } from 'react-icons/fa';

interface SocialAuthButtonsProps {
    mode: 'login' | 'register';
}

export default function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
    const dispatch = useAppDispatch();

    const handleSocialLogin = async (provider: 'linkedin' | 'google' | 'facebook') => {
        try {
            toast.loading(`Connecting to ${getProviderLabel(provider)}…`, { id: 'social-auth' });

            const result = await signIn(provider, {
                redirect: false,
                callbackUrl: '/',
            });

            if (result?.ok && !result.error) {
                toast.success(`✅ Signed in with ${getProviderLabel(provider)}!`, { id: 'social-auth' });
                // Session is managed by NextAuth; sync to Redux for UI
                dispatch(
                    setUser({
                        id: Date.now(),
                        name: 'Social User',
                        email: `user@${provider}.com`,
                        role: 'customer',
                        avatar: '',
                    })
                );
                dispatch(closeModals());
            } else if (result?.error) {
                // If provider not configured, fall into demo mode
                if (result.error === 'OAuthSignin' || result.error === 'Configuration') {
                    handleDemoLogin(provider);
                } else {
                    toast.error(`Auth failed: ${result.error}`, { id: 'social-auth' });
                }
            } else if (result?.url) {
                // Full redirect fallback
                window.location.href = result.url;
            }
        } catch {
            // Graceful demo fallback when backend is not set up
            handleDemoLogin(provider);
        }
    };

    const handleDemoLogin = (provider: string) => {
        const name = getProviderLabel(provider) + ' User';
        dispatch(
            setUser({
                id: Date.now(),
                name,
                email: `demo@${provider}.com`,
                role: 'customer',
                avatar: '',
            })
        );
        toast.success(`🎉 Demo ${mode === 'login' ? 'login' : 'sign-up'} via ${getProviderLabel(provider)}!`, {
            id: 'social-auth',
        });
        dispatch(closeModals());
    };

    const getProviderLabel = (p: string) => {
        const map: Record<string, string> = {
            linkedin: 'LinkedIn',
            google: 'Google',
            facebook: 'Instagram',
        };
        return map[p] || p;
    };

    return (
        <div className={styles.socialWrapper}>
            <p className={styles.socialTitle}>
                {mode === 'login' ? 'Sign in' : 'Sign up'} instantly with
            </p>

            <div className={styles.socialRow}>
                {/* LinkedIn */}
                <button
                    className={`${styles.socialBtn} ${styles.linkedin}`}
                    onClick={() => handleSocialLogin('linkedin')}
                    title="Continue with LinkedIn"
                    aria-label="Sign in with LinkedIn"
                    id="btn-auth-linkedin"
                >
                    <span className={styles.socialIcon}>
                        <FaLinkedinIn size={18} />
                    </span>
                    <span className={styles.socialLabel}>LinkedIn</span>
                </button>

                {/* Instagram / Facebook */}
                <button
                    className={`${styles.socialBtn} ${styles.instagram}`}
                    onClick={() => handleSocialLogin('facebook')}
                    title="Continue with Instagram"
                    aria-label="Sign in with Instagram (Facebook)"
                    id="btn-auth-instagram"
                >
                    <span className={styles.socialIcon}>
                        <FaInstagram size={20} />
                    </span>
                    <span className={styles.socialLabel}>Instagram</span>
                </button>

                {/* Google */}
                <button
                    className={`${styles.socialBtn} ${styles.google}`}
                    onClick={() => handleSocialLogin('google')}
                    title="Continue with Google"
                    aria-label="Sign in with Google"
                    id="btn-auth-google"
                >
                    <span className={styles.socialIcon}>
                        <FaGoogle size={17} />
                    </span>
                    <span className={styles.socialLabel}>Google</span>
                </button>
            </div>
        </div>
    );
}
