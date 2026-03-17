'use client';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { closeModals } from '@/store/slices/uiSlice';
import { removeFromWishlist } from '@/store/slices/wishlistSlice';
import { addToCart } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';
import styles from './WishlistSidebar.module.css';
import Link from 'next/link';
import { FiHeart, FiX, FiShoppingCart, FiPackage } from 'react-icons/fi';

export default function WishlistSidebar() {
    const dispatch = useAppDispatch();
    const { items } = useAppSelector((s) => s.wishlist);

    const moveToCart = (item: any) => {
        dispatch(addToCart({ ...item }));
        dispatch(removeFromWishlist(item.id));
        toast.success('Moved to cart!');
    };

    return (
        <>
            <div className="modal-overlay" onClick={() => dispatch(closeModals())} />
            <div className={styles.sidebar}>
                <div className={styles.header}>
                    <h3 className={styles.title} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiHeart size={18} /> Wishlist <span className={styles.count}>({items.length})</span></h3>
                    <button className={styles.closeBtn} onClick={() => dispatch(closeModals())}><FiX size={18} /></button>
                </div>

                {items.length === 0 ? (
                    <div className={styles.empty}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--pista-primary)' }}><FiHeart size={48} /></div>
                        <p>Your wishlist is empty</p>
                        <Link href="/projects" className="btn-primary" style={{ marginTop: '16px' }} onClick={() => dispatch(closeModals())}>
                            Explore Projects
                        </Link>
                    </div>
                ) : (
                    <div className={styles.items}>
                        {items.map((item) => (
                            <div key={item.id} className={styles.item}>
                                <div className={styles.itemIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pista-primary)' }}><FiPackage size={24} /></div>
                                <div className={styles.itemInfo}>
                                    <p className={styles.itemTitle}>{item.title}</p>
                                    <p className={styles.itemCategory}>{item.category}</p>
                                    <div className={styles.itemPrice}>
                                        <span className={styles.price}>₹{item.price}</span>
                                        <span className={styles.originalPrice}>₹{item.originalPrice}</span>
                                        <span className={styles.discount}>{item.discount}% OFF</span>
                                    </div>
                                    <div className={styles.itemActions}>
                                        <button className={styles.cartBtn} onClick={() => moveToCart(item)} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FiShoppingCart size={14} /> Add to Cart</button>
                                        <button className={styles.removeBtn} onClick={() => { dispatch(removeFromWishlist(item.id)); toast('Removed from wishlist'); }}><FiX size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
