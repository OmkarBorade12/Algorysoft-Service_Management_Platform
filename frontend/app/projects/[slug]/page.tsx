'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlistItem } from '@/store/slices/wishlistSlice';
import { addReview, type Review } from '@/store/slices/reviewSlice';
import { addRequestThunk } from '@/store/slices/requestsSlice';
import { formatPrice } from '@/store/slices/currencySlice';
import { Product } from '@/store/slices/productsSlice';
import { fetchFeatures } from '@/store/slices/featuresSlice';
import { fetchBasicCard } from '@/store/slices/pricingCardsSlice';
import toast from 'react-hot-toast';
import { FiSettings, FiCpu } from 'react-icons/fi';

// Simulated media gallery for each project
function getMediaItems(slug: string) {
    return [
        { type: 'image' as 'image' | 'video', src: `https://placehold.co/900x500/e5f6d4/3f6d20?text=${encodeURIComponent(slug + '+Screenshot+1')}`, caption: 'Homepage Design' },
        { type: 'image' as const, src: `https://placehold.co/900x500/edf7e2/548f2b?text=${encodeURIComponent(slug + '+Screenshot+2')}`, caption: 'Dashboard View' },
        { type: 'image' as const, src: `https://placehold.co/900x500/f4fbee/6db03a?text=${encodeURIComponent(slug + '+Mobile+View')}`, caption: 'Mobile Responsive' },
        { type: 'image' as const, src: `https://placehold.co/900x500/ccedaa/3f6d20?text=${encodeURIComponent(slug + '+Admin+Panel')}`, caption: 'Admin Panel' },
        { type: 'image' as const, src: `https://placehold.co/900x500/a8dc78/2d4f18?text=${encodeURIComponent(slug + '+Checkout')}`, caption: 'Checkout Flow' },
    ];
}

