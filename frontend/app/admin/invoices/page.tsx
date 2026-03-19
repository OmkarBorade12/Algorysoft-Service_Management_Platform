'use client';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { addInvoice, InvoiceData } from '@/store/slices/invoicesSlice';
import { FiZap, FiFileText, FiUser, FiBox, FiEye, FiSave, FiList, FiPrinter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';


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
        setPreview(true);
        setTimeout(() => {
            window.print();
        }, 300);
    };

    const handleSave = () => {
        dispatch(addInvoice({ ...inv, id: Date.now().toString(), createdAt: new Date().toISOString() }));
        toast.success(`Invoice ${inv.invoiceNo} saved & sent to Client Dashboard!`);
        setInv(getBlankInvoice());
    };

    const f = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

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
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.4 }}
            style={{ width: '100%', maxWidth: '100%' }}
        >
            {!preview ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
                    {/* Form Section */}
                    <div>
                        <div className="berry-card" style={{ marginBottom: 16 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}><FiZap /> Autofill from Existing Order</label>
                            <select className="berry-input" onChange={e => handleAutofill(e.target.value)} defaultValue="">
                                <option value="" disabled>Select an Active Order...</option>
                                {orders.map(o => (
                                    <option key={o.id} value={o.id}>{o.order_id || `#${o.id}`} - {o.client_name} ({o.product})</option>
                                ))}
                            </select>
                        </div>
                        <div className="berry-card">
                            <h3 className="berry-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiFileText /> Invoice Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Invoice Number</label>
                                    <input className="berry-input" value={inv.invoiceNo} onChange={e => setInv(p => ({ ...p, invoiceNo: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Status</label>
                                    <select className="berry-input" value={inv.status} onChange={e => setInv(p => ({ ...p, status: e.target.value as InvoiceData['status'] }))}>
                                        <option>Draft</option><option>Sent</option><option>Paid</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Invoice Date</label>
                                    <input type="date" className="berry-input" value={inv.date} onChange={e => setInv(p => ({ ...p, date: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Due Date</label>
                                    <input type="date" className="berry-input" value={inv.dueDate} onChange={e => setInv(p => ({ ...p, dueDate: e.target.value }))} />
                                </div>
                            </div>
                        </div>

                        <div className="berry-card">
                            <h3 className="berry-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiUser /> Client Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Client Name *</label>
                                    <input className="berry-input" value={inv.clientName} onChange={e => setInv(p => ({ ...p, clientName: e.target.value }))} placeholder="Rajesh Kumar" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Email</label>
                                    <input type="email" className="berry-input" value={inv.clientEmail} onChange={e => setInv(p => ({ ...p, clientEmail: e.target.value }))} placeholder="client@example.com" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Phone</label>
                                    <input className="berry-input" value={inv.clientPhone} onChange={e => setInv(p => ({ ...p, clientPhone: e.target.value }))} placeholder="+91 9999999999" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Address</label>
                                    <input className="berry-input" value={inv.clientAddress} onChange={e => setInv(p => ({ ...p, clientAddress: e.target.value }))} placeholder="City, State" />
                                </div>
                            </div>
                        </div>

                        <div className="berry-card">
                            <h3 className="berry-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiBox /> Project Details</h3>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Project Name *</label>
                                <input className="berry-input" value={inv.projectName} onChange={e => setInv(p => ({ ...p, projectName: e.target.value }))} placeholder="Premium E-Commerce Store" />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Description</label>
                                <textarea className="berry-input" rows={3} value={inv.description} onChange={e => setInv(p => ({ ...p, description: e.target.value }))} placeholder="Full-stack e-commerce with payment gateway, admin panel..." style={{ resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Amount (₹) *</label>
                                    <input type="number" className="berry-input" value={inv.amount || ''} onChange={e => setInv(p => ({ ...p, amount: +e.target.value }))} placeholder="24999" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Discount (%)</label>
                                    <input type="number" className="berry-input" value={inv.discount || ''} onChange={e => setInv(p => ({ ...p, discount: +e.target.value }))} placeholder="0" min={0} max={100} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>GST (%)</label>
                                    <input type="number" className="berry-input" value={inv.gstPercent} onChange={e => setInv(p => ({ ...p, gstPercent: +e.target.value }))} min={0} max={28} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Notes</label>
                                <textarea className="berry-input" rows={2} value={inv.notes} onChange={e => setInv(p => ({ ...p, notes: e.target.value }))} style={{ resize: 'vertical' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 16 }}>
                            <button className="berry-btn-outline" onClick={() => setPreview(true)} style={{ flex: 1, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><FiEye /> Preview Invoice</button>
                            <button className="berry-btn-primary" onClick={handleSave} style={{ flex: 1, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><FiSave /> Save Invoice</button>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div>
                        <div className="berry-card" style={{ position: 'sticky', top: 24 }}>
                            <h3 className="berry-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiList /> Summary</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid #e3e8ef', paddingBottom: 16, marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#364152' }}>
                                    <span>Subtotal</span>
                                    <span style={{ fontWeight: 600 }}>{f(subtotal)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#c2185b' }}>
                                    <span>Discount ({inv.discount}%)</span>
                                    <span style={{ fontWeight: 600 }}>-{f(discountAmt)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#1565c0' }}>
                                    <span>GST ({inv.gstPercent}%)</span>
                                    <span style={{ fontWeight: 600 }}>{f(gstAmt)}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: '#5e35b1' }}>
                                <span>Total</span>
                                <span>{f(total)}</span>
                            </div>

                            <div style={{ marginTop: 32, padding: 16, background: '#f8fafc', borderRadius: 8, fontSize: '0.85rem', color: '#697586', border: '1px solid #e3e8ef' }}>
                                <div style={{ fontWeight: 600, color: '#121926', marginBottom: 4 }}>From: AlgorySoft</div>
                                <div>algorysoft@gmail.com</div>
                                <div>+91 78995 33525</div>
                                <div>Bangalore, Karnataka</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Print Preview Mode */
                <div>
                    <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
                        <button className="berry-btn-outline" onClick={() => setPreview(false)}>← Back to Edit</button>
                        <button className="berry-btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiPrinter /> Print / Download PDF</button>
                    </div>

                    <div ref={printRef} style={{ background: 'white', padding: 48, borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', maxWidth: 800, margin: '0 auto', color: '#121926' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #5e35b1', paddingBottom: 24, marginBottom: 32 }}>
                             <div>
                                 <div style={{ fontSize: '2rem', fontWeight: 800, color: '#5e35b1', letterSpacing: '-0.5px' }}>AlgorySoft</div>
                                 <div style={{ color: '#697586', fontSize: '0.9rem', marginTop: 8 }}>algorysoft@gmail.com</div>
                                 <div style={{ color: '#697586', fontSize: '0.9rem' }}>+91 78995 33525</div>
                                 <div style={{ color: '#697586', fontSize: '0.9rem' }}>Bangalore, Karnataka, India</div>
                             </div>
                             <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ede7f6', letterSpacing: '2px', textTransform: 'uppercase' }}>INVOICE</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: -12 }}>#{inv.invoiceNo}</div>
                                <div style={{ display: 'inline-block', background: inv.status === 'Paid' ? '#b9f6ca' : inv.status === 'Sent' ? '#e3f2fd' : '#fff9c4', color: inv.status === 'Paid' ? '#00c853' : inv.status === 'Sent' ? '#1565c0' : '#f57f17', padding: '4px 12px', borderRadius: 99, fontSize: '0.8rem', fontWeight: 600, marginTop: 8 }}>{inv.status}</div>
                             </div>
                         </div>

                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
                             <div>
                                 <div style={{ fontSize: '0.8rem', color: '#697586', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8, letterSpacing: '1px' }}>Bill To</div>
                                 <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{inv.clientName || '—'}</div>
                                 <div style={{ fontSize: '0.9rem', color: '#364152', marginTop: 4 }}>{inv.clientEmail}</div>
                                 <div style={{ fontSize: '0.9rem', color: '#364152' }}>{inv.clientPhone}</div>
                                 <div style={{ fontSize: '0.9rem', color: '#364152' }}>{inv.clientAddress}</div>
                             </div>
                             <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.8rem', color: '#697586', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8, letterSpacing: '1px' }}>Date Info</div>
                                <div style={{ fontSize: '0.95rem', marginBottom: 4 }}><strong>Date:</strong> {new Date(inv.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</div>
                                <div style={{ fontSize: '0.95rem' }}><strong>Due:</strong> <span style={{ color: '#c2185b', fontWeight: 600 }}>{new Date(inv.dueDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span></div>
                             </div>
                         </div>

                         <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 40 }}>
                             <thead>
                                 <tr style={{ borderBottom: '2px solid #e3e8ef' }}>
                                     <th style={{ padding: '12px 0', textAlign: 'left', color: '#697586', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Item Description</th>
                                     <th style={{ padding: '12px 0', textAlign: 'center', color: '#697586', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Qty</th>
                                     <th style={{ padding: '12px 0', textAlign: 'right', color: '#697586', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Rate</th>
                                     <th style={{ padding: '12px 0', textAlign: 'right', color: '#697586', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Amount</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 <tr style={{ borderBottom: '1px solid #e3e8ef' }}>
                                     <td style={{ padding: '20px 0' }}>
                                         <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{inv.projectName || 'Web Development Service'}</div>
                                         <div style={{ fontSize: '0.85rem', color: '#697586', marginTop: 4 }}>{inv.description}</div>
                                     </td>
                                     <td style={{ padding: '20px 0', textAlign: 'center' }}>1</td>
                                     <td style={{ padding: '20px 0', textAlign: 'right' }}>{f(inv.amount)}</td>
                                     <td style={{ padding: '20px 0', textAlign: 'right', fontWeight: 600 }}>{f(inv.amount)}</td>
                                 </tr>
                             </tbody>
                         </table>

                         <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 40 }}>
                             <div style={{ width: '300px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #e3e8ef', marginBottom: 12, fontSize: '0.95rem' }}>
                                    <span style={{ color: '#697586' }}>Subtotal</span>
                                    <span>{f(subtotal)}</span>
                                </div>
                                {inv.discount > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #e3e8ef', marginBottom: 12, fontSize: '0.95rem' }}>
                                        <span style={{ color: '#697586' }}>Discount ({inv.discount}%)</span>
                                        <span style={{ color: '#c2185b' }}>-{f(discountAmt)}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #e3e8ef', marginBottom: 12, fontSize: '0.95rem' }}>
                                    <span style={{ color: '#697586' }}>GST ({inv.gstPercent}%)</span>
                                    <span>{f(gstAmt)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 800, color: '#5e35b1', marginTop: 8 }}>
                                    <span>Total</span>
                                    <span>{f(total)}</span>
                                </div>
                             </div>
                         </div>

                         {inv.notes && (
                            <div style={{ padding: 20, background: '#f8fafc', borderRadius: 8, fontSize: '0.9rem', color: '#364152', borderLeft: '4px solid #5e35b1' }}>
                                <strong>Notes: </strong>{inv.notes}
                            </div>
                         )}

                         <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #e3e8ef', textAlign: 'center', fontSize: '0.8rem', color: '#a0aec0' }}>
                            AlgorySoft • Bangalore, Karnataka, India • algorysoft@gmail.com
                            <br />Thank you for your business!
                         </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
