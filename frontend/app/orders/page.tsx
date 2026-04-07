'use client';
import { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchOrders, addOrderMessageThunk, OrderItem } from '@/store/slices/ordersSlice';
import { FiSend, FiPaperclip, FiSmile } from 'react-icons/fi';
import EmptyState from '@/components/ui/EmptyState';

export default function MyOrdersPage() {
    const { isAuthenticated, user } = useAppSelector(s => s.auth);
    const { items: allOrders, status } = useAppSelector(s => s.orders);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [selectedOrderId, setSelectedOrderId] = useState<string | number | null>(null);
    const [chatMsg, setChatMsg] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchOrders());
        }
    }, [isAuthenticated, dispatch]);

    const orders = allOrders.filter(o => o.client_email === user?.email);
    const selectedOrder = orders.find(o => o.id == selectedOrderId) || null;

    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [selectedOrder?.chat]);

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
                <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 20 }}>You are not logged in</h1>
                <p style={{ color: 'var(--text-muted)' }}>Please login to view your active projects and orders.</p>
                <div style={{ marginTop: 32 }}>
                    <Link href="/" className="btn-primary">Back to Home</Link>
                </div>
            </div>
        );
    }

    if (isAuthenticated && user?.role === 'admin') {
        return (
            <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
                <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 20 }}>Admin Access Restricted</h1>
                <p style={{ color: 'var(--text-muted)' }}>Admins manage orders from the Admin Dashboard, not this page.</p>
                <div style={{ marginTop: 32 }}>
                    <Link href="/admin/orders" className="btn-primary">Go to Admin Orders</Link>
                </div>
            </div>
        );
    }

    const handleSendMsg = async () => {
        if (!chatMsg.trim() || !selectedOrder) return;
        const newMsg = {
            sender: 'client' as const,
            text: chatMsg,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        try {
            await dispatch(addOrderMessageThunk({ id: selectedOrder.id, message: newMsg, chat: selectedOrder.chat })).unwrap();
            setChatMsg('');
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    if (status === 'loading') return <div style={{ padding: 120, textAlign: 'center' }}>Loading your projects...</div>;

    return (
        <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', padding: '60px 0' }}>
            <div className="container animate-fadeInUp">
                <div style={{ marginBottom: 40, textAlign: 'center' }}>
                    <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>My Active <span>Projects</span></h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Track your requested projects, chat directly with developers, and view real-time progress.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
                    {orders.length === 0 ? (
                        <EmptyState 
                            imageNum={1}
                            title="No ongoing projects found"
                            description="You haven't purchased or requested any custom projects yet. Explore our solutions to get started!"
                            buttonText="Explore Projects"
                            buttonLink="/projects"
                        />
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--pista-dark)' }}>{order.order_id || `#${order.id}`}</span>
                                            <span className={`badge ${order.status === 'Completed' ? 'badge-discount' : 'badge-category'}`}
                                                style={{ background: order.status === 'Completed' ? 'var(--pista-xlight)' : 'rgba(37, 99, 235, 0.1)', color: order.status === 'Completed' ? 'var(--pista-dark)' : '#2563eb', border: 'none' }}>
                                                {order.status}
                                            </span>
                                            <span className="badge" style={{ background: '#fff9c4', color: '#f57f17', border: '1px solid #ffd54f' }}>🏎︎︎︎ {order.tier} Tier</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{order.product}</h3>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ordered on {new Date(order.date).toLocaleDateString()}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                                            ₹{order.amount.toLocaleString('en-IN')}
                                        </div>
                                        <button
                                            onClick={() => setSelectedOrderId(order.id)}
                                            className="btn-primary"
                                            style={{ marginTop: 12, padding: '8px 20px', fontSize: '0.85rem' }}
                                        >
                                            Track Progress & Chat 💬︎︎
                                        </button>
                                    </div>
                                </div>

                                {/* Mini Progress Bar */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600 }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Project Development Pipeline</span>
                                        <span style={{ color: 'var(--pista-primary)' }}>{order.progress}% Complete</span>
                                    </div>
                                    <div style={{ height: 8, background: 'var(--border-solid)', borderRadius: 99, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', background: 'var(--gradient-primary)', width: `${order.progress}%`, transition: 'width 1s ease' }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        <span>Planning</span>
                                        <span>Designing</span>
                                        <span>Development</span>
                                        <span>Testing</span>
                                        <span>Deployment</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat/Tracking Modal */}
            {selectedOrder && (
                <div className="modal-overlay" style={{ zIndex: 1100, backdropFilter: 'blur(8px)' }}>
                    <div className="modal-content animate-fadeInUp" style={{ maxWidth: 800, padding: 0, height: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                        {/* Header */}
                        <div style={{ padding: '24px 32px', background: 'var(--pista-primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{selectedOrder.product} <span style={{ opacity: 0.8, fontSize: '0.9rem' }}>({selectedOrder.order_id || `#${selectedOrder.id}`})</span></h3>
                                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem', marginTop: 4 }}>Live tracking and developer chat regarding your project.</p>
                            </div>
                            <button onClick={() => setSelectedOrderId(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕︎</button>
                        </div>

                        {/* Tracker UI */}
                        <div style={{ padding: '24px 32px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-solid)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.95rem', fontWeight: 600 }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Current Progress: <span style={{ color: 'var(--pista-primary)', fontSize: '1.1rem' }}>{selectedOrder.progress}%</span></span>
                                <span style={{ color: 'var(--text-secondary)' }}>Status: <span style={{ color: 'var(--success)' }}>{selectedOrder.status}</span></span>
                            </div>
                            <div style={{ height: 12, background: 'var(--border-solid)', borderRadius: 99, overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: 'var(--gradient-primary)', width: `${selectedOrder.progress}%`, transition: 'width 1s ease' }} />
                            </div>
                        </div>

                        {/* Chat History */}
                        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '32px 32px', background: '#fcfcfc', backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(109, 176, 58, 0.03) 0%, transparent 50%)', display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {selectedOrder.chat.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#a0aec0', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#cbd5e1' }}><FiSmile /></div>
                                    <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.95rem' }}>No messages yet. Start interacting with our developers!</p>
                                </div>
                            ) : (
                                selectedOrder.chat.map((msg, idx) => (
                                    <div key={idx} style={{ alignSelf: msg.sender === 'client' ? 'flex-end' : 'flex-start', maxWidth: '80%', display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'client' ? 'flex-end' : 'flex-start' }}>
                                        <div style={{
                                            background: msg.sender === 'client' ? 'var(--gradient-primary)' : '#ffffff',
                                            color: msg.sender === 'client' ? '#ffffff' : 'var(--text-primary)',
                                            padding: '14px 20px',
                                            borderRadius: msg.sender === 'client' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                            border: msg.sender === 'client' ? 'none' : '1px solid var(--border-solid)',
                                            fontSize: '0.95rem',
                                            lineHeight: 1.5,
                                            boxShadow: msg.sender === 'client' ? '0 8px 16px rgba(109, 176, 58, 0.25)' : '0 4px 12px rgba(0,0,0,0.04)'
                                        }}>
                                            {msg.sender === 'admin' ? <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--pista-dark)', textTransform: 'uppercase', marginBottom: 4 }}>AlgorySoft Admin</div> : null}
                                            {msg.text}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, fontWeight: 600 }}>
                                            {msg.time}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Chat Input */}
                        <div style={{ padding: '20px 32px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-solid)', display: 'flex', gap: 12, alignItems: 'center' }}>
                            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }}>
                                <FiPaperclip size={20} />
                            </button>
                            <input
                                className="form-input"
                                placeholder="Type your message here..."
                                value={chatMsg}
                                onChange={(e) => setChatMsg(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMsg()}
                                style={{ flex: 1, borderRadius: 24, padding: '14px 24px', background: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                            />
                            <button className="btn-primary" onClick={handleSendMsg} style={{ borderRadius: '50%', width: 50, height: 50, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(109, 176, 58, 0.4)' }}>
                                <FiSend size={20} style={{ marginRight: -2, marginTop: 2 }} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
