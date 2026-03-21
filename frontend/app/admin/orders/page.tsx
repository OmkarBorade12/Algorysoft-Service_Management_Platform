'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { fetchOrders, updateOrderStatusThunk, updateOrderProgressThunk, updateOrderAmountThunk, addOrderMessageThunk, deleteOrderThunk, OrderItem, OrderStatus } from '@/store/slices/ordersSlice';
import Pagination from '@/components/ui/Pagination';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { FiSend, FiPaperclip, FiSmile, FiUser, FiCode, FiShoppingCart, FiSearch, FiEdit2, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminOrdersPage() {
    const dispatch = useAppDispatch();
    const { items: orders, status } = useAppSelector(s => s.orders);
    
    const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
    const [search, setSearch] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState<string | number | null>(null);
    const [chatMsg, setChatMsg] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [editingAmountId, setEditingAmountId] = useState<string | number | null>(null);
    const [tempAmount, setTempAmount] = useState<string>('');
    const itemsPerPage = 6;
    
    const chatRef = useRef<HTMLDivElement>(null);
    
    const selectedOrder = orders.find(o => o.id == selectedOrderId) || null;

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [selectedOrder?.chat]);

    const filtered = orders.filter(o => {
        if (filter !== 'All' && o.status !== filter) return false;
        if (search && !o.client_name.toLowerCase().includes(search.toLowerCase()) && !o.product.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const paginatedOrders = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset pagination when searching/filtering
    useEffect(() => setCurrentPage(1), [filter, search]);

    const updateStatus = (id: string | number, status: OrderStatus) => {
        dispatch(updateOrderStatusThunk({ id, status }));
        toast.success(`Order #${id} updated to ${status}`);
    };

    const handleSaveAmount = async (id: string | number) => {
        const val = parseFloat(tempAmount);
        if (isNaN(val)) return toast.error("Enter a valid amount");
        try {
            await dispatch(updateOrderAmountThunk({ id, amount: val })).unwrap();
            toast.success("Order amount updated!");
            setEditingAmountId(null);
        } catch (err) {
            toast.error("Failed to update amount");
        }
    };

    const startEditingAmount = (id: string | number, current: number) => {
        setEditingAmountId(id);
        setTempAmount(current.toString());
    };

    const updateProgress = (id: string | number, progress: number) => {
        dispatch(updateOrderProgressThunk({ id, progress }));
    };

    const handleProgressRelease = () => {
        toast.success(`Progress updated to ${selectedOrder?.progress}%`);
    };

    const executeDelete = () => {
        if (deleteId) {
            dispatch(deleteOrderThunk(deleteId));
            toast.success(`Order #${deleteId} deleted.`);
            setDeleteId(null);
        }
    };

    const sendMsg = async () => {
        if (!chatMsg.trim() || !selectedOrder) return;
        const newMsg = { 
            sender: 'admin' as const, 
            text: chatMsg, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        try {
            await dispatch(addOrderMessageThunk({ id: selectedOrder.id, message: newMsg, chat: selectedOrder.chat })).unwrap();
            setChatMsg('');
        } catch (err) {
            toast.error('Failed to send message');
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
                            <div style={{ width: 80, height: 24, backgroundColor: '#f0f0f0', borderRadius: 4 }} />
                            <div style={{ width: '15%', height: 20, backgroundColor: '#f0f0f0', borderRadius: 4 }} />
                            <div style={{ flex: 1, height: 20, backgroundColor: '#f0f0f0', borderRadius: 4 }} />
                            <div style={{ width: 100, height: 28, backgroundColor: '#f0f0f0', borderRadius: 12 }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.35 }}
            style={{ width: '100%' }}
        >
            <div className="berry-animate-in">
            <div className="berry-card">
                <h2 className="berry-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiShoppingCart /> Order Management</h2>
                
                <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: 1 }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 450 }}>
                            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input className="berry-input" value={search} onChange={e => {setSearch(e.target.value); setCurrentPage(1);}} placeholder="Search client or project..." style={{ paddingLeft: 36 }} />
                        </div>
                        <select className="berry-input" style={{ width: 'auto', minWidth: 220 }} value={filter} onChange={e => {setFilter(e.target.value as any); setCurrentPage(1);}}>
                            <option value="All">All Categories</option>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="berry-table-container">
                    <table className="berry-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Client</th>
                                <th>Project & Tier</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.map(o => (
                                <tr key={o.id}>
                                    <td><code style={{ color: '#5e35b1', background: '#ede7f6', padding: '4px 8px', borderRadius: 6, fontWeight: 600 }}>{o.order_id || `#${o.id}`}</code></td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: '#121926' }}>{o.client_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#697586' }}>{o.client_email}</div>
                                        {o.razorpay_payment_id && <div style={{ fontSize: '0.65rem', color: '#10b981', marginTop: 4 }}>TXN: {o.razorpay_payment_id}</div>}
                                    </td>
                                    <td style={{ fontSize: '0.85rem', maxWidth: 220 }}>{o.product} <br/> <span className={`berry-badge ${o.tier === 'Base Product' ? 'secondary' : 'info'}`} style={{ fontSize: '0.7rem' }}>{o.tier}</span></td>
                                    <td style={{ fontWeight: 700 }}>
                                        {o.tier === 'Custom Request' ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                {editingAmountId === o.id ? (
                                                    <div style={{ display: 'flex', gap: 4 }}>
                                                        <input 
                                                            className="berry-input" 
                                                            style={{ width: 100, padding: '4px 8px' }} 
                                                            value={tempAmount} 
                                                            onChange={e => setTempAmount(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <button onClick={() => handleSaveAmount(o.id)} style={{ background: '#00c853', color: 'white', border: 'none', borderRadius: 4, width: 28, height: 28, cursor: 'pointer' }}><FiCheck/></button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        ₹{o.amount.toLocaleString('en-IN')}
                                                        <button onClick={() => startEditingAmount(o.id, o.amount)} style={{ background: 'transparent', border: 'none', color: '#5e35b1', cursor: 'pointer', padding: 4 }}><FiEdit2 size={12} /></button>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            `₹${o.amount.toLocaleString('en-IN')}`
                                        )}
                                    </td>
                                    <td>
                                        <select value={o.status} onChange={e => updateStatus(o.id, e.target.value as OrderStatus)}
                                            style={{ padding: '6px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, border: '1px solid #e3e8ef', background: '#f8fafc', outline: 'none', cursor: 'pointer' }}>
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td style={{ color: '#697586', fontSize: '0.85rem' }}>{new Date(o.date).toLocaleDateString('en-IN')}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <button
                                                onClick={() => setSelectedOrderId(o.id)}
                                                className="berry-btn-primary"
                                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                            >
                                                Track / Chat
                                            </button>
                                            <button 
                                                className="berry-btn-outline" 
                                                style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: '#ef5350', color: '#ef5350' }}
                                                onClick={() => setDeleteId(o.id)}
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
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#697586' }}>No orders found</div>
                )}
                {filtered.length > itemsPerPage && (
                    <Pagination 
                        currentPage={currentPage}
                        totalItems={filtered.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            {/* Modal for Order Tracking & Chat */}
            {selectedOrder && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(18,25,38,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
                <div className="berry-modal-container" style={{ background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 900, display: 'flex', overflow: 'hidden', minHeight: 600, maxHeight: '90vh', boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}>
                    <div className="berry-modal-sidebar" style={{ width: '35%', padding: 32, borderRight: '1px solid #e3e8ef', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.25rem', margin: '0 0 8px', color: '#121926', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FiCode /> Order {selectedOrder.order_id || `#${selectedOrder.id}`}
                            </h3>
                            <p style={{ color: '#697586', fontSize: '0.9rem', marginBottom: 32 }}>{selectedOrder.client_name}</p>

                            <label style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
                                <span>Update Progress:</span>
                                <span style={{ color: '#5e35b1' }}>{selectedOrder.progress}%</span>
                            </label>
                            <input
                                type="range"
                                min="0" max="100"
                                value={selectedOrder.progress}
                                onChange={(e) => updateProgress(selectedOrder.id, Number(e.target.value))}
                                onMouseUp={handleProgressRelease}
                                onTouchEnd={handleProgressRelease}
                                style={{ width: '100%', marginBottom: 32, accentColor: '#5e35b1' }}
                            />

                            <label style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, display: 'block' }}>Update Status</label>
                            <select
                                value={selectedOrder.status}
                                onChange={e => updateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                                className="berry-input"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="berry-modal-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff', position: 'relative', minHeight: 400 }}>
                            {/* Chat Header */}
                            <div style={{ padding: '20px 32px', borderBottom: '1px solid #e3e8ef', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                                        <FiUser />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#121926', fontWeight: 800 }}>{selectedOrder.client_name}</h4>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> Online (Client)
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedOrderId(null)} style={{ background: '#fff', border: '1px solid #e3e8ef', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#697586', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>✕</button>
                            </div>

                            {/* Chat Messages */}
                            <div ref={chatRef} style={{ flex: 1, padding: '32px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20, background: '#fcfcfc', backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(94, 53, 177, 0.03) 0%, transparent 50%)' }}>
                                {selectedOrder.chat.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: '#a0aec0', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#cbd5e1' }}><FiSmile /></div>
                                        <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.95rem' }}>No messages yet. Say hello!</p>
                                    </div>
                                ) : (
                                    selectedOrder.chat.map((msg, idx) => (
                                        <div key={idx} style={{ alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                                            <div style={{ 
                                                background: msg.sender === 'admin' ? 'linear-gradient(135deg, #5e35b1 0%, #4527a0 100%)' : '#ffffff', 
                                                color: msg.sender === 'admin' ? '#ffffff' : '#121926', 
                                                padding: '14px 20px', 
                                                borderRadius: msg.sender === 'admin' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', 
                                                border: msg.sender === 'admin' ? 'none' : '1px solid #e3e8ef', 
                                                boxShadow: msg.sender === 'admin' ? '0 8px 16px rgba(94, 53, 177, 0.25)' : '0 4px 12px rgba(0,0,0,0.04)', 
                                                fontSize: '0.95rem', 
                                                lineHeight: 1.5 
                                            }}>
                                                {msg.text}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 8, fontWeight: 600 }}>
                                                {msg.time}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Chat Input */}
                            <div style={{ padding: '20px 24px', borderTop: '1px solid #e3e8ef', display: 'flex', gap: 12, background: '#ffffff', alignItems: 'center' }}>
                                <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }}>
                                    <FiPaperclip size={20} />
                                </button>
                                <input
                                    className="berry-input"
                                    placeholder="Type your message here..."
                                    value={chatMsg}
                                    onChange={e => setChatMsg(e.target.value)}
                                    style={{ flex: 1, borderRadius: 24, padding: '12px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                                    onKeyDown={e => e.key === 'Enter' && sendMsg()}
                                />
                                <button className="berry-btn-primary" onClick={sendMsg} style={{ borderRadius: '50%', width: 44, height: 44, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #5e35b1 0%, #4527a0 100%)', boxShadow: '0 4px 12px rgba(94, 53, 177, 0.4)' }}>
                                    <FiSend size={18} style={{ marginRight: -2, marginTop: 2 }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal 
                isOpen={!!deleteId}
                title="Delete Order"
                message={`Are you sure you want to permanently delete Order #${deleteId}? This action cannot be undone.`}
                onConfirm={executeDelete}
                onCancel={() => setDeleteId(null)}
            />
            </div>
        </motion.div>
    );
}
