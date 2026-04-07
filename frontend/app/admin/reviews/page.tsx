'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { approveReview, rejectReview, deleteReview } from '@/store/slices/reviewSlice';
import toast from 'react-hot-toast';
import Pagination from '@/components/ui/Pagination';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { FiStar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminReviewsPage() {
    const dispatch = useAppDispatch();
    const { reviews, status } = useAppSelector(s => s.reviews as { reviews: any[], status?: string });
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const itemsPerPage = 5;

    const filtered = filter === 'all' ? (reviews || []) : (reviews || []).filter(r => r.status === filter);
    const paginatedReviews = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const counts = {
        all: (reviews || []).length,
        pending: (reviews || []).filter(r => r.status === 'pending').length,
        approved: (reviews || []).filter(r => r.status === 'approved').length,
        rejected: (reviews || []).filter(r => r.status === 'rejected').length,
    };

    const executeDelete = () => {
        if (deleteId !== null) {
            dispatch(deleteReview(deleteId));
            toast.success('Review deleted');
            setDeleteId(null);
        }
    };

    if (status === 'loading') return (
        <div style={{ padding: 24 }}>
            <div className="berry-card" style={{ opacity: 0.6 }}>
                <div style={{ height: 32, width: '40%', backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 16 }} />
                <div style={{ height: 16, width: '60%', backgroundColor: '#f0f0f0', borderRadius: 6, marginBottom: 32 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ height: 180, backgroundColor: '#f5f5f5', borderRadius: 12 }} />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            style={{ width: '100%', maxWidth: '100%' }}
        >
            <div className="berry-card">
                <h2 className="berry-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiStar /> Manage Reviews</h2>
                <p style={{ color: '#697586', marginBottom: 24 }}>Approve, reject, or delete user reviews.</p>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid #e3e8ef', paddingBottom: 16 }}>
                    {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setFilter(tab); setCurrentPage(1); }}
                            style={{
                                padding: '8px 16px',
                                background: filter === tab ? '#ede7f6' : 'transparent',
                                color: filter === tab ? '#5e35b1' : '#697586',
                                border: 'none',
                                borderRadius: 8,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#697586' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiStar /></div>
                        <p>No {filter} reviews found</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {paginatedReviews.map(review => {
                            return (
                                <div key={review.id} style={{ padding: 24, border: '1px solid #e3e8ef', borderRadius: 12, background: '#f8fafc' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                            <div style={{ width: 48, height: 48, background: '#5e35b1', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 600 }}>
                                                {review.userName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#121926' }}>{review.userName}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#697586' }}>{review.userEmail} • {new Date(review.createdAt).toLocaleDateString('en-IN')}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#5e35b1', fontWeight: 500, marginTop: 4 }}>Project: {review.projectSlug}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                                            <span className={`berry-badge ${review.status === 'pending' ? 'warning' : review.status === 'approved' ? 'success' : 'error'}`}>{review.status}</span>
                                            <div style={{ color: '#fbc02d', fontSize: '1.2rem', letterSpacing: 2 }}>
                                                {'★︎'.repeat(review.rating)}{'☆︎'.repeat(5 - review.rating)}
                                            </div>
                                        </div>
                                    </div>
                                    <p style={{ color: '#364152', lineHeight: 1.6, fontSize: '0.95rem', background: '#ffffff', padding: 16, borderRadius: 8, border: '1px solid #e3e8ef' }}>
                                        {review.text}
                                    </p>
                                    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                                        {review.status !== 'approved' && (
                                            <button className="berry-btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                                onClick={() => { dispatch(approveReview(review.id)); toast.success('Review approved!'); }}>
                                                ✓︎ Approve
                                            </button>
                                        )}
                                        {review.status !== 'rejected' && (
                                            <button className="berry-btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem', borderColor: '#ffab00', color: '#f57f17' }}
                                                onClick={() => { dispatch(rejectReview(review.id)); toast('Review rejected'); }}>
                                                ✕︎ Reject
                                            </button>
                                        )}
                                        <button style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', borderRadius: 8, cursor: 'pointer' }}
                                            onClick={() => setDeleteId(review.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {filtered.length > itemsPerPage && (
                            <Pagination
                                currentPage={currentPage}
                                totalItems={filtered.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </div>
                )}

                <ConfirmModal
                    isOpen={!!deleteId}
                    title="Delete Review"
                    message="Are you sure you want to permanently delete this client review? This cannot be undone."
                    onConfirm={executeDelete}
                    onCancel={() => setDeleteId(null)}
                />
            </div>
        </motion.div>
    );
}
