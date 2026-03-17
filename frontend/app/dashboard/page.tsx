'use client';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FiExternalLink, FiGlobe, FiArrowLeft, FiMessageSquare, FiSettings, FiShoppingCart, FiLayout } from 'react-icons/fi';
import '../admin/berry.css';

export default function ClientDashboardPage() {
    const { isAuthenticated, user } = useAppSelector(s => s.auth);
    const orders = useAppSelector(s => s.orders.items);
    const invoices = useAppSelector(s => s.invoices?.items || []);
    const dispatch = useAppDispatch();
    const router = useRouter();
    
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'invoices' | 'profile'>('dashboard');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [chatMsg, setChatMsg] = useState('');
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const activeOrder = orders.find(o => o.id === selectedOrderId);

    // Filter data for the logged in user
    const displayOrders = orders.filter(o => o.clientEmail === user?.email);
    const displayInvoices = invoices.filter(i => i.clientEmail === user?.email);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [activeOrder?.chat]);

    const handleSendMsg = () => {
        if (!chatMsg.trim() || !activeOrder) return;
        dispatch(addOrderMessage({
            id: activeOrder.id,
            message: { sender: 'client', text: chatMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        }));
        setChatMsg('');
    };

    if (!isAuthenticated || !user) return null;

    return (
        <div className="berry-admin-layout" style={{ minHeight: '100vh', background: '#eef2f6' }}>
            {/* Sidebar overlay styled for client */}
            <aside className="berry-sidebar" style={{ width: '260px' }}>
                <div className="berry-logo">
                    <span style={{ fontSize: '1.8rem' }}>⚛️</span>
                    <span>Client Portal</span>
                </div>

                <div style={{ padding: '0 24px', marginBottom: 24 }}>
                    <div style={{ padding: '16px', background: '#ede7f6', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, background: '#5e35b1', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: '#5e35b1', fontSize: '0.9rem' }}>{user.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#697586' }}>Business Client</div>
                        </div>
                    </div>
                </div>

                <nav className="berry-nav">
                    <button className={`berry-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setSelectedOrderId(null); }}>
                        <FiLayout size={18} /><span>Overview</span>
                    </button>
                    <button className={`berry-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); setSelectedOrderId(null); }}>
                        <FiShoppingCart size={18} /><span>My Projects</span>
                    </button>
                    <button className={`berry-nav-item ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => { setActiveTab('invoices'); setSelectedOrderId(null); }}>
                        <FiMessageSquare size={18} /><span>Invoices & Billing</span>
                    </button>
                    <button className={`berry-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => { setActiveTab('profile'); setSelectedOrderId(null); }}>
                        <FiSettings size={18} /><span>Profile Settings</span>
                    </button>
                </nav>

                <div style={{ marginTop: 'auto', padding: '24px' }}>
                    <Link href="/" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '10px', 
                        padding: '12px',
                        background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                        color: 'white',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 14px 0 rgba(33, 150, 243, 0.39)',
                        transition: 'all 0.3s ease'
                    }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <FiGlobe size={18} /> Visit Website
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="berry-main" style={{ marginLeft: '260px', width: 'calc(100% - 260px)' }}>
                <header className="berry-topbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                            {activeTab === 'dashboard' && 'Welcome to your Workspace 👋'}
                            {activeTab === 'orders' && !activeOrder && 'My Active Projects'}
                            {activeTab === 'orders' && activeOrder && `Tracking: ${activeOrder.product}`}
                            {activeTab === 'invoices' && 'Billing & Invoices'}
                            {activeTab === 'profile' && 'Account Settings'}
                        </h1>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#697586', textDecoration: 'none', fontSize: '0.8rem', padding: '4px 10px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e3e8ef' }}>
                           <FiArrowLeft size={12} /> Go back to Website
                        </Link>
                    </div>
                    <div style={{ color: '#697586', fontSize: '0.9rem' }}>
                        Need help? <a href="/contact" style={{ color: '#5e35b1', fontWeight: 600, textDecoration: 'none' }}>Contact Support</a>
                    </div>
                </header>

                <main className="berry-content">
                    {activeTab === 'dashboard' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div className="berry-stats-grid">
                                <div className="berry-stat blue">
                                    <div className="berry-stat-value">{displayOrders.length}</div>
                                    <div className="berry-stat-label">Total Projects</div>
                                </div>
                                <div className="berry-stat purple">
                                    <div className="berry-stat-value">{displayOrders.filter(o => o.status === 'In Progress').length}</div>
                                    <div className="berry-stat-label">In Development</div>
                                </div>
                                <div className="berry-stat orange">
                                    <div className="berry-stat-value">{displayInvoices.filter(i => i.status === 'Sent').length}</div>
                                    <div className="berry-stat-label">Pending Invoices</div>
                                </div>
                            </div>

                            <div className="berry-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <h2 className="berry-title" style={{ margin: 0 }}>Recent Activity</h2>
                                    <button className="berry-btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setActiveTab('orders')}>View All Projects</button>
                                </div>
                                {displayOrders.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#697586' }}>You have no active projects currently.</div>
                                ) : (
                                    <div className="berry-table-container">
                                        <table className="berry-table">
                                            <thead>
                                                <tr>
                                                    <th>Project Name</th>
                                                    <th>Status</th>
                                                    <th>Progress</th>
                                                    <th>Last Update</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {displayOrders.slice(0, 3).map(o => (
                                                    <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => { setActiveTab('orders'); setSelectedOrderId(o.id); }}>
                                                        <td style={{ fontWeight: 600, color: '#121926' }}>{o.product} <span style={{ fontSize: '0.75rem', color: '#697586', marginLeft: 8 }}>({o.tier})</span></td>
                                                        <td><span className={`berry-badge ${o.status === 'Completed' ? 'success' : o.status === 'In Progress' ? 'warning' : 'info'}`}>{o.status}</span></td>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                <div style={{ flex: 1, height: 6, background: '#e3e8ef', borderRadius: 3, overflow: 'hidden' }}>
                                                                    <div style={{ width: `${o.progress}%`, height: '100%', background: '#5e35b1' }} />
                                                                </div>
                                                                <span style={{ fontSize: '0.8rem', color: '#697586', width: 30 }}>{o.progress}%</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ fontSize: '0.85rem', color: '#697586' }}>{new Date(o.date).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'invoices' && (
                        <div className="berry-card">
                            <h2 className="berry-title" style={{ marginBottom: 24 }}>Invoices from AlgorySoft</h2>
                            {displayInvoices.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 0', color: '#697586' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.5 }}>🧾</div>
                                    <p>No invoices have been generated for your account yet.</p>
                                </div>
                            ) : (
                                <div className="berry-table-container">
                                    <table className="berry-table">
                                        <thead>
                                            <tr>
                                                <th>Invoice No</th>
                                                <th>Date</th>
                                                <th>Project</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayInvoices.map(inv => (
                                                <tr key={inv.id}>
                                                    <td><strong style={{ color: '#5e35b1' }}>{inv.invoiceNo}</strong></td>
                                                    <td style={{ fontSize: '0.85rem', color: '#697586' }}>{new Date(inv.date).toLocaleDateString()}</td>
                                                    <td>{inv.projectName}</td>
                                                    <td style={{ fontWeight: 700 }}>₹{inv.amount.toLocaleString()}</td>
                                                    <td><span className={`berry-badge ${inv.status === 'Paid' ? 'success' : inv.status === 'Sent' ? 'warning' : 'info'}`}>{inv.status}</span></td>
                                                    <td>
                                                        <button className="berry-btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => alert('Downloading PDF...')}>
                                                            Download PDF
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'orders' && !activeOrder && (
                        <div className="berry-card">
                            <h2 className="berry-title" style={{ marginBottom: 24 }}>Your Projects</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
                                {displayOrders.map(o => (
                                    <div key={o.id} style={{ border: '1px solid #e3e8ef', borderRadius: 12, padding: 24, background: '#ffffff', transition: 'all 0.2s', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
                                        onClick={() => setSelectedOrderId(o.id)}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#5e35b1'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e3e8ef'}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#121926' }}>{o.product}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#697586', marginTop: 4 }}>Order ID: {o.id}</div>
                                            </div>
                                            <span className={`berry-badge ${o.status === 'Completed' ? 'success' : o.status === 'In Progress' ? 'warning' : 'info'}`}>{o.status}</span>
                                        </div>
                                        
                                        <div style={{ marginBottom: 20 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8, color: '#364152' }}>
                                                <span>Development Progress</span>
                                                <span style={{ fontWeight: 600 }}>{o.progress}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: 8, background: '#ede7f6', borderRadius: 4, overflow: 'hidden' }}>
                                                <div style={{ width: `${o.progress}%`, height: '100%', background: '#5e35b1', borderRadius: 4 }} />
                                            </div>
                                        </div>
                                        
                                        <button className="berry-btn-outline" style={{ width: '100%' }}>Track & Chat</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && activeOrder && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24, height: 'calc(100vh - 120px)' }}>
                            {/* Chat Interface */}
                            <div className="berry-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', height: '100%' }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid #e3e8ef', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <button onClick={() => setSelectedOrderId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#697586', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, fontSize: '1.2rem' }}>←</button>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#121926', fontSize: '1.1rem' }}>{activeOrder.product} Workspace</h3>
                                        <div style={{ fontSize: '0.8rem', color: '#5e35b1', fontWeight: 600, marginTop: 4 }}>• Admin Online</div>
                                    </div>
                                </div>
                                     <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: '#f8fafc' }}>
                                    {activeOrder.chat.map((msg, i) => (
                                        <div key={i} style={{ alignSelf: msg.sender === 'admin' ? 'flex-start' : 'flex-end', maxWidth: '80%' }}>
                                            <div style={{
                                                background: msg.sender === 'admin' ? '#ffffff' : '#5e35b1',
                                                color: msg.sender === 'admin' ? '#121926' : '#ffffff',
                                                padding: '12px 16px',
                                                borderRadius: '16px',
                                                borderBottomRightRadius: msg.sender !== 'admin' ? 4 : 16,
                                                borderBottomLeftRadius: msg.sender === 'admin' ? 4 : 16,
                                                fontSize: '0.95rem',
                                                boxShadow: msg.sender === 'admin' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                                border: msg.sender === 'admin' ? '1px solid #e3e8ef' : 'none'
                                            }}>
                                                {msg.text}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#697586', marginTop: 6, textAlign: msg.sender !== 'admin' ? 'right' : 'left' }}>
                                                {msg.sender === 'admin' ? 'AlgorySoft Admin' : 'You'} • {msg.time}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ padding: 20, borderTop: '1px solid #e3e8ef', background: '#ffffff', display: 'flex', gap: 12 }}>
                                    <input 
                                        type="text" 
                                        className="berry-input" 
                                        placeholder="Type a message or share requirements..." 
                                        value={chatMsg} 
                                        onChange={(e) => setChatMsg(e.target.value)} 
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMsg()}
                                        style={{ flex: 1 }}
                                    />
                                    <button className="berry-btn-primary" style={{ padding: '0 24px' }} onClick={handleSendMsg}>Send</button>
                                </div>
                            </div>

                            {/* Tracking Sidebar */}
                            <div className="berry-card" style={{ height: 'fit-content' }}>
                                <h3 className="berry-title" style={{ fontSize: '1.1rem', marginBottom: 24 }}>Project Tracking</h3>
                                
                                <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #e3e8ef' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#364152', fontSize: '0.9rem', marginBottom: 8 }}>
                                        <span style={{ fontWeight: 600 }}>Total Progress</span>
                                        <span style={{ color: '#5e35b1', fontWeight: 700 }}>{activeOrder.progress}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: 8, background: '#ede7f6', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ width: `${activeOrder.progress}%`, height: '100%', background: '#5e35b1', borderRadius: 4, transition: 'width 0.5s ease' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: activeOrder.progress >= 25 ? '#b9f6ca' : '#f8fafc', color: activeOrder.progress >= 25 ? '#00e676' : '#697586', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#121926', fontSize: '0.9rem' }}>Project Initiated</div>
                                            <div style={{ fontSize: '0.75rem', color: '#697586' }}>Requirements gathered</div>
                                        </div>
                                    </div>
                                    <div style={{ width: 2, height: 20, background: '#e3e8ef', marginLeft: 15 }}></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: activeOrder.progress >= 50 ? '#b9f6ca' : '#f8fafc', color: activeOrder.progress >= 50 ? '#00e676' : '#697586', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#121926', fontSize: '0.9rem' }}>Design & UI/UX</div>
                                            <div style={{ fontSize: '0.75rem', color: '#697586' }}>Mockups approved</div>
                                        </div>
                                    </div>
                                    <div style={{ width: 2, height: 20, background: '#e3e8ef', marginLeft: 15 }}></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: activeOrder.progress >= 75 ? '#b9f6ca' : '#f8fafc', color: activeOrder.progress >= 75 ? '#00e676' : '#697586', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#121926', fontSize: '0.9rem' }}>Development</div>
                                            <div style={{ fontSize: '0.75rem', color: '#697586' }}>Code & API integration</div>
                                        </div>
                                    </div>
                                    <div style={{ width: 2, height: 20, background: '#e3e8ef', marginLeft: 15 }}></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: activeOrder.progress >= 100 ? '#b9f6ca' : '#f8fafc', color: activeOrder.progress >= 100 ? '#00e676' : '#697586', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#121926', fontSize: '0.9rem' }}>Testing & Delivery</div>
                                            <div style={{ fontSize: '0.75rem', color: '#697586' }}>Ready for launch</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="berry-card" style={{ maxWidth: 600 }}>
                            <h2 className="berry-title" style={{ marginBottom: 24 }}>Account Settings</h2>
                            <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Full Name</label>
                                    <input className="berry-input" defaultValue={user.name} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Email Address</label>
                                    <input className="berry-input" defaultValue={user.email} disabled style={{ background: '#f8fafc', cursor: 'not-allowed' }} />
                                    <div style={{ fontSize: '0.75rem', color: '#697586', marginTop: 6 }}>Email cannot be changed online. Contact support.</div>
                                </div>
                                <button type="button" className="berry-btn-primary" style={{ alignSelf: 'flex-start', marginTop: 12 }}>Save Changes</button>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
