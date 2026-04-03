'use client';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import styles from './SocialAuth.module.css';
import { FaGoogle } from 'react-icons/fa';

interface SocialAuthButtonsProps {
    mode: 'login' | 'register';
}

export default function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
    const handleSocialLogin = async (provider: 'google') => {
        try {
            toast.loading(`Connecting to Google…`, { id: 'social-auth', duration: 3000 });
            await signIn(provider); // default redirect=true pushes browser cleanly to Google
        } catch (err) {
            toast.error(`Google Authentication Error.`, { id: 'social-auth' });
        }
    };

    const getProviderLabel = (p: string) => {
        const map: Record<string, string> = {
            google: 'Google',
        };
        return map[p] || p;
    };

    return (
        <div className={styles.socialWrapper}>
            <div className={styles.socialRow}>
                {/* Google */}
                <button
                    type="button"
                    className={`${styles.socialBtn} ${styles.google}`}
                    onClick={(e) => {
                        e.preventDefault();
                        handleSocialLogin('google');
                    }}
                    title="Continue with Google"
                    aria-label="Sign in with Google"
                    id="btn-auth-google"
                >
                    <span className={styles.socialIcon}>
                        <FaGoogle size={18} />
                    </span>
                    <span className={styles.socialLabel}>Continue with Google</span>
                </button>
            </div>
        </div>
    );
}
