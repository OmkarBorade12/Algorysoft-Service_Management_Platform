'use client';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/hooks/useRedux';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { USP_ITEMS, WHATSAPP } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function ProjectDetail() {
    const { slug } = useParams();
    const dispatch = useAppDispatch();
    const projects = useSelector((state: RootState) => state.products.items);
    const project = projects.find(p => p.slug === slug);

    const [selectedTier, setSelectedTier] = useState<'Basic' | 'Silver' | 'Gold'>('Silver');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);

    const getTierPrice = (basePrice: number, tier: string) => {
        if (tier === 'Basic') return Math.floor(basePrice * 0.5);
        if (tier === 'Gold') return Math.floor(basePrice * 1.5);
        return basePrice;
    };

    if (!project) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Project Not Found</h1>
                <p style={{ color: 'var(--text-muted)' }}>The project you're looking for doesn't exist.</p>
                <Link href="/projects" className="btn-primary" style={{ marginTop: '24px' }}>Browse All Projects</Link>
            </div>
        );
    }

    const handleCart = () => {
        const tierPrice = getTierPrice(project.price, selectedTier);
        const tierOriginalPrice = getTierPrice(project.originalPrice, selectedTier);

        dispatch(addToCart({
            ...project,
            // unique id based on tier to allow multiple tiers in cart
            id: Number(`${project.id}${selectedTier === 'Basic' ? 1 : selectedTier === 'Silver' ? 2 : 3}`),
            price: tierPrice,
            originalPrice: tierOriginalPrice,
            tier: selectedTier,
            title: `${project.title} - ${selectedTier} Tier`
        }));
        toast.success(`Added ${selectedTier} Tier to cart!`);
    };

    const handleWishlist = () => {
        dispatch(toggleWishlist(project));
        toast.success('Added to wishlist!');
    };

    const displayImage = selectedImage || project.mainImage || (project.images && project.images[0]) || null;
    const allImages = project.images || (project.mainImage ? [project.mainImage] : []);

    const openLightbox = (img: string) => {
        const idx = allImages.indexOf(img);
        setActiveLightboxIndex(idx >= 0 ? idx : 0);
        setIsLightboxOpen(true);
    };

    return (
        <div className="container" style={{ padding: '40px 24px' }}>
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <Link href="/">Home</Link>
                <span className="breadcrumb-sep">/</span>
                <Link href={`/projects?category=${project.category}`}>{project.category}</Link>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">{project.title}</span>
            </nav>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '48px', alignItems: 'flex-start' }}>
                {/* Left Col - Details */}
                <div style={{ minWidth: 0 }}>
                    {displayImage ? (
                        <>
                            <div style={{
                                width: '100%',
                                aspectRatio: '16/9',
                                borderRadius: '24px',
                                border: '1px solid var(--border-color)',
                                position: 'relative',
                                overflow: 'hidden',
                                marginBottom: '16px',
                                background: '#121926'
                            }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={displayImage} 
                                    alt={project.title} 
                                    onClick={() => openLightbox(displayImage)}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'zoom-in' }} 
                                />
                            </div>
                            {project.images && project.images.length > 1 && (
                                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginBottom: '32px', paddingBottom: '8px' }}>
                                    {project.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            style={{
                                                width: '100px',
                                                height: '60px',
                                                borderRadius: '12px',
                                                border: displayImage === img ? '2px solid var(--dark-pista-bright)' : '1px solid var(--border-color)',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                flexShrink: 0,
                                                opacity: displayImage === img ? 1 : 0.6,
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img} alt={`${project.title} thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{
                            width: '100%',
                            aspectRatio: '16/9',
                            background: 'var(--gradient-card)',
                            borderRadius: '24px',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            marginBottom: '32px'
                        }}>
                            <div style={{ fontSize: '6rem', position: 'relative', zIndex: 1, animation: 'float 4s ease-in-out infinite' }}>
                                {project.icon}
                            </div>
                            <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(82,183,136,0.1), transparent 70%)', borderRadius: '50%' }} />
                        </div>
                    )}

                    <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
                        {project.title}
                    </h1>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                        <span className="badge badge-category">{project.category}</span>
                        <span className="badge badge-new" style={{ color: 'var(--text-muted)', background: 'var(--bg-glass)' }}>👁 {project.views.toLocaleString()} views</span>
                        <span className="badge badge-new" style={{ color: 'var(--text-muted)', background: 'var(--bg-glass)' }}>⭐ 4.9 (124 reviews)</span>
                        <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.9rem', borderRadius: '8px' }} onClick={() => window.open(project.slug === 'custom' ? '#' : `https://demo.algorysoft.com/${project.slug}`, '_blank')}>
                            Live Preview ↗
                        </button>
                    </div>

                    <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1.5px solid var(--border-color)', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', fontWeight: 700 }}>Project Overview</h3>
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                            {project.description}
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Technologies Used</h3>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {project.tech.map(t => (
                                <span key={t} style={{ padding: '8px 16px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>What's Included?</h3>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-secondary)' }}>
                            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '24px', height: '24px', background: 'rgba(82, 183, 136, 0.1)', color: 'var(--dark-pista-bright)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>
                                Complete Source Code
                            </li>
                            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '24px', height: '24px', background: 'rgba(82, 183, 136, 0.1)', color: 'var(--dark-pista-bright)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>
                                IEEE Base Paper
                            </li>
                            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '24px', height: '24px', background: 'rgba(82, 183, 136, 0.1)', color: 'var(--dark-pista-bright)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>
                                Project Documentation (Synopsis, PPT, Report)
                            </li>
                            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '24px', height: '24px', background: 'rgba(82, 183, 136, 0.1)', color: 'var(--dark-pista-bright)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>
                                Installation Guide & Video
                            </li>
                            <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '24px', height: '24px', background: 'rgba(82, 183, 136, 0.1)', color: 'var(--dark-pista-bright)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>
                                Free Online Installation Support
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Col - Purchase */}
                <div style={{ position: 'sticky', top: '100px' }}>
                    <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '24px', border: '1px solid var(--dark-pista-bright)', boxShadow: '0 8px 30px rgba(82, 183, 136, 0.15)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', fontWeight: 700 }}>Select Pricing Tier</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            {['Basic', 'Silver', 'Gold'].map((tier) => (
                                <div
                                    key={tier}
                                    onClick={() => setSelectedTier(tier as 'Basic' | 'Silver' | 'Gold')}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: `2px solid ${selectedTier === tier ? 'var(--dark-pista-bright)' : 'var(--border-color)'}`,
                                        background: selectedTier === tier ? 'rgba(82, 183, 136, 0.05)' : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: selectedTier === tier ? 'var(--dark-pista-bright)' : 'inherit' }}>{tier}</h4>
                                        <span style={{ fontWeight: 700 }}>₹{getTierPrice(project.price, tier).toLocaleString('en-IN')}</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {tier === 'Basic' && "Static Frontend, Contact Form, Basic Domain"}
                                        {tier === 'Silver' && "Dynamic Frontend, Custom Admin, DB, Auth"}
                                        {tier === 'Gold' && "Full Stack App, AWS/Cloud, Payment Gateway"}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--dark-pista-bright)' }}>₹{getTierPrice(project.price, selectedTier).toLocaleString('en-IN')}</span>
                            <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{getTierPrice(project.originalPrice, selectedTier).toLocaleString('en-IN')}</span>
                        </div>

                        <div style={{ display: 'inline-flex', padding: '4px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '24px' }}>
                            Special Offer: Save {project.discount}% today
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem' }} onClick={handleCart}>
                                ⚡ Buy Now (2% Off)
                            </button>
                            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem' }} onClick={() => {
                                // Mock behavior for custom request
                                const confirmReq = confirm('Login required. Redirect to login to request customization?');
                                if (confirmReq) { window.location.href = '/login'; }
                            }}>
                                📝 Request Custom
                            </button>
                        </div>

                        <div className="divider" />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {USP_ITEMS.slice(0, 4).map(u => (
                                <div key={u.title} style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{u.icon}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{u.title}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(37, 211, 102, 0.1)', borderRadius: '12px', border: '1px solid rgba(37, 211, 102, 0.2)', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Need help with this project?</p>
                            <a href={`https://wa.me/${WHATSAPP}?text=Hi! I want to know more about the ${project.title} project.`} target="_blank" rel="noreferrer" style={{ color: '#25D366', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                💬 Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Lightbox Modal */}
            {isLightboxOpen && allImages.length > 0 && (
                <div 
                    className="modal-overlay animate-fadeIn" 
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', padding: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button 
                        onClick={() => setIsLightboxOpen(false)}
                        style={{ position: 'absolute', top: 30, right: 30, background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', width: 50, height: 50, borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', zIndex: 2001 }}
                    >✕</button>

                    {allImages.length > 1 && (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveLightboxIndex(p => (p - 1 + allImages.length) % allImages.length); }}
                                style={{ position: 'absolute', left: 30, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', width: 60, height: 60, borderRadius: '50%', fontSize: '1.8rem', cursor: 'pointer', zIndex: 2001 }}
                            >‹</button>

                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveLightboxIndex(p => (p + 1) % allImages.length); }}
                                style={{ position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', width: 60, height: 60, borderRadius: '50%', fontSize: '1.8rem', cursor: 'pointer', zIndex: 2001 }}
                            >›</button>
                        </>
                    )}

                    <div style={{ maxWidth: '90%', maxHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={allImages[activeLightboxIndex]} 
                            alt={`${project.title} detailed view`} 
                            style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }} 
                        />
                        <div style={{ color: 'white', marginTop: 20, fontSize: '1rem', opacity: 0.8 }}>
                            Image {activeLightboxIndex + 1} / {allImages.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
