'use client';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { isAuthenticated, user } = useAppSelector(s => s.auth);
    const { wishlistOpen } = useAppSelector(s => s.ui);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+91 9876543210',
        address: 'RAJIV GANDHI NAGAR, GADAG, KARNATAKA, India'
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !user) return null;

    const handleSave = () => {
        setIsEditing(false);
        toast.success('🎉︎︎ Profile information updated successfully!');
    };

    const handleLogout = () => {
        dispatch(logout());
        toast('Logged out successfully');
        import('next-auth/react').then(mod => mod.signOut({ redirect: false }));
        router.push('/');
    };

    return (
        <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', padding: '60px 0' }}>
            <div className="container animate-fadeInUp" style={{ maxWidth: 900 }}>
                {/* Header Profile Card */}
                <div className="glass-card" style={{ padding: 40, display: 'flex', alignItems: 'center', gap: 32, marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: 300, background: 'var(--gradient-glow)', borderRadius: '50%', transform: 'translate(30%, -30%)', pointerEvents: 'none' }} />
                    
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ 
                            width: 120, height: 120, borderRadius: '50%', background: 'var(--gradient-primary)', color: 'white', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800,
                            boxShadow: '0 12px 32px rgba(109, 176, 58, 0.4)'
                        }}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.role === 'admin' && (
                            <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#1e40af', color: 'white', padding: '4px 12px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 800, border: '3px solid white' }}>
                                ADMIN 👑︎︎
                            </div>
                        )}
                    </div>

                    <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                            {user.name}
                        </h1>
                        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                            📧︎︎ {user.email}
                        </p>
                        
                        <div style={{ display: 'flex', gap: 16 }}>
                            {user.role === 'admin' && (
                                <Link href="/admin" className="btn-secondary" style={{ padding: '8px 24px', fontSize: '0.9rem', borderColor: '#1e40af', color: '#1e40af', background: '#eff6ff' }}>
                                    Go to Admin Area 🚀︎︎
                                </Link>
                            )}
                            <button onClick={handleLogout} style={{ padding: '8px 24px', fontSize: '0.9rem', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 99, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
                    
                    {/* Main Details Panel */}
                    <div className="glass-card" style={{ padding: 40 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border-solid)', paddingBottom: 16 }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>Personal Information</h2>
                            <button 
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
                                className={isEditing ? 'btn-primary' : 'btn-secondary'} 
                                style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                            >
                                {isEditing ? '💾︎︎ Save Changes' : '✏︎︎︎ Edit Profile'}
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
                                {isEditing ? (
                                    <input className="form-input" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} />
                                ) : (
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', padding: '12px 0' }}>{formData.name}</div>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
                                {isEditing ? (
                                    <input className="form-input" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} />
                                ) : (
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', padding: '12px 0' }}>{formData.email}</div>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>Phone Number</label>
                                {isEditing ? (
                                    <input className="form-input" value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value}))} />
                                ) : (
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', padding: '12px 0' }}>{formData.phone}</div>
                                )}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>Billing Address</label>
                                {isEditing ? (
                                    <textarea className="form-input" rows={3} value={formData.address} onChange={e => setFormData(p => ({...p, address: e.target.value}))} style={{ resize: 'vertical' }} />
                                ) : (
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', padding: '12px 0', lineHeight: 1.6 }}>{formData.address}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {user.role !== 'admin' && (
                            <div className="glass-card" style={{ padding: 32, textAlign: 'center', borderTop: '4px solid var(--pista-primary)' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--pista-dark)', lineHeight: 1 }}>2</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 8, letterSpacing: '1px' }}>Active Projects</div>
                                <Link href="/orders" className="btn-primary" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>Track Orders</Link>
                            </div>
                        )}
                        
                        <div className="glass-card" style={{ padding: 32, textAlign: 'center', borderTop: '4px solid #f59e0b' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#b45309', lineHeight: 1 }}>1</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 8, letterSpacing: '1px' }}>Saved To Wishlist</div>
                            <Link href="/projects" className="btn-secondary" style={{ marginTop: 20, width: '100%', justifyContent: 'center', borderColor: '#f59e0b', color: '#b45309' }}>View Wishlist ❤︎︎︎</Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
