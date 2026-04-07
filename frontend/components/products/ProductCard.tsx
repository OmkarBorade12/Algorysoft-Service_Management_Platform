'use client';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { addToCart, clearCart } from '@/store/slices/cartSlice';
import { toggleWishlistItem } from '@/store/slices/wishlistSlice';
import { formatPrice } from '@/store/slices/currencySlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import styles from './ProductCard.module.css';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { HiOutlineRocketLaunch } from 'react-icons/hi2';
import { CATEGORY_ICON_MAP } from '@/lib/icons';
import { AiFillHeart } from 'react-icons/ai';

interface Product {
    id: number;
    title: string;
    category: string;
    price: number;
    originalPrice: number;
    discount: number;
    views: number;
    slug: string;
    icon: string;
    isNew?: boolean;
    tech?: string[];
    tags?: string[];
    mainImage?: string;
}

export default function ProductCard({ product }: { product: Product }) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const wishlistItems = useAppSelector((s) => s.wishlist.items);
    const { currency, usdRate } = useAppSelector((s) => s.currency);
    const isWishlisted = wishlistItems.some((i) => i.id === product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        
        // Clear cart first for immediate direct checkout behavior
        dispatch(clearCart());

        dispatch(addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount,
            category: product.category,
            icon: product.icon,
            slug: product.slug,
            image: product.mainImage,
        }));
        
        toast.success('Redirecting to checkout... 🚀︎︎');
        router.push('/checkout');
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(toggleWishlistItem({
            id: product.id,
            title: product.title,
            price: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount,
            category: product.category,
            icon: product.icon,
            slug: product.slug,
        }));
        toast.success(isWishlisted ? 'Removed from saved' : 'Saved for later 🤍︎︎');
    };

    return (
        <div className={styles.card}>
            <Link href={`/projects/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                {/* Badges */}
                <div className={styles.badges}>
                    <span className="badge badge-discount">{product.discount}% OFF</span>
                    {product.isNew && <span className="badge badge-new">NEW</span>}
                </div>

                {/* Visual area */}
                <div className={styles.visual} style={{ overflow: 'hidden', position: 'relative' }}>
                    {product.mainImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.mainImage} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 1 }} />
                    ) : (
                        <div className={styles.iconContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pista-primary)' }}>
                            {CATEGORY_ICON_MAP[product.slug?.split('-')[0]] || CATEGORY_ICON_MAP.ecommerce}
                        </div>
                    )}
                    <div className={styles.bgDecor} style={{ zIndex: 0 }} />
                </div>

                {/* Body for details */}
                <div className={styles.body}>
                    {/* Category */}
                    <span className="badge badge-category" style={{ marginBottom: '8px' }}>
                        {product.category}
                    </span>

                    <h3 className={styles.title}>{product.title}</h3>

                    {/* Tech tags (max 3) */}
                    {product.tech && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                            {product.tech.slice(0, 3).map((t) => (
                                <span key={t} style={{
                                    fontSize: '0.68rem', fontWeight: 600,
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-solid)',
                                    borderRadius: '4px',
                                    padding: '2px 7px',
                                    color: 'var(--text-muted)',
                                }}>{t}</span>
                            ))}
                        </div>
                    )}

                    {/* Pricing — currency-aware */}
                    <div className={styles.priceRow}>
                        <span className={styles.price}>{formatPrice(product.price, currency, usdRate)}</span>
                        <span className={styles.originalPrice}>{formatPrice(product.originalPrice, currency, usdRate)}</span>
                        <span className={styles.discountBadge}>Save {product.discount}%</span>
                    </div>
                </div>
            </Link>

            {/* Actions footer (Outside the Link) */}
            <div className={styles.body} style={{ paddingTop: 0 }}>
                <div className={styles.actions}>
                    <button className={styles.cartBtn} onClick={handleAddToCart} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                        <HiOutlineRocketLaunch size={15} /> Get This Website
                    </button>
                    <button
                        className={`${styles.wishBtn} ${isWishlisted ? styles.wishlisted : ''}`}
                        onClick={handleWishlist}
                        title={isWishlisted ? 'Remove from saved' : 'Save for later'}
                    >
                        {isWishlisted ? <AiFillHeart size={18} style={{ color: '#ef4444' }} /> : <FiHeart size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
