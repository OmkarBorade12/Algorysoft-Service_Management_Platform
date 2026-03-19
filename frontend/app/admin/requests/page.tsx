'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import toast from 'react-hot-toast';
import { fetchRequests, updateRequestStatusThunk, deleteRequestThunk } from '@/store/slices/requestsSlice';
import { addOrderThunk } from '@/store/slices/ordersSlice';
import Pagination from '@/components/ui/Pagination';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { FiFileText, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function AdminRequestsPage() {
    const dispatch = useAppDispatch();
    const { items: requests, status } = useAppSelector(s => s.requests);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [expandedId, setExpandedId] = useState<string | number | null>(null);
    const itemsPerPage = 8; // Increased slightly for better view

    useEffect(() => {
        dispatch(fetchRequests());
    }, [dispatch]);

    const paginatedRequests = requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const approveRequest = (id: string | number) => {
        dispatch(updateRequestStatusThunk({ id, status: 'Approved' }));
        toast.success(`Request #${id} approved!`);
    };

    const executeDelete = () => {
        if (deleteId) {
            dispatch(deleteRequestThunk(deleteId));
            toast.success(`Request #${deleteId} deleted.`);
            setDeleteId(null);
        }
    };

    const toggleExpand = (id: string | number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const convertToOrder = async (req: typeof requests[0]) => {
        try {
            await dispatch(updateRequestStatusThunk({ id: req.id, status: 'In Development' })).unwrap();
            await dispatch(addOrderThunk({
                order_id: `ORD-${Date.now().toString().slice(-6)}`,
                client_name: req.client,
                client_email: req.email,
                product: 'Custom Requirement',
                tier: 'Custom Request',
                amount: 0,
                status: 'Pending',
                progress: 0,
                chat: [{ 
                    sender: 'admin', 
                    text: `Welcome! We've approved your request: "${req.requirements.slice(0, 50)}...". Let's discuss further here.`, 
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                }]
            })).unwrap();
            toast.success(`Request #${req.id} successfully converted to an active Order.`);
        } catch (err) {
            toast.error('Failed to convert request to order');
        }
    };

    if (status === 'loading') return (
        <div style={{ padding: 24 }}>
            <div className="berry-card" style={{ opacity: 0.6 }}>
                <div style={{ height: 32, width: '40%', backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 16 }} />
                <div style={{ height: 16, width: '60%', backgroundColor: '#f0f0f0', borderRadius: 6, marginBottom: 32 }} />
                <div style={{ border: '1px solid #e3e8ef', borderRadius: 12, overflow: 'hidden' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{ height: 60, width: '100%', borderBottom: '1px solid #f0f0f0', padding: '16px 24px', display: 'flex', gap: 24, alignItems: 'center' }}>
                            <div style={{ width: 40, height: 24, backgroundColor: '#f0f0f0', borderRadius: 4 }} />
                            <div style={{ width: '20%', height: 20, backgroundColor: '#f0f0f0', borderRadius: 4 }} />
                            <div style={{ flex: 1, height: 20, backgroundColor: '#f0f0f0', borderRadius: 4 }} />
                            <div style={{ width: 80, height: 24, backgroundColor: '#f0f0f0', borderRadius: 12 }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ width: '100%' }}
        >
            <div className="berry-card">
                <h2 className="berry-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiFileText /> Custom Project Requests</h2>
                <p style={{ color: '#697586', marginBottom: 24 }}>Click on a row to expand details. Review and approve custom project requirements from clients.</p>

                <div className="berry-table-container">
                    <table className="berry-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Client Name</th>
                                <th>Summary</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRequests.length === 0 ? (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#697586' }}>No pending requests</td></tr>
                            ) : paginatedRequests.map(r => {
                                const isExpanded = expandedId === r.id;
                                return (
                                    <React.Fragment key={r.id}>
                                        <tr 
                                            onClick={() => toggleExpand(r.id)} 
                                            style={{ cursor: 'pointer', background: isExpanded ? '#f8f9fe' : 'transparent' }}
                                            className="hover-row"
                                        >
                                            <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                {isExpanded ? <FiChevronUp style={{ color: '#673ab7' }} /> : <FiChevronDown style={{ color: '#94a3b8' }} />}
                                                <code style={{ fontSize: '0.8rem', color: '#673ab7', background: '#ede7f6', padding: '4px 8px', borderRadius: 6, fontWeight: 700 }}>#{r.id}</code>
                                            </td>
                                            <td style={{ fontWeight: 600, color: '#121926' }}>{r.client}</td>
                                            <td style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {r.requirements}
                                            </td>
                                            <td>
                                                <span className={`berry-badge ${r.status === 'New' ? 'warning' : r.status === 'Approved' ? 'success' : 'info'}`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td style={{ color: '#697586', fontSize: '0.85rem' }}>{new Date(r.date).toLocaleDateString()}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                                                    {r.status === 'New' && (
                                                        <button onClick={() => approveRequest(r.id)} className="berry-btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Approve</button>
                                                    )}
                                                    {r.status === 'Approved' && (
                                                        <button onClick={() => convertToOrder(r)} className="berry-btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: '#00c853', color: '#00c853' }}>Convert</button>
                                                    )}
                                                    <button onClick={() => setDeleteId(r.id)} className="berry-btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: '#f44336', color: '#f44336' }}>Del</button>
                                                </div>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr style={{ background: '#fcfcfe' }}>
                                                <td colSpan={6} style={{ padding: '0 24px 24px 24px' }}>
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }} 
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40, border: '1px solid #e3e8ef', borderRadius: '12px', padding: '24px', background: 'white', marginTop: -8, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
                                                    >
                                                        <div>
                                                            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#121926', marginBottom: 16 }}>Client Details</h4>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                                <div className="detail-item">
                                                                    <span className="label">Email:</span>
                                                                    <a href={`mailto:${r.email}`} style={{ color: '#2196f3', textDecoration: 'none' }}>{r.email}</a>
                                                                </div>
                                                                <div className="detail-item">
                                                                    <span className="label">Phone:</span>
                                                                    <span style={{ color: '#364152' }}>{r.phone || 'N/A'}</span>
                                                                </div>
                                                                <div className="detail-item">
                                                                    <span className="label">Business:</span>
                                                                    <span style={{ color: '#673ab7', fontWeight: 600 }}>{r.business || 'Individual'}</span>
                                                                </div>
                                                                <div className="detail-item">
                                                                    <span className="label">Budget:</span>
                                                                    <span style={{ color: '#00c853', fontWeight: 600 }}>{r.budget}</span>
                                                                </div>
                                                                <div className="detail-item">
                                                                    <span className="label">Timeline:</span>
                                                                    <span style={{ color: '#ffc107', fontWeight: 600 }}>{r.timeline}</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                                                                {r.phone && (
                                                                    <a href={`https://wa.me/${r.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="berry-btn-primary" style={{ flex: 1, background: '#25D366', fontSize: '0.8rem', textAlign: 'center', textDecoration: 'none' }}>WhatsApp</a>
                                                                )}
                                                                <a 
                                                                    href={`mailto:${r.email}?subject=AlgorySoft - Custom Project Quote (#${r.id})&body=Hello ${r.client},%0D%0A%0D%0AWe have received your custom project request for: "${r.business || 'your business'}".%0D%0A%0D%0AOur team has reviewed your requirements:%0D%0A"${r.requirements.replace(/\n/g, '%0D%0A')}"%0D%0A%0D%0ABudget: ${r.budget}%0D%0ATimeline: ${r.timeline}%0D%0A%0D%0AWe would like to discuss this further. Let us know a good time for a call!%0D%0A%0D%0ABest Regards,%0D%0AAlgorySoft Team`} 
                                                                    className="berry-btn-outline" 
                                                                    style={{ flex: 1, fontSize: '0.8rem', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                                >
                                                                    Send Email
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#121926', marginBottom: 16 }}>Full Requirements</h4>
                                                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#364152', lineHeight: 1.6, border: '1px solid #e3e8ef' }}>
                                                                {r.requirements}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {requests.length > itemsPerPage && (
                    <Pagination 
                        currentPage={currentPage}
                        totalItems={requests.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                )}

                <ConfirmModal 
                    isOpen={!!deleteId}
                    title="Delete Request"
                    message={`Are you sure you want to permanently delete custom request #${deleteId}?`}
                    onConfirm={executeDelete}
                    onCancel={() => setDeleteId(null)}
                />
            </div>
            <style jsx>{`
                .hover-row:hover { background-color: #f8fafc !important; }
                .detail-item { display: flex; justify-content: space-between; font-size: 0.85rem; }
                .detail-item .label { color: #64748b; font-weight: 500; }
            `}</style>
        </motion.div>
    );
}


