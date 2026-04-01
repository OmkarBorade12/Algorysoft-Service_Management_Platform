'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleCart, toggleWishlist, toggleMobileMenu, openLogin, openRegister, openQuote, closeModals, toggleSearch } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { setCartUser } from '@/store/slices/cartSlice';
import { setWishlistUser } from '@/store/slices/wishlistSlice';
import CurrencyToggle from '@/components/ui/CurrencyToggle';
import { PHONE } from '@/lib/data';
import styles from './Header.module.css';
import { FiClock, FiPhone, FiMessageCircle, FiSearch, FiHeart, FiShoppingCart, FiGrid, FiPackage, FiUser, FiKey, FiLogOut, FiX, FiMenu, FiHome, FiFolder, FiInfo, FiGlobe } from 'react-icons/fi';
import { FaChevronDown } from 'react-icons/fa';
import { renderCategoryIcon } from '@/lib/icons';

export default function Header() {
    const dispatch = useAppDispatch();
    const { cartOpen, wishlistOpen, mobileMenuOpen, loginModalOpen, registerModalOpen, quoteModalOpen, searchOpen } = useAppSelector((s) => s.ui);
    const { items: cartItems, totalItems } = useAppSelector((s) => s.cart);
    const { items: wishlistItems } = useAppSelector((s) => s.wishlist);
    const { user, isAuthenticated } = useAppSelector((s) => s.auth);
    const categories = useAppSelector((s) => s.categories.items);
    const products = useAppSelector((s) => s.products.items);
    const [scrolled, setScrolled] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const catRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (catRef.current && !catRef.current.contains(e.target as Node)) {
                setCategoriesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = () => {
        dispatch(logout()); 
        dispatch(setCartUser('guest'));
        dispatch(setWishlistUser('guest'));
        setUserMenuOpen(false);
    };

    return (
        <>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={`container ${styles.topBarInner}`}>
                    <div className={styles.topBarLeft}>
                        <span className={styles.topBarItem}><FiClock size={13} /> {`Mon–Sat: 9:30 AM – 6:30 PM`}</span>
                        <span className={styles.topBarSep}>|</span>
                        <a href={`tel:${PHONE}`} className={`${styles.phoneLink} ${styles.topBarItem}`}><FiPhone size={13} /> {PHONE}</a>
                    </div>
                    <div className={styles.topBarRight}>
                        <a href={`https://wa.me/917899533525`} target="_blank" rel="noreferrer" className={styles.waBtn}>
                            <FiMessageCircle size={14} /> WhatsApp Us
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
                <div className={`container ${styles.headerInner}`}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        <Image src="/logo.jpeg" alt="AlgorySoft" width={44} height={44} className={styles.logoImg} />
                        <span className={styles.logoText}>AlgorySoft</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className={styles.nav}>
                        <Link href="/" className={styles.navLink}>Home</Link>

                        {/* Categories Dropdown */}
                        <div className={styles.dropdown} ref={catRef}>
                            <button className={styles.navLink} onClick={() => setCategoriesOpen(!categoriesOpen)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                Categories <FaChevronDown size={10} style={{ transition: 'transform 0.2s', transform: categoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                            </button>
                            {categoriesOpen && (
                                <div className={styles.megaMenu}>
                                    <div className={styles.megaMenuInner}>
                                        <div className={styles.megaMenuHeader}>
                                            <h4 className={styles.megaMenuTitle}>Marketplace Categories</h4>
                                        </div>
                                        <div className={styles.megaMenuGrid}>
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={`/projects?category=${cat.slug}`}
                                                    className={styles.megaItem}
                                                    onClick={() => setCategoriesOpen(false)}
                                                >
                                                    <div className={styles.megaIcon}>
                                                        {renderCategoryIcon(cat, 22)}
                                                    </div>
                                                    <div className={styles.megaInfo}>
                                                        <span className={styles.megaLabel}>{cat.name}</span>
                                                        <span className={styles.megaCount}>
                                                            {products.filter(p =>
                                                                p.category === cat.name ||
                                                                p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cat.slug
                                                            ).length} Solutions Published
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className={styles.megaMenuFooter}>
                                            <Link href="/projects" className={styles.viewAllLink} onClick={() => setCategoriesOpen(false)}>
                                                Browse All Projects <FiPackage size={14} />
                                            </Link>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{products.length}+ Premium Templates</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/projects" className={styles.navLink}>Projects</Link>
                        <Link href="/about" className={styles.navLink}>About</Link>
                        <Link href="/contact" className={styles.navLink}>Contact</Link>
                    </nav>

                    {/* Actions */}
                    <div className={styles.actions}>
                        {/* Currency */}
                        <CurrencyToggle />

                        {/* Search (Hide on small mobile, show in sidebar) */}
                        <button className={`${styles.iconBtn} ${styles.hideMobile}`} onClick={() => dispatch(toggleSearch())} aria-label="Search">
                            <FiSearch size={18} />
                        </button>

                        {/* Wishlist (Hide on small mobile, show in sidebar) */}
                        <button className={`${styles.iconBtn} ${styles.hideMobile}`} onClick={() => dispatch(toggleWishlist())} style={{ position: 'relative' }} aria-label="Wishlist">
                            <FiHeart size={18} />
                            {wishlistItems.length > 0 && (
                                <span className="cart-badge">{wishlistItems.length}</span>
                            )}
                        </button>

                        {/* Cart */}
                        <button className={styles.iconBtn} onClick={() => dispatch(toggleCart())} style={{ position: 'relative' }} aria-label="Cart">
                            <FiShoppingCart size={18} />
                            {totalItems > 0 && (
                                <span className="cart-badge">{totalItems}</span>
                            )}
                        </button>

                        {/* User */}
                        {isAuthenticated ? (
                            <div className={styles.dropdown} style={{ position: 'relative' }}>
                                <button className={styles.userBtn} onClick={() => setUserMenuOpen(!userMenuOpen)}>
                                    <div className={styles.userAvatar}>{user?.name?.charAt(0).toUpperCase()}</div>
                                    <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
                                </button>
                                {userMenuOpen && (
                                    <div className={`dropdown-menu ${styles.userMenu}`} style={{ right: 0, left: 'auto', minWidth: 180 }}>
                                        {(user?.role as string) !== 'admin' && (
                                            <>
                                                <Link href={(user?.role as string) === 'admin' ? "/admin" : "/dashboard"} className="dropdown-item" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(90deg,#ede7f6,#f3e5f5)', color: '#5e35b1', fontWeight: 700, borderRadius: 8, marginBottom: 4 }}>
                                                    <FiGrid size={15} /> My Dashboard
                                                </Link>
                                                <Link href="/orders" className="dropdown-item" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiPackage size={15} /> My Orders</Link>
                                            </>
                                        )}
                                        <Link href="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiUser size={15} /> Profile</Link>
                                        {(user?.role as string) === 'admin' && (
                                            <Link href="/admin" className="dropdown-item" style={{ color: 'var(--pista-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setUserMenuOpen(false)}><FiKey size={15} /> Admin Panel</Link>
                                        )}
                                        <div className="divider" style={{ margin: '4px 0' }} />
                                        <button className="dropdown-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}
                                            onClick={handleLogout}>
                                            <FiLogOut size={15} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={styles.authBtns}>
                                <button className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.85rem' }} onClick={() => dispatch(openLogin())}>Login</button>
                                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }} onClick={() => dispatch(openRegister())}>Register</button>
                            </div>
                        )}

                        {/* Mobile Menu */}
                        <button className={styles.mobileMenu} onClick={() => dispatch(toggleMobileMenu())} aria-label="Menu">
                            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Sidebar Drawer moved outside header stacking context */}
                <div className={`${styles.sidebarOverlay} ${mobileMenuOpen ? styles.show : ''}`} onClick={() => dispatch(toggleMobileMenu())} />
                <div className={`${styles.mobileSidebar} ${mobileMenuOpen ? styles.show : ''}`}>
                    <div className={styles.sidebarHeader}>
                        <Link href="/" className={styles.logo} onClick={() => dispatch(toggleMobileMenu())}>
                            <Image src="/logo.jpeg" alt="AlgorySoft" width={38} height={38} className={styles.logoImg} />
                            <span className={styles.logoText} style={{ display: 'block' }}>AlgorySoft</span>
                        </Link>
                        <button className={styles.sidebarClose} onClick={() => dispatch(toggleMobileMenu())} aria-label="Close Menu">
                            <FiX size={24} />
                        </button>
                    </div>
                    
                    <div className={styles.sidebarContent}>
                        <div className={styles.sidebarSection}>
                             <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <button className={styles.sidebarAction} onClick={() => { dispatch(toggleSearch()); dispatch(toggleMobileMenu()); }}>
                                    <FiSearch size={18} /> Search
                                </button>
                                <button className={styles.sidebarAction} onClick={() => { dispatch(toggleWishlist()); dispatch(toggleMobileMenu()); }}>
                                    <FiHeart size={18} /> Wishlist
                                </button>
                             </div>
                        </div>
                        
                        <div className={styles.sidebarSection}>
                            <h4 className={styles.sidebarSecTitle}>Navigation</h4>
                            <Link href="/" className={styles.mobileNavLink} onClick={() => dispatch(toggleMobileMenu())}><FiHome size={18} /> Home</Link>
                            <Link href="/projects" className={styles.mobileNavLink} onClick={() => dispatch(toggleMobileMenu())}><FiFolder size={18} /> All Projects</Link>
                            <Link href="/about" className={styles.mobileNavLink} onClick={() => dispatch(toggleMobileMenu())}><FiInfo size={18} /> About Us</Link>
                            <Link href="/contact" className={styles.mobileNavLink} onClick={() => dispatch(toggleMobileMenu())}><FiPhone size={18} /> Contact</Link>
                        </div>

                        <div className={styles.sidebarSection}>
                            <h4 className={styles.sidebarSecTitle}>Categories</h4>
                            <div className={styles.sidebarCatGrid}>
                                {categories.slice(0, 6).map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/projects?category=${cat.slug}`}
                                        className={styles.sidebarCatItem}
                                        onClick={() => dispatch(toggleMobileMenu())}
                                    >
                                        <span className={styles.sidebarCatIcon}>{renderCategoryIcon(cat, 18)}</span>
                                        <span className={styles.sidebarCatLabel}>{cat.name}</span>
                                    </Link>
                                ))}
                                <Link href="/projects" className={styles.sidebarCatItem} onClick={() => dispatch(toggleMobileMenu())} style={{ background: 'var(--pista-xlight)', color: 'var(--pista-dark)', gridColumn: 'span 2', justifyContent: 'center' }}>
                                    View All Categories →
                                </Link>
                            </div>
                        </div>

                        {isAuthenticated ? (
                             <div className={styles.sidebarAccount}>
                                <div className={styles.sidebarUser}>
                                     <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--pista-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                                        {user?.name?.charAt(0).toUpperCase()}
                                     </div>
                                     <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--pista-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(user?.role as string) === 'admin' ? 'Administrator' : 'Client Account'}</div>
                                     </div>
                                </div>
                                <Link href={(user?.role as string) === 'admin' ? "/admin" : "/dashboard"} className={styles.mobileNavLink} onClick={() => dispatch(toggleMobileMenu())} style={{ background: 'linear-gradient(90deg,#ede7f6,#f3e5f5)', color: '#5e35b1', fontWeight: 700, borderRadius: 12 }}>
                                    <FiGrid size={18} /> My Dashboard
                                </Link>
                                <button className={styles.mobileNavLink} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                                    onClick={() => { 
                                        handleLogout();
                                        dispatch(toggleMobileMenu());
                                    }}>
                                    <FiLogOut size={18} /> Logout
                                </button>
                             </div>
                        ) : (
                            <div className={styles.sidebarSection}>
                                <h4 className={styles.sidebarSecTitle}>Get Started</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={() => { dispatch(openLogin()); dispatch(toggleMobileMenu()); }}>Login</button>
                                    <button className="btn-secondary" style={{ width: '100%', padding: '14px' }} onClick={() => { dispatch(openRegister()); dispatch(toggleMobileMenu()); }}>Create Account</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.sidebarFooter}>
                        <div className={styles.sidebarFooterItem}>
                            <FiPhone size={14} /> {PHONE}
                        </div>
                        <a href="https://wa.me/917899533525" target="_blank" rel="noreferrer" className={styles.waBtn} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                            <FiMessageCircle size={15} /> WhatsApp Support
                        </a>
                    </div>
                </div>
            </header>
        </>
    );
}
