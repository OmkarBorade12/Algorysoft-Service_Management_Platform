'use client';
import { useAppSelector } from '@/hooks/useRedux';

import Link from 'next/link';
import { useState } from 'react';
import Pagination from '@/components/ui/Pagination';
import { FiDollarSign, FiShoppingCart, FiFileText, FiBox, FiStar, FiZap, FiCheckCircle, FiMessageSquare, FiCreditCard, FiPlusCircle } from 'react-icons/fi';

// Dashboard reads directly from Redux now

export default function AdminDashboard() {
    const { reviews } = useAppSelector(s => s.reviews);
    const { items: projects } = useAppSelector(s => s.products);
    const { items: orders } = useAppSelector(s => s.orders);
    const { items: requests } = useAppSelector(s => s.requests);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const pendingReviews = reviews.filter(r => r.status === 'pending').length;
    
    // Dynamic Stats
    const STATS = [
        { label: 'Revenue (Active)', value: `₹${orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.amount, 0).toLocaleString('en-IN')}`, color: 'purple', icon: <FiDollarSign /> },
        { label: 'Active Orders', value: orders.filter(o => o.status === 'In Progress' || o.status === 'Pending').length.toString(), color: 'blue', icon: <FiShoppingCart /> },
        { label: 'Pending Requests', value: requests.filter(r => r.status === 'New').length.toString(), color: 'orange', icon: <FiFileText /> },
        { label: 'Total Products', value: projects.length.toString(), color: 'green', icon: <FiBox /> },
    ];

    return (
        <div>
            {/* Stats Overview */}
            <div className="berry-stats-grid">
                {STATS.map(stat => (
                    <div key={stat.label} className={`berry-stat ${stat.color}`}>
                        <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.2, fontSize: '8rem' }}>{stat.icon}</div>
                        <div className="berry-stat-value">{stat.value}</div>
                        <div className="berry-stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Recent Orders Tracker */}
                    <div className="berry-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h2 className="berry-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><FiShoppingCart /> Recent Active Orders</h2>
                            <Link href="/admin/orders" className="berry-btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>View All</Link>
                        </div>
                        <div className="berry-table-container">
                            <table className="berry-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Client</th>
                                        <th>Product (Tier)</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedOrders.map(o => (
                                        <tr key={o.id}>
                                            <td style={{ fontWeight: 600, color: '#5e35b1' }}>{o.id}</td>
                                            <td>{o.clientName}</td>
                                            <td>
                                                <div>{o.product}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#697586' }}>Tier: <strong style={{ color: '#121926' }}>{o.tier}</strong></div>
                                            </td>
                                            <td>
                                                <span className={`berry-badge ${o.status === 'In Progress' || o.status === 'Completed' ? 'success' : o.status === 'Cancelled' ? 'error' : 'warning'}`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td style={{ color: '#697586', fontSize: '0.85rem' }}>{o.date}</td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr><td colSpan={5} style={{ textAlign: 'center', color: '#697586', padding: '24px 0' }}>No active orders</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {orders.length > itemsPerPage && (
                            <Pagination 
                                currentPage={currentPage}
                                totalItems={orders.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </div>

                    {/* Pending Actions */}
                    {pendingReviews > 0 && (
                        <div className="berry-card" style={{ background: '#fff8e1', border: '1px solid #ffe082', display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', color: '#f57f17' }}><FiStar /></div>
                            <div>
                                <h3 style={{ margin: 0, color: '#f57f17', fontSize: '1rem', fontWeight: 600 }}>Approval Needed</h3>
                                <div style={{ color: '#fbc02d', fontSize: '0.9rem' }}>You have {pendingReviews} new reviews awaiting approval.</div>
                            </div>
                            <Link href="/admin/reviews" className="berry-btn-primary" style={{ marginLeft: 'auto', background: '#f57f17', display: 'flex', alignItems: 'center' }}>Review Now</Link>
                        </div>
                    )}
                </div>

                {/* Quick Actions sidebar */}
                <div className="berry-card">
                    <h2 className="berry-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiZap /> Quick Actions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { href: '/admin/requests', icon: <FiCheckCircle color="#10b981" />, label: 'Approve Requests', sub: 'Review custom requirements' },
                            { href: '/admin/orders', icon: <FiMessageSquare color="#3b82f6" />, label: 'Reply to Chats', sub: 'Message active clients' },
                            { href: '/admin/cards', icon: <FiCreditCard color="#8b5cf6" />, label: 'Manage Cards', sub: 'Setup Basic/Silver/Gold tiers' },
                            { href: '/admin/products', icon: <FiPlusCircle color="#f59e0b" />, label: 'Add New Product', sub: 'Upload template code' },
                        ].map(action => (
                            <Link key={action.href} href={action.href} style={{
                                display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: '#f8fafc',
                                borderRadius: '12px', textDecoration: 'none', border: '1px solid #e3e8ef', transition: 'all 0.2s'
                            }} className="hoverable-action">
                                <div style={{ background: 'white', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                    {action.icon}
                                </div>
                                <div>
                                    <div style={{ color: '#121926', fontWeight: 600, fontSize: '0.95rem' }}>{action.label}</div>
                                    <div style={{ color: '#697586', fontSize: '0.8rem' }}>{action.sub}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .hoverable-action:hover { background-color: #ede7f6 !important; border-color: #5e35b1 !important; transform: translateY(-2px); }
            `}</style>
        </div>
    );
}
