'use client';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { clearCart } from '@/store/slices/cartSlice';
import { addOrderThunk } from '@/store/slices/ordersSlice';
import { useRazorpay } from '@/hooks/useRazorpay';
import { formatPrice } from '@/store/slices/currencySlice';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    FiShoppingCart, FiArrowRight, FiShield, FiCheck, FiRefreshCw,
    FiUser, FiPhone, FiMail, FiMapPin, FiLock, FiCreditCard,
    FiSmartphone, FiRepeat, FiMessageCircle,
} from 'react-icons/fi';
import { HiOutlineShoppingBag, HiOutlineBuildingLibrary } from 'react-icons/hi2';
import { MdOutlineVerified } from 'react-icons/md';

// ─── Trust Badge ────────────────────────────────────────────────
function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 10px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', flex: 1, minWidth: 0 }}>
            <span style={{ color: '#6db03a', display: 'flex' }}>{icon}</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#475569', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
        </div>
    );
}

// ─── Step Badge ─────────────────────────────────────────────────
function StepBadge({ num }: { num: number }) {
    return (
        <span style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'var(--gradient-accent)',
            color: 'white', fontWeight: 800, fontSize: '0.92rem',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
        }}>{num}</span>
    );
}

// ─── Validation helpers ─────────────────────────────────────────
const validators = {
    name: (v: string) => v.trim().length >= 2,
    email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    phone: (v: string) => /^[6-9]\d{9}$/.test(v.replace(/\s/g, '')),
    address: (v: string) => v.trim().length >= 5,
    pincode: (v: string) => /^\d{6}$/.test(v),
};

function InputField({
    label, type = 'text', placeholder, value, onChange, validate, icon,
}: {
    label: string; type?: string; placeholder?: string; value: string;
    onChange: (v: string) => void; validate?: (v: string) => boolean; icon?: React.ReactNode;
}) {
    const [touched, setTouched] = useState(false);
    const isValid = validate ? validate(value) : true;
    const showError = touched && value && !isValid;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>{label}</label>
            <div style={{ position: 'relative' }}>
                {icon && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', color: '#94a3b8' }}>{icon}</span>}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={() => setTouched(true)}
                    style={{
                        width: '100%', padding: icon ? '12px 14px 12px 40px' : '12px 16px',
                        borderRadius: 12, border: `1.5px solid ${showError ? '#ef4444' : touched && value && isValid ? '#10b981' : '#e2e8f0'}`,
                        background: 'white', fontSize: '0.92rem', color: '#0f172a',
                        outline: 'none', transition: 'all 0.2s', fontFamily: "'IBM Plex Sans', sans-serif",
                    }}
                    onFocus={e => { e.target.style.borderColor = 'var(--pista-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(109,176,58,0.12)'; }}
                />
                {touched && value && (
                    <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                        {isValid
                            ? <FiCheck size={16} style={{ color: '#10b981' }} />
                            : <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiCheck size={10} style={{ color: 'white', transform: 'rotate(45deg)' }} /></span>
                        }
                    </span>
                )}
            </div>
            {showError && <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 500 }}>Please enter a valid {label.toLowerCase()}</span>}
        </div>
    );
}