// Requirement Modal
function RequirementModal({ project, onClose }: { project: Product; onClose: () => void }) {
    const dispatch = useAppDispatch();
    const { currency, usdRate } = useAppSelector(s => s.currency);
    const { isAuthenticated, user } = useAppSelector(s => s.auth);
    const catalogFeatures = useAppSelector(s => s.features?.items || []);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', business: '', requirements: '', timeline: '2 weeks', budget: formatPrice(project.price, 'INR', 83.5) });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const featureText = selectedFeatures.length > 0 ? `\n\nSelected Add-on Features:\n- ${selectedFeatures.join('\n- ')}` : '';
        dispatch(addRequestThunk({
            client: form.name,
            email: form.email,
            phone: form.phone,
            business: form.business,
            requirements: `For Project: ${project.title}\n${form.requirements}${featureText}`,
            status: 'New',
            timeline: form.timeline,
            budget: form.budget
        }));
        setSubmitted(true);
        toast.success('🎉 Your requirements sent! We\'ll contact you within 2 hours.');
        setTimeout(onClose, 2000);
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-content animate-fadeInUp" style={{ maxWidth: 600 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>📋 Share Your Requirements</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>For: {project.title}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-solid)', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                </div>

                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
                        <h3>Requirements Submitted!</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Our team will reach out within 2 hours.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="requirement-form-grid">
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address *</label>
                                <input type="email" className="form-input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone / WhatsApp *</label>
                                <input className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 9999999999" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Business Name</label>
                                <input className="form-input" value={form.business} onChange={e => setForm(p => ({ ...p, business: e.target.value }))} placeholder="Your company" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Timeline</label>
                            <select className="form-input" value={form.timeline} onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))}>
                                <option>ASAP (Urgent)</option>
                                <option>1 week</option>
                                <option>2 weeks</option>
                                <option>1 month</option>
                                <option>Flexible</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Add Your Needed Features (Optional)</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: selectedFeatures.length > 0 ? 8 : 0 }}>
                                {selectedFeatures.map(f => (
                                    <span key={f} style={{ background: '#ede7f6', color: '#5e35b1', padding: '4px 8px', borderRadius: 6, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                                        {f}
                                        <button type="button" onClick={() => setSelectedFeatures(s => s.filter(x => x !== f))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5e35b1', fontSize: '1rem', lineHeight: 1, padding: 0 }}>×</button>
                                    </span>
                                ))}
                            </div>
                            <select 
                                className="form-input" 
                                value="" 
                                onChange={(e) => {
                                    if (e.target.value && !selectedFeatures.includes(e.target.value)) {
                                        setSelectedFeatures(s => [...s, e.target.value]);
                                    }
                                }}
                            >
                                <option value="" disabled>+ Pick a feature...</option>
                                {catalogFeatures.filter(f => !selectedFeatures.includes(f.name)).map(f => (
                                    <option key={f.id} value={f.name}>{f.name}</option> 
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Your Requirements *</label>
                            <textarea className="form-input" rows={4} value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} placeholder="Describe your business, features you need, specific pages, integrations, etc..." required style={{ resize: 'vertical' }} />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            🚀 Submit Requirements & Get Free Quote
                        </button>
                        <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            We respond within 2 hours • Mon–Sat 9:30 AM – 6:30 PM
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

// Review Form
function ReviewForm({ projectSlug }: { projectSlug: string }) {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(s => s.auth);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [text, setText] = useState('');
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !name.trim()) return;
        dispatch(addReview({
            id: Date.now(),
            projectSlug,
            userName: name,
            userEmail: email,
            rating,
            text,
            status: 'pending',
            createdAt: new Date().toISOString(),
        }));
        setSubmitted(true);
        toast.success('⭐ Review submitted! Pending admin approval.');
    };

    if (submitted) return (
        <div style={{ background: 'var(--bg-secondary)', padding: 24, borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>⭐</div>
            <p style={{ fontWeight: 600, marginTop: 8 }}>Thank you! Your review is pending approval.</p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>✍️ Write a Review</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                        style={{ fontSize: '1.6rem', background: 'none', border: 'none', cursor: 'pointer', color: star <= (hoverRating || rating) ? '#f59e0b' : '#d1d5db' }}>
                        ★
                    </button>
                ))}
                <span style={{ alignSelf: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>({['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]})</span>
            </div>
            <div className="requirement-form-grid" style={{ marginBottom: 12 }}>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name *" required />
                <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (private)" />
            </div>
            <textarea className="form-input" rows={3} value={text} onChange={e => setText(e.target.value)} placeholder="Share your experience with this solution..." required style={{ marginBottom: 12, resize: 'vertical' }} />
            <button type="submit" className="btn-primary">Submit Review</button>
        </form>
    );
}

// Review List
function ReviewList({ projectSlug }: { projectSlug: string }) {
    const { reviews } = useAppSelector(s => s.reviews);
    const projReviews = reviews.filter(r => r.projectSlug === projectSlug);

    if (!projReviews.length) return (
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No reviews yet. Be the first to review!</p>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {projReviews.map(r => (
                <div key={r.id} style={{ background: 'var(--bg-secondary)', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-solid)', position: 'relative' }}>
                    {r.status === 'pending' && <span style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.7rem', background: '#fff3e0', color: '#e65100', padding: '2px 8px', borderRadius: 9999, fontWeight: 600 }}>Pending Approval</span>}
                    {r.status === 'rejected' && <span style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.7rem', background: '#ffebee', color: '#c62828', padding: '2px 8px', borderRadius: 9999, fontWeight: 600 }}>Not Approved</span>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--pista-xlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--pista-dark)', fontSize: '1.1rem' }}>
                                {r.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.userName}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</div>
                            </div>
                        </div>
                        <div>{Array(r.rating).fill('★').join('')}<span style={{ color: '#d1d5db' }}>{Array(5 - r.rating).fill('★').join('')}</span></div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{r.text}</p>
                </div>
            ))}
        </div>
    );
}

export default function ProjectDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const dispatch = useAppDispatch();
    const { currency, usdRate } = useAppSelector(s => s.currency);
    const { items: wishlistItems } = useAppSelector(s => s.wishlist);
    const { items: projects } = useAppSelector(s => s.products);
    const { basicCard } = useAppSelector(s => (s as any).pricingCards);

    const project = projects.find(p => p.slug === slug);
    const [showRequirement, setShowRequirement] = useState(false);
    const [activeMedia, setActiveMedia] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedTier, setSelectedTier] = useState<'Basic' | 'Silver' | 'Gold'>('Silver');
    const [buyingNow, setBuyingNow] = useState(false);
    const galleryRef = useRef<HTMLDivElement>(null);
    const thumbnailsRef = useRef<HTMLDivElement>(null);

    const defaultMediaItems = getMediaItems(slug || '');
    const hasCustomImages = project?.images && project.images.length > 0;
    const mediaItems = hasCustomImages
        ? project.images!.map((src, i) => ({ type: 'image' as const, src, caption: `Product Image ${i + 1}` }))
        : defaultMediaItems;
    const isWishlisted = wishlistItems.some(i => i.id === project?.id);

    // Fetch essential data on mount
    useEffect(() => {
        dispatch(fetchFeatures());
        dispatch(fetchBasicCard() as any);
    }, [dispatch]);

    // Auto-scroll gallery every 3s
    useEffect(() => {
        if (!project) return;
        const timer = setInterval(() => {
            setActiveMedia(p => (p + 1) % mediaItems.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [mediaItems.length, project]);

    // Scroll thumbnail into view (Fix: Only scroll the container, not the window)
    useEffect(() => {
        const container = thumbnailsRef.current;
        const el = container?.children[activeMedia] as HTMLElement;
        if (container && el) {
            const scrollLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }, [activeMedia]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;
            if (e.key === 'Escape') setIsLightboxOpen(false);
            if (e.key === 'ArrowLeft') setActiveMedia(p => (p - 1 + mediaItems.length) % mediaItems.length);
            if (e.key === 'ArrowRight') setActiveMedia(p => (p + 1) % mediaItems.length);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, mediaItems.length]);

    if (!project) {
        return (
            <div style={{ padding: '100px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
                <h2>Project Not Found</h2>
                <Link href="/projects" className="btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>← Back to Projects</Link>
            </div>
        );
    }

    const discountedPrice = formatPrice(project.price, currency, usdRate);
    const originalPrice = formatPrice(project.originalPrice, currency, usdRate);



    const handleWishlist = () => {
        dispatch(toggleWishlistItem({ id: project.id, title: project.title, price: project.price, originalPrice: project.originalPrice, discount: project.discount, icon: project.icon, slug: project.slug }));
        toast(isWishlisted ? '💔 Removed from wishlist' : '❤️ Added to wishlist!');
    };

    const handleBuyNow = () => {
        setBuyingNow(true);
        dispatch(addToCart({
            id: project.id,
            title: project.title,
            price: project.price,
            originalPrice: project.originalPrice,
            discount: project.discount,
            icon: project.icon,
            slug: project.slug,
            tier: 'Base Product',
        }));
        toast.success(`🛒 ${project.title} added to cart — ${discountedPrice}`, {
            style: { background: '#22c55e', color: '#fff', fontWeight: 700 },
        });
        setTimeout(() => setBuyingNow(false), 800);
    };

    const TIER_CONFIG = [
        {
            key: 'Basic' as const,
            label: 'Basic Tier',
            emoji: '🔵',
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
            border: '#93c5fd',
            glow: 'rgba(59,130,246,0.18)',
            accentBar: '#3b82f6',
            data: basicCard || { price: 0, features: 'No features configured' },
        },
        {
            key: 'Silver' as const,
            label: 'Silver Tier',
            emoji: '🟣',
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
            border: '#c4b5fd',
            glow: 'rgba(139,92,246,0.18)',
            accentBar: '#8b5cf6',
            data: project.silverCardData || { price: 0, features: 'No Silver package' },
        },
        {
            key: 'Gold' as const,
            label: 'Gold Tier',
            emoji: '🟡',
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
            border: '#fcd34d',
            glow: 'rgba(245,158,11,0.18)',
            accentBar: '#f59e0b',
            data: project.goldCardData || { price: 0, features: 'No Gold package' },
        },
    ];

    return (
        <>
            {/* Breadcrumb */}
            <div style={{ background: 'var(--bg-secondary)', padding: '16px 0', borderBottom: '1px solid var(--border-solid)' }}>
                <div className="container">
                    <nav className="breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="breadcrumb-sep">›</span>
                        <Link href="/projects">Projects</Link>
                        <span className="breadcrumb-sep">›</span>
                        <span className="breadcrumb-current">{project.title}</span>
                    </nav>
                </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', minHeight: '80vh', padding: '48px 0' }}>
                <div className="container">
                    <div className="project-detail-grid">
                        {/* LEFT: Gallery */}
                        <div style={{ minWidth: 0 }}>
                            {/* Main Gallery */}
                            <div className="project-gallery" ref={galleryRef}>
                                <div className="gallery-main animate-fadeIn" key={activeMedia}>
                                    {mediaItems[activeMedia].type === 'video' ? (
                                        <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}>
                                            <source src={mediaItems[activeMedia].src} />
                                        </video>
                                    ) : (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={mediaItems[activeMedia].src}
                                            alt={mediaItems[activeMedia].caption}
                                            onClick={() => setIsLightboxOpen(true)}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)', cursor: 'zoom-in' }}
                                        />
                                    )}
                                    <div className="gallery-caption">{mediaItems[activeMedia].caption}</div>
                                    {/* Auto-scroll indicator */}
                                    <div className="gallery-progress">
                                        <div className="gallery-progress-bar" key={activeMedia} />
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="gallery-thumbs" ref={thumbnailsRef}>
                                {mediaItems.map((m, i) => (
                                    <button
                                        key={i}
                                        className={`gallery-thumb ${i === activeMedia ? 'active' : ''}`}
                                        onClick={() => setActiveMedia(i)}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={m.src} alt={m.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        {m.type === 'video' && <div className="thumb-play">▶</div>}
                                    </button>
                                ))}
                            </div>

                            {/* Tech Stack - Premium Berry Style */}
                            {project.tech && project.tech.filter(Boolean).length > 0 && (
                            <div style={{ 
                                marginTop: 32, 
                                padding: '28px', 
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                                borderRadius: '24px', 
                                border: '1px solid #e3e8ef',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.03, fontSize: '8rem', color: '#5e35b1' }}>
                                    <FiSettings />
                                </div>
                                <h3 style={{ 
                                    fontWeight: 800, 
                                    marginBottom: 20, 
                                    fontSize: '1.25rem', 
                                    color: '#121926', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 10,
                                    letterSpacing: '-0.3px'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: '#ede7f6', color: '#5e35b1', borderRadius: '10px' }}>
                                        <FiCpu size={20} />
                                    </span>
                                    Core Tech Stack
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                    {project.tech.filter(Boolean).map((t, i) => (
                                        <span key={`${t}-${i}`} style={{ 
                                            background: '#ffffff', 
                                            border: '1px solid #e3e8ef', 
                                            padding: '10px 20px', 
                                            borderRadius: '14px', 
                                            fontSize: '0.9rem', 
                                            fontWeight: 700, 
                                            color: '#364152', 
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            transition: 'all 0.3s ease',
                                            cursor: 'default'
                                        }} className="tech-badge-hover">
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: i % 2 === 0 ? '#5e35b1' : '#2196f3' }} />
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <style jsx>{`
                                    .tech-badge-hover:hover {
                                        transform: translateY(-3px);
                                        border-color: #5e35b1;
                                        box-shadow: 0 8px 15px rgba(94, 53, 177, 0.08);
                                        color: #5e35b1;
                                    }
                                `}</style>
                            </div>
                            )}
                        </div>

                        {/* RIGHT: Info */}
                        <div style={{ minWidth: 0 }}>
                            {/* Badges */}
                            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                <span className="badge badge-category">{project.category}</span>
                                {project.isNew && <span className="badge badge-new">🆕 New</span>}
                                {project.featured && <span className="badge" style={{ background: 'rgba(109,176,58,0.1)', color: 'var(--pista-dark)', border: '1px solid var(--pista-border)' }}>⭐ Featured</span>}
                            </div>

                            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: 16 }}>
                                {project.title}
                            </h1>

                            {/* Price */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--pista-primary)' }}>{discountedPrice}</span>
                                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{originalPrice}</span>
                                <span className="badge badge-discount">-{project.discount}% OFF</span>
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: 32 }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', fontWeight: 700 }}>Project Overview</h3>
                                <div style={{
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.8,
                                    padding: '24px',
                                    background: 'var(--bg-card)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1.5px solid var(--border-solid)',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'anywhere',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    {project.description}
                                </div>
                            </div>


                            {/* CTA Buttons */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                                <button className="btn-primary" style={{ justifyContent: 'center', fontSize: '1.05rem', padding: '16px' }} onClick={() => setShowRequirement(true)}>
                                    📋 Get Free Quote & Share Requirements
                                </button>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <button
                                        onClick={handleWishlist}
                                        className={`btn-secondary ${isWishlisted ? 'active' : ''}`}
                                        style={{ justifyContent: 'center', borderColor: isWishlisted ? '#dc2626' : undefined, color: isWishlisted ? '#dc2626' : undefined }}
                                    >
                                        {isWishlisted ? '❤️ Wishlisted' : '🤍 Wishlist'}
                                    </button>
                                    <button
                                        onClick={handleBuyNow}
                                        disabled={buyingNow}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                            padding: '12px 16px', borderRadius: 'var(--radius-md)',
                                            border: 'none', cursor: buyingNow ? 'not-allowed' : 'pointer',
                                            background: buyingNow
                                                ? '#86efac'
                                                : 'linear-gradient(135deg, #22c55e, #16a34a)',
                                            color: '#fff', fontWeight: 800, fontSize: '0.92rem',
                                            boxShadow: '0 4px 14px rgba(34,197,94,0.35)',
                                            transition: 'all 0.25s ease',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {buyingNow ? '✓ Added!' : `⚡ Buy — ${discountedPrice}`}
                                    </button>
                                </div>
                            </div>

                            {/* Contact */}
                            <div style={{ display: 'flex', gap: 12, padding: 16, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-solid)' }}>
                                <a href="https://wa.me/917899533525" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#25D366', fontSize: '0.85rem', fontWeight: 600, width: '100%' }}>
                                    💬 WhatsApp Us
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ── Full-Width Pricing Tier Section ── */}
                    <div style={{
                        marginTop: 56,
                        padding: '40px 0 48px',
                        borderTop: '2px solid var(--border-solid)',
                        borderBottom: '2px solid var(--border-solid)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 12,
                                background: 'linear-gradient(135deg, var(--pista-primary, #6db03a), #4caf50)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.1rem', flexShrink: 0,
                            }}>🏷️</div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Choose Your Service Tier</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>Select the package that fits your project scope</p>
                            </div>
                        </div>

                        <div className="pricing-tiers-grid">
                            {TIER_CONFIG.map(tier => {
                                const isSelected = selectedTier === tier.key;
                                const features = (tier.data.features || '').split('\n').filter(Boolean);
                                return (
                                    <div
                                        key={tier.key}
                                        onClick={() => setSelectedTier(tier.key)}
                                        style={{
                                            position: 'relative',
                                            borderRadius: 20,
                                            border: `2px solid ${isSelected ? tier.color : tier.border}`,
                                            background: isSelected ? tier.gradient : 'var(--bg-card)',
                                            padding: '28px 24px',
                                            cursor: 'pointer',
                                            transition: 'all 0.28s cubic-bezier(0.34,1.56,0.64,1)',
                                            boxShadow: isSelected ? `0 8px 30px ${tier.glow}` : '0 2px 8px rgba(0,0,0,0.06)',
                                            transform: isSelected ? 'translateY(-4px) scale(1.02)' : 'none',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {/* Accent top bar */}
                                        <div style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, height: isSelected ? 4 : 2,
                                            background: tier.accentBar,
                                            transition: 'height 0.2s ease',
                                        }} />

                                        {/* Selected badge */}
                                        {isSelected && (
                                            <div style={{
                                                position: 'absolute', top: 14, right: 14,
                                                background: tier.color, color: '#fff',
                                                fontSize: '0.65rem', fontWeight: 800,
                                                padding: '3px 8px', borderRadius: 9999,
                                                letterSpacing: '0.04em',
                                            }}>SELECTED</div>
                                        )}

                                        {/* Header */}
                                        <div style={{ marginBottom: 16, marginTop: 8 }}>
                                            <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{tier.emoji}</div>
                                            <h3 style={{
                                                fontSize: '1.1rem', fontWeight: 800, margin: '0 0 6px',
                                                color: isSelected ? tier.color : 'var(--text-primary)',
                                                transition: 'color 0.2s',
                                            }}>{tier.label}</h3>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                                <span style={{ fontSize: '1.7rem', fontWeight: 900, color: tier.color }}>
                                                    {formatPrice(tier.data.price, currency, usdRate)}
                                                </span>
                                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>/ project</span>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8, flexGrow: 1 }}>
                                            {features.map((f: string, i: number) => (
                                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    <span style={{
                                                        width: 18, height: 18, borderRadius: '50%',
                                                        background: `${tier.color}20`,
                                                        color: tier.color, fontWeight: 900,
                                                        fontSize: '0.65rem', flexShrink: 0,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        marginTop: 1,
                                                    }}>✓</span>
                                                    <span style={{ lineHeight: 1.4 }}>{f.trim()}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Add to Cart button */}
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                setSelectedTier(tier.key);
                                                // Tier price is standalone — base product price is NOT added
                                                const tp = tier.data.price;
                                                dispatch(addToCart({
                                                    id: Number(`${project.id}${tier.key === 'Basic' ? 1 : tier.key === 'Silver' ? 2 : 3}`),
                                                    title: `${project.title}`,
                                                    price: tp,                      // only the tier's own price
                                                    originalPrice: tp,
                                                    discount: 0,
                                                    icon: project.icon,
                                                    slug: project.slug,
                                                    tier: tier.key,
                                                    tierPrice: tp,
                                                }));
                                                toast.success(`✨ ${tier.label} added to cart!`, {
                                                    style: { background: tier.color, color: '#fff', fontWeight: 700 },
                                                });
                                            }}
                                            style={{
                                                width: '100%', padding: '12px 0',
                                                borderRadius: 12,
                                                border: `2px solid ${tier.color}`,
                                                background: isSelected ? tier.color : 'transparent',
                                                color: isSelected ? '#fff' : tier.color,
                                                fontWeight: 800, fontSize: '0.88rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                letterSpacing: '0.02em',
                                                boxShadow: isSelected ? `0 4px 14px ${tier.glow}` : 'none',
                                            }}
                                        >
                                            {isSelected ? `🛒 Add ${tier.key} to Cart` : `Add ${tier.key}`}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div style={{ marginTop: 64, paddingTop: 48, borderTop: '2px solid var(--border-solid)' }}>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 32 }}>⭐ Customer Reviews</h2>
                        <div className="reviews-grid-container">
                            <div>
                                <h3 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--text-secondary)' }}>What Clients Say</h3>
                                <ReviewList projectSlug={slug} />
                            </div>
                            <div>
                                <ReviewForm projectSlug={slug} />
                            </div>
                        </div>
                    </div>

                    {/* Related Projects */}
                    <div style={{ marginTop: 64, paddingTop: 48, borderTop: '2px solid var(--border-solid)' }}>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 32 }}>🔥 Similar Solutions</h2>
                        <div className="products-grid">
                            {projects.filter(p => p.category === project.category && p.id !== project.id).slice(0, 4).map(p => (
                                <Link key={p.id} href={`/projects/${p.slug}`} className="product-card" style={{ textDecoration: 'none', display: 'block' }}>
                                    <div className="product-card-image" style={{ overflow: 'hidden' }}>
                                        {p.mainImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={p.mainImage} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: '3rem' }}>{p.icon}</span>
                                        )}
                                    </div>
                                    <div className="product-card-body">
                                        <span className="badge badge-category" style={{ fontSize: '0.72rem' }}>{p.category}</span>
                                        <h3 className="product-card-title">{p.title}</h3>
                                        <div className="product-card-price">
                                            <span className="price-discounted">{formatPrice(p.price, currency, usdRate)}</span>
                                            <span className="price-original">{formatPrice(p.originalPrice, currency, usdRate)}</span>
                                            <span className="badge badge-discount">-{p.discount}%</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Requirement Modal */}
            {showRequirement && <RequirementModal project={project} onClose={() => setShowRequirement(false)} />}

            {/* Premium Lightbox Modal */}
            {isLightboxOpen && (
                <div 
                    className="modal-overlay animate-fadeIn" 
                    style={{ background: 'rgba(0,0,0,0.95)', padding: 0, zIndex: 99999 }}
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button 
                        onClick={() => setIsLightboxOpen(false)}
                        style={{ position: 'absolute', top: 40, right: 40, background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', width: 50, height: 50, borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', zIndex: 100000, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        title="Close (Esc)"
                    >✕</button>

                    <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMedia(p => (p - 1 + mediaItems.length) % mediaItems.length); }}
                        style={{ position: 'absolute', left: 30, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', width: 60, height: 60, borderRadius: '50%', fontSize: '1.8rem', cursor: 'pointer', zIndex: 100000, transition: 'all 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >‹</button>

                    <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMedia(p => (p + 1) % mediaItems.length); }}
                        style={{ position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', width: 60, height: 60, borderRadius: '50%', fontSize: '1.8rem', cursor: 'pointer', zIndex: 100000, transition: 'all 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >›</button>

                    <div 
                        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {mediaItems[activeMedia].type === 'video' ? (
                            <video autoPlay controls style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
                                <source src={mediaItems[activeMedia].src} />
                            </video>
                        ) : (
                            <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={mediaItems[activeMedia].src} 
                                    alt={mediaItems[activeMedia].caption} 
                                    style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 0 40px rgba(0,0,0,0.8)', transition: 'transform 0.3s ease' }}
                                />
                                <div style={{ color: 'white', textAlign: 'center', marginTop: 24, fontSize: '1.1rem', fontWeight: 600, textShadow: '0 2px 10px rgba(0,0,0,0.5)', opacity: 0.9 }}>
                                    {mediaItems[activeMedia].caption} <span style={{ opacity: 0.6, fontWeight: 400, marginLeft: 8 }}>({activeMedia + 1} / {mediaItems.length})</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
