'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    const handleSave = async () => {
        if (!inv.clientName || !inv.projectName || !inv.amount) {
            toast.error('Please fill in Client Name, Project Name, and Amount.');
            return;
        }

        const newId = Date.now().toString();
        const payload = { ...inv, id: newId, createdAt: new Date().toISOString() };
        
        // Save to Redux store
        dispatch(addInvoice(payload));
        
        // Send email if status is Sent or Paid
        if (inv.status === 'Sent' || inv.status === 'Paid') {
            const loadingToast = toast.loading(`Sending invoice to ${inv.clientEmail}...`);
            try {
                const response = await fetch('http://localhost:8000/api/send-invoice-email/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        client_email: inv.clientEmail,
                        invoice_no: inv.invoiceNo,
                        status: inv.status,
                        amount: f(total),
                        client_name: inv.clientName,
                        gst_percent: inv.gstPercent,
                        client_address: inv.clientAddress,
                        date: inv.date,
                        project_name: inv.projectName
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    toast.success(result.message || 'Invoice processed!', { id: loadingToast, duration: 4000 });
                } else {
                    toast.error(result.error || 'Failed to send email notification.', { id: loadingToast });
                }
            } catch (error) {
                console.error('Email error:', error);
                toast.error('Error connecting to email service.', { id: loadingToast });
            }
        } else {
            toast.success(`Invoice ${inv.invoiceNo} saved!`);
        }

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
            {mounted && createPortal(
                <AnimatePresence>
                    {showFormModal && (
                        <div className="modal-overlay" style={{ zIndex: 999999 }}>
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                className="berry-modal-container"
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
                                        {/* Left Column */}
                                        <div style={{ padding: '24px', background: '#fff' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                                <div style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #f0f9ff 100%)', padding: 16, borderRadius: 16, border: '1px solid rgba(94, 53, 177, 0.1)' }}>
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

                                                <div className="berry-form-grid-2">
                                                    <div className="field-group">
                                                        <label className="input-label">Invoice Number</label>
                                                        <input className="berry-input" value={inv.invoiceNo} onChange={e => setInv(p => ({ ...p, invoiceNo: e.target.value }))} />
                                                    </div>
                                                    <div className="field-group">
                                                        <label className="input-label">Status</label>
                                                        <select className="berry-input" value={inv.status} onChange={e => setInv(p => ({ ...p, status: e.target.value as any }))}>
                                                            <option>Draft</option><option>Sent</option><option>Paid</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="berry-form-grid-2">
                                                    <div className="field-group">
                                                        <label className="input-label">Client Name *</label>
                                                        <input className="berry-input" value={inv.clientName} onChange={e => setInv(p => ({ ...p, clientName: e.target.value }))} />
                                                    </div>
                                                    <div className="field-group">
                                                        <label className="input-label">Email Address</label>
                                                        <input className="berry-input" value={inv.clientEmail} onChange={e => setInv(p => ({ ...p, clientEmail: e.target.value }))} />
                                                    </div>
                                                </div>

                                                <div className="field-group">
                                                    <label className="input-label">Project Name *</label>
                                                    <input className="berry-input" value={inv.projectName} onChange={e => setInv(p => ({ ...p, projectName: e.target.value }))} />
                                                </div>

                                                <div className="berry-form-grid-3">
                                                    <div className="field-group">
                                                        <label className="input-label">Amount (₹) *</label>
                                                        <input type="number" className="berry-input" value={inv.amount} onChange={e => setInv(p => ({ ...p, amount: Number(e.target.value) }))} />
                                                    </div>
                                                    <div className="field-group">
                                                        <label className="input-label">Discount (%)</label>
                                                        <input type="number" className="berry-input" value={inv.discount} onChange={e => setInv(p => ({ ...p, discount: Number(e.target.value) }))} />
                                                    </div>
                                                    <div className="field-group">
                                                        <label className="input-label">GST (%)</label>
                                                        <input type="number" className="berry-input" value={inv.gstPercent} onChange={e => setInv(p => ({ ...p, gstPercent: Number(e.target.value) }))} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Summary */}
                                        <div className="berry-modal-sidebar" style={{ background: '#f8fafc', padding: '24px', borderLeft: '1px solid #e2e8f0' }}>
                                            <div style={{ padding: '16px', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                                                <h4 style={{ margin: '0 0 16px', color: '#1e293b' }}>Summary</h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>Subtotal</span>
                                                        <span>{f(subtotal)}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                                                        <span>Discount</span>
                                                        <span>-{f(discountAmt)}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>GST</span>
                                                        <span>{f(gstAmt)}</span>
                                                    </div>
                                                    <div style={{ height: 1, background: '#e2e8f0', margin: '8px 0' }} />
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', color: '#5e35b1' }}>
                                                        <span>Total</span>
                                                        <span>{f(total)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                <button className="berry-btn-primary" onClick={handleSave} style={{ width: '100%', height: 48, justifyContent: 'center' }}>
                                                    <FiSave /> Save & Create
                                                </button>
                                                <button className="berry-btn-outline" onClick={() => setShowFormModal(false)} style={{ width: '100%', height: 48, justifyContent: 'center' }}>
                                                    Discard
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ width: '100%' }}
            >
                {!preview ? (
                    <div className="berry-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 className="berry-title"><FiList /> Invoice Management</h2>
                            <button className="berry-btn-primary" onClick={() => { setInv(getBlankInvoice()); setShowFormModal(true); }}>
                                <FiPlus /> Create New Invoice
                            </button>
                        </div>

                        <div className="berry-table-container">
                            <table className="berry-table">
                                <thead>
                                    <tr>
                                        <th>Invoice #</th>
                                        <th>Date</th>
                                        <th>Client</th>
                                        <th>Project</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceHistory.length === 0 ? (
                                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>No invoices generated yet.</td></tr>
                                    ) : (
                                        invoiceHistory.map(i => (
                                            <tr key={i.id}>
                                                <td style={{ fontWeight: 700 }}>{i.invoiceNo}</td>
                                                <td>{new Date(i.date).toLocaleDateString('en-IN')}</td>
                                                <td>{i.clientName}</td>
                                                <td>{i.projectName}</td>
                                                <td>{f(i.amount * (1 - i.discount / 100) * (1 + i.gstPercent / 100))}</td>
                                                <td><span className={`berry-badge ${i.status === 'Paid' ? 'success' : 'info'}`}>{i.status}</span></td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                        <button className="berry-btn-outline" onClick={() => openPreview(i)}><FiEye /></button>
                                                        <button className="berry-btn-outline" onClick={() => setDeleteId(i.id)} style={{ color: '#ef4444' }}><FiTrash2 /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="berry-animate-in">
                        <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button className="berry-btn-outline" onClick={() => { setPreview(false); setPreviewInvoice(null); }}><FiX /> Close</button>
                                <button className="berry-btn-primary" onClick={handlePrint}><FiPrinter /> Print</button>
                            </div>
                            {previewInvoice && <span style={{ fontWeight: 700, color: '#5e35b1' }}>#{previewInvoice.invoiceNo}</span>}
                        </div>
                        <div ref={printRef} className="invoice-preview" style={{ background: 'white', padding: '40px', borderRadius: 0, border: '1px solid #e2e8f0', maxWidth: '1000px', margin: '0 auto', color: '#000', fontFamily: 'Inter, sans-serif' }}>
                            {previewInvoice && (
                                <>
                                    <div style={{ textAlign: 'center', marginBottom: 30 }}>
                                        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Tax Invoice</h1>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 30, fontSize: '0.85rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, marginBottom: 4 }}>Sold By: AlgorySoft Private Limited</div>
                                            <div>Ship-from Address: Gadag, Karnataka, India - 582101</div>
                                            <div style={{ marginTop: 8 }}><strong>GSTIN:</strong> 29AAECB1611P1ZJ</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ border: '1px dashed #000', padding: '10px 20px', display: 'inline-block' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>Invoice Number #</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{previewInvoice.invoiceNo}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 30, padding: '20px', background: '#fcfcfc', border: '1px solid #f1f1f1', fontSize: '0.88rem' }}>
                                        <div>
                                            <div style={{ color: '#666', marginBottom: 4 }}>Order Details</div>
                                            <div><strong>Order ID:</strong> ORD-{previewInvoice.invoiceNo.split('-')[-1]}</div>
                                            <div><strong>Order Date:</strong> {new Date(previewInvoice.date).toLocaleDateString()}</div>
                                            <div><strong>Invoice Date:</strong> {new Date(previewInvoice.date).toLocaleDateString()}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#666', marginBottom: 4 }}>Bill To</div>
                                            <div style={{ fontWeight: 800 }}>{previewInvoice.clientName}</div>
                                            <div style={{ color: '#475569' }}>{previewInvoice.clientEmail}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#666', marginBottom: 4 }}>Ship To</div>
                                            <div style={{ fontWeight: 800 }}>{previewInvoice.clientName}</div>
                                            <div style={{ color: '#475569' }}>{previewInvoice.clientEmail}</div>
                                        </div>
                                    </div>

                                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '0.82rem' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #000', background: '#f8f8f8' }}>
                                                <th style={{ padding: 10, textAlign: 'left', borderRight: '1px solid #000' }}>Product</th>
                                                <th style={{ padding: 10, textAlign: 'center', borderRight: '1px solid #000' }}>Qty</th>
                                                <th style={{ padding: 10, textAlign: 'right', borderRight: '1px solid #000' }}>Gross Amt</th>
                                                <th style={{ padding: 10, textAlign: 'right', borderRight: '1px solid #000' }}>Taxable Val</th>
                                                <th style={{ padding: 10, textAlign: 'right', borderRight: '1px solid #000' }}>GST ({previewInvoice.gstPercent}%)</th>
                                                <th style={{ padding: 10, textAlign: 'right' }}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid #000' }}>
                                                <td style={{ padding: 12, borderRight: '1px solid #000' }}>
                                                    <div style={{ fontWeight: 800 }}>{previewInvoice.projectName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#555', marginTop: 4 }}>{previewInvoice.description}</div>
                                                    <div style={{ fontSize: '0.7rem', marginTop: 8 }}>HSN/SAC: 998311</div>
                                                </td>
                                                <td style={{ padding: 12, textAlign: 'center', borderRight: '1px solid #000' }}>1</td>
                                                <td style={{ padding: 12, textAlign: 'right', borderRight: '1px solid #000' }}>{f(previewInvoice.amount)}</td>
                                                <td style={{ padding: 12, textAlign: 'right', borderRight: '1px solid #000' }}>{f(previewInvoice.amount * (1 - previewInvoice.discount / 100))}</td>
                                                <td style={{ padding: 12, textAlign: 'right', borderRight: '1px solid #000' }}>{f((previewInvoice.amount * (1 - previewInvoice.discount / 100)) * (previewInvoice.gstPercent / 100))}</td>
                                                <td style={{ padding: 12, textAlign: 'right', fontWeight: 800 }}>{f(previewInvoice.amount * (1 - previewInvoice.discount / 100) * (1 + previewInvoice.gstPercent / 100))}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3} style={{ padding: 12, textAlign: 'right', fontWeight: 800, borderRight: '1px solid #000' }}>Total</td>
                                                <td style={{ padding: 12, textAlign: 'right', borderRight: '1px solid #000' }}>{f(previewInvoice.amount * (1 - previewInvoice.discount / 100))}</td>
                                                <td style={{ padding: 12, textAlign: 'right', borderRight: '1px solid #000' }}>{f((previewInvoice.amount * (1 - previewInvoice.discount / 100)) * (previewInvoice.gstPercent / 100))}</td>
                                                <td style={{ padding: 12, textAlign: 'right', fontWeight: 900 }}>{f(previewInvoice.amount * (1 - previewInvoice.discount / 100) * (1 + previewInvoice.gstPercent / 100))}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.2rem', marginBottom: 10 }}>Grand Total: <span style={{ fontWeight: 900, fontSize: '1.6rem' }}>{f(previewInvoice.amount * (1 - previewInvoice.discount / 100) * (1 + previewInvoice.gstPercent / 100))}</span></div>
                                            <div style={{ marginTop: 20 }}>
                                                <div style={{ fontSize: '0.8rem', color: '#666' }}>For AlgorySoft Private Limited</div>
                                                <div style={{ height: 60, margin: '10px 0' }}>
                                                    <img src="/logo.jpeg" alt="Authorized Signatory" style={{ height: 40, opacity: 0.5 }} />
                                                </div>
                                                <div style={{ fontSize: '0.85rem', fontWeight: 700, borderTop: '1px solid #000', display: 'inline-block', paddingTop: 4 }}>Authorized Signatory</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 60, fontSize: '0.75rem', lineHeight: 1.6, color: '#444', borderTop: '1px solid #eee', paddingTop: 20 }}>
                                        <div><strong>Returns Policy:</strong> At AlgorySoft we try to deliver perfectly each and every time. But in the off-chance that you need to discuss the deliverables, please do so within 14 days of invoice.</div>
                                        <div style={{ marginTop: 10 }}>The services sold are intended for business consumption and not for re-sale.</div>
                                        <div style={{ marginTop: 4 }}>Regd. office: AlgorySoft Private Limited, Gadag, Karnataka, India - 582101</div>
                                        <div style={{ marginTop: 10, fontWeight: 700 }}>Contact AlgorySoft: algorysoft@gmail.com || www.algorysoft.in</div>
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
                    .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); display: flex; justify-content: center; align-items: center; z-index: 10000; padding: 24px; overflow-y: auto; }
                    .berry-modal-container { background: #fff; borderRadius: 24px; width: 100%; maxWidth: 900px; maxHeight: 90vh; overflow: hidden; display: flex; flexDirection: column; }
                    .input-label { display: block; font-size: 0.8rem; font-weight: 700; color: #475569; margin-bottom: 4px; }
                    @media (max-width: 768px) {
                        .berry-modal-container { maxHeight: 100vh; borderRadius: 0; }
                        .berry-responsive-grid { gridTemplateColumns: 1fr !important; }
                    }
                `}</style>

                <div id="print-section" style={{ display: 'none' }}><div ref={printRef} /></div>
            </motion.div>
        </>
    );
}
