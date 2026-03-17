'use client';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import toast from 'react-hot-toast';
import { updateRequestStatus, deleteRequest } from '@/store/slices/requestsSlice';
import { addOrder } from '@/store/slices/ordersSlice';
import Pagination from '@/components/ui/Pagination';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useState } from 'react';
import { FiFileText } from 'react-icons/fi';

export default function AdminRequestsPage() {
    const dispatch = useAppDispatch();
    const requests = useAppSelector(s => s.requests.items);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const itemsPerPage = 6;
    const paginatedRequests = requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const approveRequest = (id: string) => {
        dispatch(updateRequestStatus({ id, status: 'Approved' }));
        toast.success(`Request ${id} approved! Ready to be quoted or converted to Order.`);
    };

    const executeDelete = () => {
        if (deleteId) {
            dispatch(deleteRequest(deleteId));
            toast.success(`Request ${deleteId} deleted.`);
            setDeleteId(null);
        }
    };

    const convertToOrder = (req: typeof requests[0]) => {
        dispatch(updateRequestStatus({ id: req.id, status: 'In Development' }));
        dispatch(addOrder({
            id: `ORD-${Date.now().toString().slice(-4)}`,
            clientName: req.client,
            clientEmail: req.email,
            product: 'Custom Requirement',
            tier: 'Custom Request',
            amount: 0, // Admin must set later
            status: 'Pending',
            progress: 0,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            chat: [{ sender: 'admin', text: 'Welcome to your custom workspace! Please share any further specifications here.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
        }));
        toast.success(`Request ${req.id} successfully converted to an active Workspace Order.`);
    };

    return (
        <div className="berry-card">
            <h2 className="berry-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiFileText /> Custom Project Requests</h2>
            <p style={{ color: '#697586', marginBottom: 24 }}>Review and approve custom project requirements from clients.</p>

            <div className="berry-table-container">
                <table className="berry-table">
                    <thead>
                        <tr>
                            <th>Req ID</th>
                            <th>Client Info</th>
                            <th>Requirements</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRequests.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#697586' }}>No pending requests</td></tr>
                        ) : paginatedRequests.map(r => (
                            <tr key={r.id}>
                                <td><code style={{ fontSize: '0.8rem', color: '#5e35b1', background: '#ede7f6', padding: '4px 8px', borderRadius: 6, fontWeight: 600 }}>#{r.id}</code></td>
                                <td>
                                    <div style={{ fontWeight: 600, color: '#121926' }}>{r.client}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#697586' }}>{r.email} {r.phone ? `• ${r.phone}` : ''}</div>
                                    {r.business && <div style={{ fontSize: '0.75rem', color: '#5e35b1', fontWeight: 600 }}>Biz: {r.business}</div>}
                                </td>
                                <td style={{ fontSize: '0.85rem', color: '#364152', maxWidth: 300, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere', paddingRight: 16 }}>{r.requirements}</td>
                                <td>
                                    <span className={`berry-badge ${r.status === 'New' ? 'warning' : r.status === 'Approved' ? 'success' : 'info'}`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td style={{ color: '#697586', fontSize: '0.85rem' }}>{r.date}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {r.status === 'New' && (
                                            <button
                                                onClick={() => approveRequest(r.id)}
                                                className="berry-btn-primary"
                                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {r.status === 'Approved' && (
                                            <button
                                                onClick={() => convertToOrder(r)}
                                                className="berry-btn-outline"
                                                style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: '#43a047', color: '#43a047' }}
                                            >
                                                Convert to Order
                                            </button>
                                        )}
                                        <a 
                                            href={r.phone ? `https://wa.me/${r.phone.replace(/\D/g, '')}` : `mailto:${r.email}`} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="berry-btn-outline" 
                                            style={{ padding: '6px 12px', fontSize: '0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            Chat
                                        </a>
                                        <button 
                                            className="berry-btn-outline" 
                                            style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: '#ef5350', color: '#ef5350' }}
                                            onClick={() => setDeleteId(r.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
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
                message={`Are you sure you want to permanently delete custom request ${deleteId}?`}
                onConfirm={executeDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}
