'use client';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { addInvoice, updateInvoiceStatus, deleteInvoice, InvoiceData } from '@/store/slices/invoicesSlice';
import { FiZap, FiFileText, FiUser, FiBox, FiEye, FiSave, FiList, FiPrinter, FiPlus, FiTrash2, FiClock, FiX, FiCheckCircle, FiSend } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '@/components/ui/ConfirmModal';

const getBlankInvoice = (): Omit<InvoiceData, 'id' | 'createdAt'> => ({
    invoiceNo: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    projectName: '',
    description: '',
    amount: 0,
    gstPercent: 18,
    discount: 0,
    notes: 'Thank you for your business! Payment due within the specified date.',
    status: 'Draft',
});

export default function AdminInvoicesPage() {
    const orders = useAppSelector(s => s.orders.items);
    const oStatus = useAppSelector(s => s.orders.status);
    const invoiceHistory = useAppSelector(s => s.invoices?.items || []);
    const dispatch = useAppDispatch();

    const [inv, setInv] = useState<Omit<InvoiceData, 'id' | 'createdAt'>>(getBlankInvoice());
    const [preview, setPreview] = useState(false);
    const [previewInvoice, setPreviewInvoice] = useState<InvoiceData | null>(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const printRef = useRef<HTMLDivElement>(null);

    const handleAutofill = (orderId: string) => {
        const o = orders.find(x => x.id === orderId);
        if (o) {
            setInv(p => ({
                ...p,
                clientName: o.client_name,
                clientEmail: o.client_email,
                projectName: o.product,
                amount: o.amount,
                status: o.status === 'Completed' ? 'Paid' : 'Sent',
            }));
            toast.success(`Autofilled invoice details from Order ${o.id}`);
        }
    };

    const subtotal = inv.amount;
    const discountAmt = (subtotal * inv.discount) / 100;
    const gstAmt = ((subtotal - discountAmt) * inv.gstPercent) / 100;
    const total = subtotal - discountAmt + gstAmt;

    const handlePrint = () => {
        setTimeout(() => {
            window.print();
        }, 300);
    };

    const handleSave = () => {
        if (!inv.clientName || !inv.projectName || !inv.amount) {
            toast.error('Please fill in Client Name, Project Name, and Amount.');
            return;
        }
        dispatch(addInvoice({ ...inv, id: Date.now().toString(), createdAt: new Date().toISOString() }));
        toast.success(`Invoice ${inv.invoiceNo} saved & sent to Client Dashboard!`);
        setInv(getBlankInvoice());
        setShowFormModal(false);
    };

    const handleDelete = () => {
        if (deleteId) {
            dispatch(deleteInvoice(deleteId));
            toast.success('Invoice deleted');
            setDeleteId(null);
        }
    };

    const f = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

    const openPreview = (invoice: InvoiceData) => {
        setPreviewInvoice(invoice);
        setPreview(true);
    };

    if (oStatus === 'loading') return (
        <div style={{ padding: 24 }}>
            <div className="berry-card" style={{ opacity: 0.6 }}>
                <div style={{ height: 32, width: '40%', backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 16 }} />
                <div style={{ height: 16, width: '60%', backgroundColor: '#f0f0f0', borderRadius: 6, marginBottom: 32 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div style={{ height: 500, backgroundColor: '#f5f5f5', borderRadius: 12 }} />
                    <div style={{ height: 300, backgroundColor: '#f5f5f5', borderRadius: 12 }} />
                </div>
            </div>
        </div>
    );

    return (
        <>
            <AnimatePresence>
                {showFormModal && (
                    <div className="modal-overlay">
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            exit={{ y: 50, opacity: 0 }}
                            className="berry-modal-container" 
                            style={{ maxWidth: 1100, width: '95%', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 20 }}
                        >
                            <div className="modal-header" style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', background: '#fff' }}>
                                <div style={{ display: 'flex', gap: 14 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--berry-secondary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--berry-secondary-dark)', flexShrink: 0 }}>
                                        <FiFileText size={22} />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#121926', marginBottom: 2 }}>Create New Invoice</h3>
                                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', fontWeight: 500, lineHeight: 1.4 }}>Generate professional invoice for your business clients</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowFormModal(false)} className="close-btn" style={{ background: '#f8fafc', border: 'none', width: 36, height: 36, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: -4, marginRight: -8 }}>
                                    <FiX size={20} />
                                </button>
                            </div>

                            <div className="berry-modal-main" style={{ flex: 1, overflowY: 'auto' }}>
                                <div className="berry-responsive-grid" style={{ minHeight: '100%', gap: 0 }}>
                                    {/* Left Column: Form */}
                                     <div style={{ padding: '24px', background: '#fff' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                            
                                            {/* Autofill Section */}
                                            <div style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #f0f9ff 100%)', padding: 16, borderRadius: 16, border: '1px solid rgba(94, 53, 177, 0.1)' }}>
                                            <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.05, transform: 'rotate(15deg)' }}>
                                                <FiZap size={100} />
                                            </div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 700, color: '#5e35b1', marginBottom: 12 }}>
                                                <FiZap /> Quick Autofill from Orders
                                            </label>
                                            <select 
                                                className="berry-input" 
                                                onChange={e => handleAutofill(e.target.value)} 
                                                defaultValue=""
                                                style={{ border: '2px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: 48 }}
                                            >
                                                <option value="" disabled>Select an Active Order...</option>
                                                {orders.map(o => (
                                                    <option key={o.id} value={o.id}>{o.order_id || `#${o.id}`} - {o.client_name} ({o.product})</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Basic Info */}
                                        <div className="berry-form-grid-2">
                                            <div className="field-group">
                                                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiList size={14} /> Invoice Number</label>
                                                <input className="berry-input" value={inv.invoiceNo} onChange={e => setInv(p => ({ ...p, invoiceNo: e.target.value }))} style={{ height: 46 }} />
                                            </div>
                                            <div className="field-group">
                                                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiClock size={14} /> Status</label>
                                                <select className="berry-input" value={inv.status} onChange={e => setInv(p => ({ ...p, status: e.target.value as InvoiceData['status'] }))} style={{ height: 46 }}>
                                                    <option>Draft</option><option>Sent</option><option>Paid</option>
                                                </select>
                                            </div>
                                            <div className="field-group">
                                                <label className="input-label">Invoice Date</label>
                                                <input type="date" className="berry-input" value={inv.date} onChange={e => setInv(p => ({ ...p, date: e.target.value }))} style={{ height: 46 }} />
                                            </div>
                                            <div className="field-group">
                                                <label className="input-label">Due Date</label>
                                                <input type="date" className="berry-input" value={inv.dueDate} onChange={e => setInv(p => ({ ...p, dueDate: e.target.value }))} style={{ height: 46, color: '#ef4444', fontWeight: 600 }} />
                                            </div>
                                        </div>

                                        {/* Client Info Section */}
                                        <div style={{ padding: '4px' }}>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 20, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '2px solid #f1f5f9' }}>
                                                <FiUser /> Client Information
                                            </h4>
                                            <div className="berry-form-grid-2">
                                                <div className="field-group">
                                                    <label className="input-label">Client Name *</label>
                                                    <input className="berry-input" value={inv.clientName} onChange={e => setInv(p => ({ ...p, clientName: e.target.value }))} placeholder="Rajesh Kumar" style={{ height: 46 }} />
                                                </div>
                                                <div className="field-group">
                                                    <label className="input-label">Email Address</label>
                                                    <input type="email" className="berry-input" value={inv.clientEmail} onChange={e => setInv(p => ({ ...p, clientEmail: e.target.value }))} placeholder="client@example.com" style={{ height: 46 }} />
                                                </div>
                                                <div className="field-group">
                                                    <label className="input-label">Phone Number</label>
                                                    <input className="berry-input" value={inv.clientPhone} onChange={e => setInv(p => ({ ...p, clientPhone: e.target.value }))} placeholder="+91 9999999999" style={{ height: 46 }} />
                                                </div>
                                                <div className="field-group">
                                                    <label className="input-label">Billing Address</label>
                                                    <input className="berry-input" value={inv.clientAddress} onChange={e => setInv(p => ({ ...p, clientAddress: e.target.value }))} placeholder="City, State" style={{ height: 46 }} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Project Details Section */}
                                        <div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 20, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '2px solid #f1f5f9' }}>
                                                <FiBox /> Project Scope & Pricing
                                            </h4>
                                            <div className="field-group">
                                                <label className="input-label">Project / Product Name *</label>
                                                <input className="berry-input" value={inv.projectName} onChange={e => setInv(p => ({ ...p, projectName: e.target.value }))} placeholder="e.g. Premium E-Commerce Store" style={{ height: 46 }} />
                                            </div>
                                            <div className="field-group">
                                                <label className="input-label">Task Description</label>
                                                <textarea className="berry-input" rows={2} value={inv.description} onChange={e => setInv(p => ({ ...p, description: e.target.value }))} placeholder="What was delivered..." style={{ resize: 'none' }} />
                                            </div>
                                            <div className="berry-form-grid-3" style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e3e8ef' }}>
                                                <div className="field-group" style={{ marginBottom: 0 }}>
                                                    <label className="input-label">Base Amount (₹) *</label>
                                                    <input type="number" className="berry-input" value={inv.amount || ''} onChange={e => setInv(p => ({ ...p, amount: +e.target.value }))} style={{ height: 44, fontSize: '1.1rem', fontWeight: 700 }} />
                                                </div>
                                                <div className="field-group" style={{ marginBottom: 0 }}>
                                                    <label className="input-label">Discount (%)</label>
                                                    <input type="number" className="berry-input" value={inv.discount || ''} onChange={e => setInv(p => ({ ...p, discount: +e.target.value }))} style={{ height: 44, color: '#ef4444' }} />
                                                </div>
                                                <div className="field-group" style={{ marginBottom: 0 }}>
                                                    <label className="input-label">GST (%)</label>
                                                    <input type="number" className="berry-input" value={inv.gstPercent} onChange={e => setInv(p => ({ ...p, gstPercent: +e.target.value }))} style={{ height: 44, color: '#2563eb' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                 {/* Right Column: Summary Sidebar */}
                                <div className="berry-modal-sidebar" style={{ background: 'var(--berry-grey-50)', padding: '32px' }}>
                                    <div style={{ position: 'sticky', top: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>Bill Summary</h4>
                                            <div style={{ height: 2, flex: 1, background: '#e2e8f0' }} />
                                        </div>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 32 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                                <span style={{ color: '#64748b', fontWeight: 500 }}>Subtotal</span>
                                                <span style={{ fontWeight: 700, color: '#1e293b' }}>{f(subtotal)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#c2185b' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Discount ({inv.discount}%)</span>
                                                <span style={{ fontWeight: 700 }}>-{f(discountAmt)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#1565c0' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>GST ({inv.gstPercent}%)</span>
                                                <span style={{ fontWeight: 700 }}>{f(gstAmt)}</span>
                                            </div>
                                            <div style={{ height: 1, borderTop: '2px dashed #e2e8f0', margin: '4px 0' }} />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                                                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>Grand Total</span>
                                                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#5e35b1', textShadow: '0 10px 20px rgba(94, 53, 177, 0.1)' }}>{f(total)}</span>
                                            </div>
                                        </div>

                                        <div className="field-group" style={{ marginBottom: 24 }}>
                                            <label className="input-label" style={{ fontSize: '0.8rem' }}>Additional Notes</label>
                                            <textarea className="berry-input" rows={3} value={inv.notes} onChange={e => setInv(p => ({ ...p, notes: e.target.value }))} style={{ fontSize: '0.82rem', background: '#fff', borderStyle: 'solid', resize: 'none' }} />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            <button 
                                                className="btn-primary" 
                                                onClick={handleSave} 
                                                style={{ width: '100%', height: 54, borderRadius: 14, background: 'linear-gradient(135deg, #673ab7 0%, #5e35b1 100%)', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 12px 24px -8px rgba(94, 53, 177, 0.4)' }}
                                            >
                                                <FiSave size={20} /> Create & Save Invoice
                                            </button>
                                            <button 
                                                className="berry-btn-outline" 
                                                onClick={() => setShowFormModal(false)} 
                                                style={{ width: '100%', height: 48, borderRadius: 12, border: '2px solid #e2e8f0', color: '#64748b' }}
                                            >
                                                Discard Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.4 }}
                style={{ width: '100%', maxWidth: '100%' }}
            >
                {!preview ? (
                    <div className="berry-animate-in">
                        <div className="berry-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                                <div>
                                    <h2 className="berry-title" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
                                        <FiList /> Invoice Management
                                    </h2>
                                    <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 4 }}>History of all generated invoices and payments</p>
                                </div>
                                <button className="berry-btn-primary" onClick={() => { setInv(getBlankInvoice()); setShowFormModal(true); }} style={{ padding: '12px 24px' }}>
                                    <FiPlus /> Create New Invoice
                                </button>
                            </div>

                            <div className="berry-table-container">
                                <table className="berry-table">
                                    <thead>
                                        <tr>
                                            <th>Invoice #</th>
                                            <th>Date</th>
                                            <th>Client Name</th>
                                            <th>Project</th>
                                            <th>Total Amount</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoiceHistory.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>
                                                    <FiFileText size={48} style={{ marginBottom: 12 }} />
                                                    <p>No invoices generated yet.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            invoiceHistory.map(i => (
                                                <tr key={i.id}>
                                                    <td style={{ fontWeight: 700, color: '#5e35b1' }}>{i.invoiceNo}</td>
                                                    <td>{new Date(i.date).toLocaleDateString('en-IN')}</td>
                                                    <td>{i.clientName}</td>
                                                    <td>{i.projectName}</td>
                                                    <td>{f(i.amount * (1 - i.discount/100) * (1 + i.gstPercent/100))}</td>
                                                    <td>
                                                        <span className={`berry-badge ${i.status === 'Paid' ? 'success' : i.status === 'Sent' ? 'info' : 'warning'}`}>
                                                            {i.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                            <button className="berry-btn-outline" onClick={() => openPreview(i)} title="Preview Invoice">
                                                                <FiEye />
                                                            </button>
                                                            <button className="berry-btn-outline" onClick={() => setDeleteId(i.id)} style={{ color: '#ef4444', borderColor: '#ef4444' }} title="Delete">
                                                                <FiTrash2 />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Print Preview Mode */
                    <div className="berry-animate-in">
                        <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button className="berry-btn-outline" onClick={() => { setPreview(false); setPreviewInvoice(null); }}>
                                    <FiX /> Close Preview
                                </button>
                                <button className="berry-btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FiPrinter /> Print / Download PDF
                                </button>
                            </div>
                            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                Invoice: <span style={{ fontWeight: 700, color: '#121926' }}>{previewInvoice?.invoiceNo}</span>
                            </div>
                        </div>

                        <div ref={printRef} className="invoice-preview" style={{ background: 'white', padding: '40px 32px', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', maxWidth: 850, margin: '0 auto', color: '#121926', border: '1px solid #e3e8ef' }}>
                            {previewInvoice && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #5e35b1', paddingBottom: 24, marginBottom: 32 }}>
                                        <div>
                                            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#5e35b1', letterSpacing: '-1px', marginBottom: 4 }}>AlgorySoft</div>
                                            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Premium Web & Software Solutions</div>
                                            <div style={{ color: '#121926', fontSize: '0.9rem', marginTop: 12 }}>algorysoft@gmail.com</div>
                                            <div style={{ color: '#121926', fontSize: '0.9rem' }}>+91 78995 33525</div>
                                            <div style={{ color: '#121926', fontSize: '0.9rem' }}>Bangalore, Karnataka, India</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#f1f5f9', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: -10 }}>INVOICE</div>
                                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#334155' }}>#{previewInvoice.invoiceNo}</div>
                                            <div style={{ display: 'inline-block', background: previewInvoice.status === 'Paid' ? '#b9f6ca' : previewInvoice.status === 'Sent' ? '#e3f2fd' : '#fff9c4', color: previewInvoice.status === 'Paid' ? '#00c853' : previewInvoice.status === 'Sent' ? '#1565c0' : '#f57f17', padding: '6px 16px', borderRadius: 99, fontSize: '0.85rem', fontWeight: 700, marginTop: 12, textTransform: 'uppercase' }}>{previewInvoice.status}</div>
                                        </div>
                                    </div>

                                    <div className="invoice-header-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 48 }}>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: 10, display: 'block', letterSpacing: '1px' }}>Billed To</label>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#121926' }}>{previewInvoice.clientName}</div>
                                            <div style={{ fontSize: '0.95rem', color: '#475569', marginTop: 6 }}>{previewInvoice.clientEmail}</div>
                                            <div style={{ fontSize: '0.95rem', color: '#475569' }}>{previewInvoice.clientPhone}</div>
                                            <div style={{ fontSize: '0.95rem', color: '#475569', maxWidth: '300px' }}>{previewInvoice.clientAddress}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: 10, display: 'block', letterSpacing: '1px' }}>Invoice Dates</label>
                                            <div style={{ fontSize: '1rem', marginBottom: 8 }}><strong>Date:</strong> {new Date(previewInvoice.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</div>
                                            <div style={{ fontSize: '1rem' }}><strong>Due Date:</strong> <span style={{ color: '#ef4444', fontWeight: 700 }}>{new Date(previewInvoice.dueDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span></div>
                                        </div>
                                    </div>

                                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 40 }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                                <th style={{ padding: '16px 0', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Project Description</th>
                                                <th style={{ padding: '16px 0', textAlign: 'right', color: '#64748b', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '24px 0' }}>
                                                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1e293b' }}>{previewInvoice.projectName}</div>
                                                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: 6, lineHeight: 1.6 }}>{previewInvoice.description}</div>
                                                </td>
                                                <td style={{ padding: '24px 0', textAlign: 'right', fontWeight: 800, fontSize: '1.15rem', color: '#1e293b' }}>{f(previewInvoice.amount)}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <div style={{ width: '320px', background: '#f8fafc', padding: 24, borderRadius: 16 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '1rem' }}>
                                                <span style={{ color: '#64748b' }}>Subtotal</span>
                                                <span style={{ fontWeight: 600 }}>{f(previewInvoice.amount)}</span>
                                            </div>
                                            {previewInvoice.discount > 0 && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '1rem', color: '#ef4444' }}>
                                                    <span>Discount ({previewInvoice.discount}%)</span>
                                                    <span style={{ fontWeight: 600 }}>-{f(previewInvoice.amount * previewInvoice.discount / 100)}</span>
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '1rem' }}>
                                                <span style={{ color: '#64748b' }}>GST ({previewInvoice.gstPercent}%)</span>
                                                <span style={{ fontWeight: 600 }}>{f((previewInvoice.amount * (1 - previewInvoice.discount/100)) * previewInvoice.gstPercent / 100)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.6rem', fontWeight: 900, color: '#5e35b1', marginTop: 12, paddingTop: 12, borderTop: '2px dashed #cbd5e1' }}>
                                                <span>Total</span>
                                                <span>{f(previewInvoice.amount * (1 - previewInvoice.discount/100) * (1 + previewInvoice.gstPercent/100))}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {previewInvoice.notes && (
                                        <div style={{ marginTop: 40, padding: 24, background: '#f5f3ff', borderRadius: 12, fontSize: '0.95rem', color: '#5e35b1', borderLeft: '6px solid #5e35b1' }}>
                                            <div style={{ fontWeight: 800, marginBottom: 6, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Notes</div>
                                            <div style={{ lineHeight: 1.6 }}>{previewInvoice.notes}</div>
                                        </div>
                                    )}

                                    <div style={{ marginTop: 60, paddingTop: 32, borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 2 }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>Thank you for choosing AlgorySoft!</div>
                                        This is a computer-generated invoice. No signature required.
                                        <br />Bangalore, KA • Website: algorysoft.in • Support: algorysoft@gmail.com
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

            <ConfirmModal 
                isOpen={!!deleteId} 
                title="Delete Invoice" 
                message="Are you sure you want to delete this invoice? This cannot be undone." 
                onConfirm={handleDelete} 
                onCancel={() => setDeleteId(null)} 
            />

            <style jsx>{`
                .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: flex-start; z-index: 10000; padding: 60px 20px; overflow-y: auto; }
                .modal-container { border: none; box-shadow: 0 40px 100px rgba(0,0,0,0.3); width: 100%; position: relative; margin-bottom: 60px; border-radius: 20px; overflow: hidden; background: #fff; }
                .modal-header h3 { margin: 0; font-size: 1.4rem; color: #1e293b; letter-spacing: -0.5px; }
                .close-btn:hover { background: #fee2e2 !important; color: #ef4444 !important; }
                .input-label { display: block; font-size: 0.82rem; font-weight: 700; color: #475569; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
                .field-group { margin-bottom: 0px; }
                
                @media print {
                    :global(body *) { visibility: hidden; }
                    #print-section, #print-section * { visibility: visible; }
                    #print-section { position: absolute; left: 0; top: 0; width: 100%; }
                }

                @media (max-width: 768px) {
                    .modal-container { width: 100% !important; height: 100vh !important; border-radius: 0 !important; }
                    .modal-header { padding: 16px 20px !important; }
                    .invoice-preview { padding: 24px 16px !important; }
                    .invoice-header-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
                    .invoice-header-grid > div:last-child { text-align: left !important; }
                    .invoice-summary { width: 100% !important; margin-top: 24px !important; }
                    .invoice-action-btns { flex-direction: column !important; }
                }

                @font-face {
                    font-family: 'Inter';
                    src: url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                }
            `}</style>
            
            {/* Hidden Print Container for Better Print Layout */}
            <div id="print-section" style={{ display: 'none' }}>
                <div ref={printRef} />
            </div>
            </motion.div>
        </>
    );
}
