'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { logout } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import './berry.css'; 

import { 
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
    FiCodepen,
    FiMenu,
    FiGrid,
    FiSearch,
    FiX
} from 'react-icons/fi';

const MENU_GROUPS = [
    {
        title: 'Dashboard',
        items: [{ href: '/admin', icon: <FiGrid size={18} />, label: 'Overview' }]
    },
    {
        title: 'Management',
        items: [
            { href: '/admin/products', icon: <FiBox size={18} />, label: 'Products' },
            { href: '/admin/cards', icon: <FiCreditCard size={18} />, label: 'Pricing Cards' },
            { href: '/admin/features', icon: <FiStar size={18} />, label: 'Features' },
        ]
    },
    {
        title: 'Interactions',
        items: [
            { href: '/admin/requests', icon: <FiFileText size={18} />, label: 'Custom Requests' },
            { href: '/admin/orders', icon: <FiShoppingCart size={18} />, label: 'Order Mgmt' },
            { href: '/admin/reviews', icon: <FiMessageSquare size={18} />, label: 'Reviews' },
        ]
    },
    {
        title: 'Resources',
        items: [
            { href: '/admin/carousel', icon: <FiImage size={18} />, label: 'Carousel' },
            { href: '/admin/invoices', icon: <FiFile size={18} />, label: 'Invoices' },
        ]
    }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAppSelector(s => s.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth <= 960);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // On desktop: start with sidebar visible; on mobile: hidden by default
    useEffect(() => {
        if (mounted) setSidebarOpen(!isMobile);
    }, [isMobile, mounted]);

    // Close sidebar on route change on mobile
    useEffect(() => {
        if (isMobile) setSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (mounted && (!isAuthenticated || user?.role !== 'admin')) {
            toast.error('Admin access required');
            router.push('/');
        }
    }, [mounted, isAuthenticated, user, router]);

    if (!mounted || !user || user.role !== 'admin') return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7fa' }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}>
                <FiCodepen size={60} color="#673ab7" />
            </motion.div>
        </div>
    );

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return (
        <div className="berry-admin-layout">
            {/* Mobile backdrop */}
            {isMobile && sidebarOpen && (
                <div 
                    className="berry-sidebar-backdrop visible" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`berry-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
                <div className="berry-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Image src="/algorysoft.jpeg" alt="AlgorySoft" width={28} height={28} style={{ borderRadius: '6px' }} />
                    <span style={{ fontWeight: 700, letterSpacing: '-0.3px', color: '#121926' }}>AlgorySoft</span>
                    {isMobile && (
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                        >
                            <FiX size={20} />
                        </button>
                    )}
                </div>

                <div className="berry-nav">
                    {MENU_GROUPS.map(group => (
                        <div key={group.title}>
                            <div className="berry-nav-group">{group.title}</div>
                            {group.items.map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`berry-nav-item ${pathname === item.href ? 'active' : ''}`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid #e3e8ef' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: '#f8fafc', borderRadius: '12px', marginBottom: 12 }}>
                        <div style={{ width: 34, height: 34, background: '#673ab7', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Admin</div>
                        </div>
                    </div>
                    <Link href="/" className="berry-nav-item" style={{ marginBottom: 4 }}><FiGlobe size={18} /> <span>Website</span></Link>
                    <button onClick={() => { 
                        dispatch(logout()); 
                        import('next-auth/react').then(mod => mod.signOut({ redirect: false }));
                        router.push('/'); 
                    }} className="berry-nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <FiLogOut size={18} /> <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div 
                className="berry-main" 
                style={{ marginLeft: (!isMobile && sidebarOpen) ? '260px' : '0' }}
            >
                <header className="berry-topbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <button 
                            onClick={toggleSidebar} 
                            style={{ 
                                background: '#ede7f6', border: 'none', width: 38, height: 38, 
                                borderRadius: '10px', color: '#673ab7', cursor: 'pointer', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0
                            }}
                        >
                            <FiMenu size={20} />
                        </button>
                        <div className="berry-search" style={{ display: 'flex' }}>
                            <FiSearch size={15} />
                            <input type="text" placeholder="Search Admin..." />
                        </div>
                    </div>
                </header>

                <main className="berry-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