// ─── Success Overlay ────────────────────────────────────────────
function SuccessOverlay({ paymentId, amount }: { paymentId: string; amount: number }) {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-fadeInUp" style={{ background: 'white', borderRadius: 32, padding: '56px 48px', textAlign: 'center', maxWidth: 460, width: '90%', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>
                <div style={{ width: 100, height: 100, background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 20px 40px rgba(34,197,94,0.4)', animation: 'float 3s ease-in-out infinite' }}>
                    <MdOutlineVerified size={52} color="white" />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>Payment Successful!</h2>
                <p style={{ color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>Your transaction has been verified and secured.</p>
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 12, padding: '16px 20px', marginBottom: 28, fontSize: '0.82rem', color: '#166534', fontFamily: 'monospace', fontWeight: 600 }}>
                    TXN ID: {paymentId}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#10b981', fontSize: '0.88rem', fontWeight: 700 }}>
                    <FiLock size={14} /> ₹{amount.toLocaleString('en-IN')} • 256-bit Secured • Redirecting...
                </div>
            </div>
        </div>
    );
}

// ─── Processing Overlay ──────────────────────────────────────────
function ProcessingOverlay({ stage }: { stage: string }) {
    const stages = [
        { key: 'creating', label: 'Creating Secure Order', icon: <FiShield size={20} /> },
        { key: 'opening', label: 'Launching Payment Gateway', icon: <HiOutlineBuildingLibrary size={20} /> },
    ];
    const current = stages.find(s => s.key === stage);

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-fadeIn" style={{ background: 'white', borderRadius: 28, padding: '48px 40px', textAlign: 'center', maxWidth: 400, width: '90%', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid #e2e8f0', borderTopColor: '#6db03a', animation: 'spin 0.8s linear infinite', margin: '0 auto 32px' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ color: '#6db03a' }}>{current?.icon}</span> {current?.label || 'Processing...'}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Please wait, establishing secure connection...</p>
                <div style={{ marginTop: 24, fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <FiLock size={10} /> TLS 1.3 • 256-bit AES • Razorpay PCI-DSS
                </div>
            </div>
        </div>
    );
}

// ─── Main Checkout Page ─────────────────────────────────────────
export default function CheckoutPage() {
    const { items, totalPrice } = useAppSelector(s => s.cart);
    const { user } = useAppSelector(s => s.auth);
    const { currency, usdRate } = useAppSelector(s => s.currency);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { initiatePayment } = useRazorpay();

    const [processingStage, setProcessingStage] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<{ paymentId: string; amount: number } | null>(null);
    const [form, setForm] = useState({
        name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
    });

    useEffect(() => {
        if (user) {
            setForm(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
        }
    }, [user]);

    const setField = (key: keyof typeof form) => (val: string) =>
        setForm(prev => ({ ...prev, [key]: val }));

    const validateForm = () => {
        if (!validators.name(form.name)) { toast.error('Please enter your full name'); return false; }
        if (!validators.email(form.email)) { toast.error('Please enter a valid email address'); return false; }
        if (!validators.phone(form.phone)) { toast.error('Enter a valid 10-digit Indian mobile number'); return false; }
        if (!validators.address(form.address)) { toast.error('Please enter a valid address'); return false; }
        if (!form.city.trim()) { toast.error('Please enter your city'); return false; }
        if (!form.state.trim()) { toast.error('Please enter your state'); return false; }
        if (!validators.pincode(form.pincode)) { toast.error('Please enter a valid 6-digit pincode'); return false; }
        return true;
    };

    const handlePayment = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (items.length === 0) return toast.error('Your cart is empty');
        if (!validateForm()) return;

        setProcessingStage('creating');

        // ── STEP 1: Create Orders as 'Pending' in Backend FIRST ──
        const dbOrderIds: number[] = [];
        for (const item of items) {
            try {
                const pendingOrder = await dispatch(addOrderThunk({
                    order_id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
                    client_name: form.name,
                    client_email: form.email,
                    product: item.title,
                    tier: (item as any).tier || 'Base Product',
                    amount: item.price,
                    status: 'Pending',
                    progress: 0,
                    chat: [{
                        sender: 'admin',
                        text: `Order created. Awaiting payment...`,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    }],
                })).unwrap();
                dbOrderIds.push(pendingOrder.id as number);
            } catch (err) {
                console.error('Initial order creation failed:', err);
            }
        }

        if (dbOrderIds.length === 0) {
            setProcessingStage(null);
            return toast.error('Failed to initialize order. Please try again.');
        }

        await initiatePayment({
            amount: totalPrice,
            currency: 'INR',
            name: form.name,
            email: form.email,
            phone: form.phone,
            description: `AlgorySoft — ${items.map(i => i.title).join(', ')}`,
            dbOrderIds,
            onSuccess: async (paymentId, orderId, signature) => {
                setProcessingStage(null);
                setSuccessData({ paymentId, amount: totalPrice });
                toast.success('🎉︎︎ Payment verified! Order confirmed.', { duration: 5000, style: { background: '#22c55e', color: 'white', fontWeight: 700 } });
                dispatch(clearCart());

                // Redirect after showing the success screen
                setTimeout(() => router.push('/order-success'), 3500);
            },
            onFailure: (error) => {
                setProcessingStage(null);
                if (error !== 'Payment cancelled by user') {
                    toast.error(error, { duration: 6000 });
                }
            },
        });

        setProcessingStage(null);
    };

    // ── Empty cart ──────────────────────────────────────────────
    if (items.length === 0 && !successData) {
        return (
            <div className="container" style={{ padding: '120px 24px', textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                <div style={{ width: 96, height: 96, background: 'var(--pista-xlight)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'float 3s ease-in-out infinite' }}>
                    <FiShoppingCart size={48} style={{ color: 'var(--pista-primary)' }} />
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Your Cart is Empty</h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: 360 }}>Add some amazing software projects to your cart before checking out.</p>
                <Link href="/projects" className="btn-primary" style={{ marginTop: 8, fontSize: '1rem', padding: '14px 32px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <HiOutlineShoppingBag size={18} /> Browse Projects
                </Link>
            </div>
        );
    }

    const gstAmount = Math.round(totalPrice * 0);
    const grandTotal = totalPrice + gstAmount;

    return (
        <>
            {/* Processing overlay */}
            {processingStage && <ProcessingOverlay stage={processingStage} />}

            {/* Success overlay */}
            {successData && <SuccessOverlay paymentId={successData.paymentId} amount={successData.amount} />}

            <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', padding: '48px 0 80px' }}>
                <div className="container">

                    {/* Hero heading */}
                    <div style={{ marginBottom: 40, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{ width: 50, height: 50, background: 'var(--gradient-accent)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(109,176,58,0.3)', flexShrink: 0 }}>
                            <FiLock size={22} color="white" />
                        </div>
                        <div style={{ minWidth: 250 }}>
                            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Secure Checkout</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Powered by Razorpay · PCI-DSS Compliant · SSL Encrypted</p>
                        </div>
                    </div>

                    <div className="checkout-grid">

                        {/* ─── LEFT: Forms ─── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                            {/* Billing Details */}
                            <div style={{ background: 'white', borderRadius: 24, border: '1.5px solid var(--border-solid)', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)' }}>
                                    <StepBadge num={1} /> Billing Details
                                </h2>
                                <div className="checkout-form-grid">
                                    <InputField label="Full Name *" placeholder="John Doe" value={form.name} onChange={setField('name')} validate={validators.name} icon={<FiUser size={15} />} />
                                    <InputField label="Phone Number *" placeholder="9876543210" value={form.phone} onChange={setField('phone')} validate={validators.phone} icon={<FiPhone size={15} />} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <InputField label="Email Address *" type="email" placeholder="you@example.com" value={form.email} onChange={setField('email')} validate={validators.email} icon={<FiMail size={15} />} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <InputField label="Full Address *" placeholder="Flat 201, MG Road, Bengaluru" value={form.address} onChange={setField('address')} validate={validators.address} icon={<FiMapPin size={15} />} />
                                </div>
                                <div className="responsive-3-col">
                                    <InputField label="City *" placeholder="Bengaluru" value={form.city} onChange={setField('city')} />
                                    <InputField label="State *" placeholder="Karnataka" value={form.state} onChange={setField('state')} />
                                    <InputField label="Pincode *" placeholder="560001" value={form.pincode} onChange={setField('pincode')} validate={validators.pincode} />
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div style={{ background: 'white', borderRadius: 24, border: '1.5px solid var(--border-solid)', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
                                {/* Green gradient top bar */}
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #6db03a, #3b82f6, #8b5cf6)' }} />

                                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)' }}>
                                    <StepBadge num={2} /> Secure Payment
                                </h2>
                                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: 28 }}>
                                    Powered by <strong>Razorpay</strong>. Supports all UPI apps, Net Banking, Cards & Wallets.
                                </p>

                                {/* Payment methods row */}
                                <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
                                    {[
                                        { icon: <FiSmartphone size={14} />, label: 'UPI' },
                                        { icon: <FiCreditCard size={14} />, label: 'Cards' },
                                        { icon: <HiOutlineBuildingLibrary size={14} />, label: 'Net Banking' },
                                        { icon: <HiOutlineShoppingBag size={14} />, label: 'Wallets' },
                                        { icon: <FiRepeat size={14} />, label: 'EMI' },
                                    ].map(m => (
                                        <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-solid)', borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                            <span style={{ display: 'flex', color: '#6db03a' }}>{m.icon}</span> {m.label}
                                        </div>
                                    ))}
                                </div>

                                {/* Razorpay brand banner */}
                                <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ width: 52, height: 52, background: '#2563eb', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <FiCreditCard size={24} color="white" />
                                    </div>
                                    <div>
                                        <div style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>Pay via Razorpay Checkout</div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: 3 }}>A secure, PCI-DSS certified payment popup will open — no card details stored on our servers.</div>
                                    </div>
                                </div>

                                {/* Trust indicators */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 10 }}>
                                    <TrustBadge icon={<FiLock size={20} />} label="256-bit SSL" />
                                    <TrustBadge icon={<MdOutlineVerified size={20} />} label="PCI Compliant" />
                                    <TrustBadge icon={<FiShield size={20} />} label="Secure Gateway" />
                                    <TrustBadge icon={<FiRefreshCw size={20} />} label="Instant Refund" />
                                </div>
                            </div>

                            {/* Pay Button */}
                            <button
                                onClick={handlePayment}
                                style={{
                                    width: '100%', minHeight: 66, fontSize: '1.2rem', fontWeight: 900,
                                    background: 'linear-gradient(135deg, #6db03a, #4caf50)',
                                    color: 'white', border: 'none', borderRadius: 20, cursor: 'pointer',
                                    boxShadow: '0 12px 32px rgba(109,176,58,0.4)',
                                    transition: 'all 0.25s ease',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                                    letterSpacing: '0.01em', padding: '16px'
                                }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 18px 40px rgba(109,176,58,0.5)'; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(109,176,58,0.4)'; }}
                            >
                                <FiLock size={20} />
                                <span style={{ textAlign: 'left' }}>Pay ₹{grandTotal.toLocaleString('en-IN')} via Razorpay</span>
                                <FiArrowRight size={20} />
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                By paying you agree to our <a href="/terms" style={{ color: 'var(--pista-primary)', fontWeight: 600 }}>Terms & Conditions</a>. Payments secured by Razorpay.
                            </p>
                        </div>

                        {/* ─── RIGHT: Order Summary ─── */}
                        <div style={{ position: 'sticky', top: 110 }}>
                            <div style={{ background: 'white', borderRadius: 24, border: '1.5px solid var(--border-solid)', padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-solid)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FiShoppingCart size={18} style={{ color: 'var(--pista-primary)' }} /> Order Summary
                                </h2>

                                {/* Items */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                                    {items.map(item => (
                                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                            <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 0 }}>
                                                <div style={{ width: 44, height: 44, background: 'var(--pista-xlight)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <HiOutlineShoppingBag size={20} style={{ color: 'var(--pista-primary)' }} />
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.35 }}>{item.title}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                        Qty: {item.quantity} {(item as any).tier ? `• ${(item as any).tier} Tier` : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div style={{ borderTop: '1px solid var(--border-solid)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                                        <span>Subtotal</span>
                                        <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                                        <span>Payment Gateway</span>
                                        <span style={{ color: '#22c55e', fontWeight: 700 }}>FREE</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                                        <span>GST (0%)</span>
                                        <span>₹0</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 900, color: 'var(--pista-primary)', marginTop: 8, paddingTop: 16, borderTop: '2px solid var(--pista-border)' }}>
                                        <span>Total</span>
                                        <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                {/* UPI Icons */}
                                <div style={{ marginTop: 24, padding: '16px', background: 'var(--bg-secondary)', borderRadius: 14, border: '1px solid var(--border-solid)' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Accepted Payment Methods</p>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'VISA', 'Mastercard'].map(brand => (
                                            <span key={brand} style={{ padding: '4px 10px', background: 'white', border: '1px solid var(--border-solid)', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                                {brand}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* WhatsApp help */}
                                <a
                                    href="https://wa.me/917899533525?text=Hi! I need help with my checkout."
                                    target="_blank" rel="noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, padding: '12px', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: 12, color: '#25D366', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}
                                >
                                    <FiMessageCircle size={16} /> Need help? Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

