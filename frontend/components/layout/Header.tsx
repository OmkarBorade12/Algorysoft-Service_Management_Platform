'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleCart, toggleWishlist, toggleMobileMenu, openLogin, openRegister, closeModals, toggleSearch } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { setCartUser } from '@/store/slices/cartSlice';
import { setWishlistUser } from '@/store/slices/wishlistSlice';
import CartSidebar from '@/components/cart/CartSidebar';
import WishlistSidebar from '@/components/wishlist/WishlistSidebar';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import SearchOverlay from '@/components/search/SearchOverlay';
import CurrencyToggle from '@/components/ui/CurrencyToggle';
import { PHONE } from '@/lib/data';
import styles from './Header.module.css';
import { FiClock, FiPhone, FiMessageCircle, FiSearch, FiHeart, FiShoppingCart, FiGrid, FiPackage, FiUser, FiKey, FiLogOut, FiX, FiMenu, FiHome, FiFolder, FiInfo, FiGlobe } from 'react-icons/fi';
import { FaChevronDown } from 'react-icons/fa';
import { renderCategoryIcon } from '@/lib/icons';

export default function Header() {
    const dispatch = useAppDispatch();
    const { cartOpen, wishlistOpen, mobileMenuOpen, loginModalOpen, registerModalOpen, searchOpen } = useAppSelector((s) => s.ui);
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

    return (
        <>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={`container ${styles.topBarInner}`}>
                    <div className={styles.topBarLeft}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FiClock size={13} /> {`Mon–Sat: 9:30 AM – 6:30 PM`}</span>
                        <span className={styles.topBarSep}>|</span>
                        <a href={`tel:${PHONE}`} className={styles.phoneLink} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><FiPhone size={13} /> {PHONE}</a>
                    </div>
                    <div className={styles.topBarRight}>
                        <a href={`https://wa.me/917899533525`} target="_blank" rel="noreferrer" className={styles.waBtn} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
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
                                    <div className={styles.megaMenuGrid}>
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/projects?category=${cat.slug}`}
                                                className={styles.megaItem}
                                                onClick={() => setCategoriesOpen(false)}
                                            >
                                                <span className={styles.megaIcon} style={{ color: 'var(--pista-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {renderCategoryIcon(cat, 20)}
                                                </span>
                                                <span className={styles.megaLabel}>{cat.name}</span>
                                                <span className={styles.megaCount}>
                                                    {products.filter(p =>
                                                        p.category === cat.name ||
                                                        p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cat.slug
                                                    ).length} Solutions
                                                </span>
                                            </Link>
                                        ))}
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

                        {/* Search */}
                        <button className={styles.iconBtn} onClick={() => dispatch(toggleSearch())} aria-label="Search">
                            <FiSearch size={18} />
                        </button>

                        {/* Wishlist */}
                        <button className={styles.iconBtn} onClick={() => dispatch(toggleWishlist())} style={{ position: 'relative' }} aria-label="Wishlist">
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
                                        {user?.role !== 'admin' && (
                                            <>
                                                <Link href="/dashboard" className="dropdown-item" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(90deg,#ede7f6,#f3e5f5)', color: '#5e35b1', fontWeight: 700, borderRadius: 8, marginBottom: 4 }}>
                                                    <FiGrid size={15} /> My Dashboard
                                                </Link>
                                                <Link href="/orders" className="dropdown-item" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiPackage size={15} /> My Orders</Link>
                                            </>
                                        )}
                                        <Link href="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiUser size={15} /> Profile</Link>
                                        {user?.role === 'admin' && (
                                            <Link href="/admin" className="dropdown-item" style={{ color: 'var(--pista-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setUserMenuOpen(false)}><FiKey size={15} /> Admin Panel</Link>
                                        )}
                                        <div className="divider" style={{ margin: '4px 0' }} />
                                        <button className="dropdown-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}
                                            onClick={() => { 
                                                dispatch(logout()); 
                                                dispatch(setCartUser('guest'));
                                                dispatch(setWishlistUser('guest'));
                                                setUserMenuOpen(false); 
                                            }}>
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

                {/* Mobile Nav */}
                {mobileMenuOpen && (
                    <div className={styles.mobileNav}>
                        <Link href="/" className={styles.mobileNavLink} onClick={() => dispatch(closeModals())} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiHome size={16} /> Home</Link>
                        <Link href="/projects" className={styles.mobileNavLink} onClick={() => dispatch(closeModals())} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiFolder size={16} /> Projects</Link>
                        <Link href="/about" className={styles.mobileNavLink} onClick={() => dispatch(closeModals())} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiInfo size={16} /> About</Link>
                        <Link href="/contact" className={styles.mobileNavLink} onClick={() => dispatch(closeModals())} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiPhone size={16} /> Contact</Link>
                        {isAuthenticated && user?.role !== 'admin' && (
                            <Link href="/dashboard" className={styles.mobileNavLink} onClick={() => dispatch(closeModals())} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(90deg,#ede7f6,#f3e5f5)', color: '#5e35b1', fontWeight: 700, borderRadius: 8, padding: '10px 14px' }}>
                                <FiGrid size={16} /> My Dashboard
                            </Link>
                        )}
                        {!isAuthenticated && (
                            <div className={styles.mobileAuthBtns}>
                                <button className="btn-secondary" onClick={() => { dispatch(openLogin()); dispatch(closeModals()); }}>Login</button>
                                <button className="btn-primary" onClick={() => { dispatch(openRegister()); dispatch(closeModals()); }}>Register</button>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Sidebars & Modals */}
            {cartOpen && <CartSidebar />}
            {wishlistOpen && <WishlistSidebar />}
            {loginModalOpen && <LoginModal />}
            {registerModalOpen && <RegisterModal />}
            {searchOpen && <SearchOverlay />}
        </>
    );
}
