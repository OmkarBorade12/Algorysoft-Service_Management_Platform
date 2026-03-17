'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { logout } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import './berry.css'; // Import the Berry UI theme

import { 
    FiBarChart2, 
    FiBox, 
    FiCreditCard, 
    FiStar, 
    FiFileText, 
    FiShoppingCart, 
    FiImage, 
    FiMessageSquare, 
    FiFile,
    FiGlobe,
    FiLogOut,
    FiCodepen
} from 'react-icons/fi';

const NAV_ITEMS = [
    { href: '/admin', icon: <FiBarChart2 size={20} />, label: 'Dashboard' },
    { href: '/admin/products', icon: <FiBox size={20} />, label: 'Products' },
    { href: '/admin/cards', icon: <FiCreditCard size={20} />, label: 'Pricing Cards' }, 
    { href: '/admin/features', icon: <FiStar size={20} />, label: 'Features' },
    { href: '/admin/requests', icon: <FiFileText size={20} />, label: 'Custom Requests' },
    { href: '/admin/orders', icon: <FiShoppingCart size={20} />, label: 'Order Management' },
    { href: '/admin/carousel', icon: <FiImage size={20} />, label: 'Carousel' },
    { href: '/admin/reviews', icon: <FiMessageSquare size={20} />, label: 'Reviews' },
    { href: '/admin/invoices', icon: <FiFile size={20} />, label: 'Invoices' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAppSelector(s => s.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && (!isAuthenticated || user?.role !== 'admin')) {
            toast.error('Admin access required');
            router.push('/');
        }
    }, [mounted, isAuthenticated, user, router]);

    if (!mounted || !user || user.role !== 'admin') return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>Loading admin...</div>;

    return (
        <div className="berry-admin-layout">
            {/* Sidebar */}
            <aside className="berry-sidebar">
                <div className="berry-logo">
                    <span style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', color: '#5e35b1' }}><FiCodepen /></span>
                    <span>AlgorySoft</span>
                </div>

                <div style={{ padding: '0 24px', marginBottom: 16 }}>
                    <div style={{ padding: '16px', background: '#ede7f6', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, background: '#5e35b1', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: '#5e35b1', fontSize: '0.9rem' }}>{user.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#697586' }}>Administrator</div>
                        </div>
                    </div>
                </div>

                <nav className="berry-nav">
                    {NAV_ITEMS.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`berry-nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div style={{ padding: '24px' }}>
                    <Link href="/" className="berry-nav-item" style={{ marginBottom: 8, padding: '12px', border: '1px solid #e3e8ef' }}>
                        <span style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}><FiGlobe size={20} /></span>
                        <span>View Website</span>
                    </Link>
                    <button className="berry-nav-item" style={{ width: '100%', background: '#fbe9e7', border: 'none', cursor: 'pointer', color: '#d84315', padding: '12px' }}
                        onClick={() => { dispatch(logout()); router.push('/'); }}>
                        <span style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}><FiLogOut size={20} /></span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="berry-main">
                <header className="berry-topbar">
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                        {NAV_ITEMS.find(i => i.href === pathname)?.label || 'Admin Panel'}
                    </h1>
                    <div style={{ color: '#697586', fontSize: '0.9rem' }}>
                        Welcome back, <strong>{user.name}</strong>
                    </div>
                </header>
                <main className="berry-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
