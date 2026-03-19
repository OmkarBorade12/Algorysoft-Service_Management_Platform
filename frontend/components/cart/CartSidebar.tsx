'use client';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { closeModals } from '@/store/slices/uiSlice';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';
import { addToWishlist } from '@/store/slices/wishlistSlice';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './CartSidebar.module.css';
import { FiShoppingCart, FiX, FiPackage, FiHeart, FiFolder, FiLayers } from 'react-icons/fi';

// Tier color map
const TIER_COLORS: Record<string, { color: string; bg: string; border: string }> = {
    Basic:  { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)' },
    Silver: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)' },
    Gold:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
};

export default function CartSidebar() {
    const dispatch = useAppDispatch();
    const { items, totalItems, totalPrice } = useAppSelector((s) => s.cart);
    const { currency } = useAppSelector((s) => s.currency);
    const sym = currency === 'USD' ? '$' : '₹';

    const fmt = (n: number) => `${sym}${Math.round(n).toLocaleString('en-IN')}`;

    const handleWishlist = (item: any) => {
        dispatch(addToWishlist({ id: item.id, title: item.title, price: item.price, originalPrice: item.originalPrice, discount: item.discount, category: item.category }));
        dispatch(removeFromCart(item.id));
        toast.success('Moved to wishlist');
    };

    return (
        <>
            <div className="modal-overlay" onClick={() => dispatch(closeModals())} />
            <div className={styles.sidebar}>
                <div className={styles.header}>
                    <h3 className={styles.title} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiShoppingCart size={18} /> Shopping Cart
                        <span className={styles.count}>({totalItems})</span>
                    </h3>
                    <button className={styles.closeBtn} onClick={() => dispatch(closeModals())}><FiX size={18} /></button>
                </div>

                {items.length === 0 ? (
                    <div className={styles.empty}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--pista-primary)' }}>
                            <FiShoppingCart size={48} />
                        </div>
                        <p>Your cart is empty</p>
                        <Link href="/projects" className="btn-primary" style={{ marginTop: '16px' }} onClick={() => dispatch(closeModals())}>
                            Browse Projects
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className={styles.items}>
                            {items.map((item) => {
                                const isTierItem = !!item.tier;
                                const tc = item.tier ? TIER_COLORS[item.tier] : null;

                                return (
                                    <div key={item.id} className={styles.item} style={{
                                        border: isTierItem && tc ? `1.5px solid ${tc.border}` : undefined,
                                        borderRadius: isTierItem ? 14 : undefined,
                                        background: isTierItem && tc ? tc.bg : undefined,
                                        padding: isTierItem ? '14px' : undefined,
                                        marginBottom: 12,
                                    }}>
                                        {/* Icon */}
                                        <div className={styles.itemIcon} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: isTierItem && tc ? tc.color : 'var(--pista-primary)',
                                        }}>
                                            {isTierItem ? <FiLayers size={22} /> : item.category ? <FiPackage size={24} /> : <FiFolder size={24} />}
                                        </div>

                                        {/* Info */}
                                        <div className={styles.itemInfo} style={{ flex: 1, minWidth: 0 }}>
                                            {/* Title + tier badge */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                                                <p className={styles.itemTitle} style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.3 }}>
                                                    {item.title}
                                                </p>
                                                {isTierItem && tc && (
                                                    <span style={{
                                                        fontSize: '0.65rem', fontWeight: 800,
                                                        padding: '2px 7px', borderRadius: 9999,
                                                        background: tc.color, color: '#fff',
                                                        letterSpacing: '0.04em', flexShrink: 0,
                                                    }}>
                                                        {item.tier}
                                                    </span>
                                                )}
                                            </div>

                                            {/* ── Price for Tier Items ── */}
                                            {isTierItem ? (
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    marginBottom: 8,
                                                    fontSize: '0.88rem',
                                                }}>
                                                    <span style={{ fontWeight: 900, fontSize: '1rem', color: tc!.color }}>
                                                        {fmt(item.price)}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '0.68rem', fontWeight: 700,
                                                        padding: '2px 7px', borderRadius: 9999,
                                                        background: tc!.bg, color: tc!.color,
                                                        border: `1px solid ${tc!.border}`,
                                                    }}>
                                                        {item.tier} Plan
                                                    </span>
                                                </div>
                                            ) : (
                                                <p className={styles.itemCategory} style={{ marginBottom: 6 }}>{item.category}</p>
                                            )}

                                            {/* Quantity + Actions */}
                                            <div className={styles.itemActions}>
                                                <div className={styles.quantityCtrl}>
                                                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>−</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button>
                                                </div>
                                                <button className={styles.wishlistBtn} onClick={() => handleWishlist(item)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <FiHeart size={13} /> Save
                                                </button>
                                                <button className={styles.removeBtn} onClick={() => { dispatch(removeFromCart(item.id)); toast.error('Removed from cart'); }}>
                                                    <FiX size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Right-side price (non-tier items only) */}
                                        {!isTierItem && (
                                            <div className={styles.itemPrice}>
                                                <span className={styles.price}>{fmt(item.price)}</span>
                                                <span className={styles.originalPrice} style={{ textDecoration: 'line-through' }}>
                                                    {fmt(item.originalPrice)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className={styles.footer}>
                            <div className={styles.summary}>
                                {/* Show cart summary */}
                                <div className={styles.summaryRow}>
                                    <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                                    <span>{fmt(totalPrice)}</span>
                                </div>

                                {/* Savings */}
                                {(() => {
                                    const savings = items.reduce((s, i) => s + (i.originalPrice - i.price) * i.quantity, 0);
                                    return savings > 0 ? (
                                        <div className={styles.summaryRow}>
                                            <span>Discount Savings</span>
                                            <span style={{ color: '#22c55e' }}>−{fmt(savings)}</span>
                                        </div>
                                    ) : null;
                                })()}

                                {/* Tier items summary */}
                                {items.some(i => i.tier) && (
                                    <div style={{
                                        margin: '8px 0',
                                        padding: '10px 12px',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: 10,
                                        border: '1px solid var(--border-solid)',
                                        fontSize: '0.78rem',
                                    }}>
                                        <div style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                            🏷️ Selected Tiers
                                        </div>
                                        {items.filter(i => i.tier).map(i => {
                                            const tc = i.tier ? TIER_COLORS[i.tier] : null;
                                            return (
                                                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                    <span style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                                                        {i.title} — <span style={{ color: tc?.color }}>{i.tier}</span>
                                                    </span>
                                                    <strong style={{ color: tc?.color }}>{fmt(i.price)}</strong>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className={`${styles.summaryRow} ${styles.total}`}>
                                    <span>Grand Total</span>
                                    <span>{fmt(totalPrice)}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={() => dispatch(closeModals())}
                            >
                                Proceed to Checkout →
                            </Link>
                            <button className={styles.clearBtn} onClick={() => dispatch(clearCart())}>Clear Cart</button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
