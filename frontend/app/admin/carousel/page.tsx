'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { 
    fetchCarousel,
    addSlideThunk, updateSlideThunk, deleteSlideThunk, toggleSlideActiveThunk,
    addProductSlideThunk, updateProductSlideThunk, deleteProductSlideThunk, toggleProductSlideActiveThunk,
    type CarouselSlide, type ProductDetailSlide 
} from '@/store/slices/carouselSlice';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { FiImage, FiPlus, FiEdit2, FiCheck, FiLayers, FiInfo, FiRefreshCw } from 'react-icons/fi';

const BLANK_SLIDE: Omit<CarouselSlide, 'id'> = {
    title: '',
    subtitle: '',
    ctaText: 'Explore Now',
    ctaLink: '/projects',
    bgColor: 'linear-gradient(135deg, #e5f6d4 0%, #f4fbee 100%)',
    order: 1,
    isActive: true,
};

const BLANK_PRODUCT_SLIDE: Omit<ProductDetailSlide, 'id'> = {
    text: '',
    order: 1,
    isActive: true,
};

export default function AdminCarouselPage() {
    const dispatch = useAppDispatch();
    const { slides, productSlides, status } = useAppSelector(s => s.carousel);
    
    const [activeTab, setActiveTab] = useState<'home' | 'product'>('home');
    
    const refreshData = () => dispatch(fetchCarousel());

    useEffect(() => {
        if (status === 'idle') refreshData();
    }, [dispatch, status]);

    // Home Carousel State
    const [editSlide, setEditSlide] = useState<CarouselSlide | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<Omit<CarouselSlide, 'id'>>(BLANK_SLIDE);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Product Carousel State
    const [editProductSlide, setEditProductSlide] = useState<ProductDetailSlide | null>(null);
    const [showProductForm, setShowProductForm] = useState(false);
    const [productForm, setProductForm] = useState<Omit<ProductDetailSlide, 'id'>>(BLANK_PRODUCT_SLIDE);
    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

    // Home Handlers
    const openNew = () => { setForm(BLANK_SLIDE); setEditSlide(null); setShowForm(true); };
    const openEdit = (s: CarouselSlide) => { setEditSlide(s); setForm({ ...s }); setShowForm(true); };

    const handleSave = async () => {
        try {
            if (editSlide) {
                const res = await dispatch(updateSlideThunk({ ...form, id: editSlide.id })).unwrap();
                toast.success('✅︎︎ Carousel updated!');
            } else {
                const res = await dispatch(addSlideThunk(form)).unwrap();
                toast.success('✅︎︎ Carousel added!');
            }
            setShowForm(false);
        } catch (err: any) {
            const msg = typeof err === 'string' 
                ? err 
                : (err.detail || err.message || JSON.stringify(err));
            toast.error('❌ ' + msg);
            console.error('Carousel Save Error:', err);
        }
    };

    const executeDelete = async () => {
        if (deleteId !== null) {
            try {
                await dispatch(deleteSlideThunk(deleteId)).unwrap();
                toast.success('Slide deleted');
                setDeleteId(null);
            } catch (err: any) {
                toast.error('Delete failed');
            }
        }
    };

    // Product Handlers
    const openNewProduct = () => { setProductForm(BLANK_PRODUCT_SLIDE); setEditProductSlide(null); setShowProductForm(true); };
    const openEditProduct = (s: ProductDetailSlide) => { setEditProductSlide(s); setProductForm({ ...s }); setShowProductForm(true); };

    const handleSaveProduct = async () => {
        try {
            if (editProductSlide) {
                await dispatch(updateProductSlideThunk({ ...productForm, id: editProductSlide.id })).unwrap();
                toast.success('✅︎︎ Product strip item updated!');
            } else {
                await dispatch(addProductSlideThunk(productForm)).unwrap();
                toast.success('✅︎︎ Product strip item added!');
            }
            setShowProductForm(false);
        } catch (err: any) {
            const msg = typeof err === 'string' 
                ? err 
                : (err.detail || err.message || JSON.stringify(err));
            toast.error('❌ ' + msg);
            console.error('Product Save Error:', err);
        }
    };

    const executeDeleteProduct = async () => {
        if (deleteProductId !== null) {
            try {
                await dispatch(deleteProductSlideThunk(deleteProductId)).unwrap();
                toast.success('Item deleted');
                setDeleteProductId(null);
            } catch (err: any) {
                toast.error('Delete failed');
            }
        }
    };

    return (
        <div>
            {/* Tabs & Global Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 12, padding: '4px', background: '#f1f5f9', borderRadius: 12, width: 'fit-content' }}>
                    <button 
                        onClick={() => setActiveTab('home')}
                        style={{ 
                            padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
                            background: activeTab === 'home' ? '#fff' : 'transparent',
                            color: activeTab === 'home' ? 'var(--pista-dark)' : '#64748b',
                            boxShadow: activeTab === 'home' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
                        }}
                    >
                        <FiLayers /> Home Hero Carousel
                    </button>
                    <button 
                        onClick={() => setActiveTab('product')}
                        style={{ 
                            padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
                            background: activeTab === 'product' ? '#fff' : 'transparent',
                            color: activeTab === 'product' ? 'var(--pista-dark)' : '#64748b',
                            boxShadow: activeTab === 'product' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
                        }}
                    >
                        <FiInfo /> Product Strip Carousel
                    </button>
                </div>
                
                <button 
                    onClick={refreshData} 
                    className="berry-btn-outline" 
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}
                    disabled={status === 'loading'}
                >
                    <FiRefreshCw className={status === 'loading' ? 'animate-spin' : ''} />
                    {status === 'loading' ? 'Syncing...' : 'Sync Data'}
                </button>
            </div>

            {status === 'loading' && slides.length === 0 ? (
                <div style={{ padding: '80px 0', textAlign: 'center', color: '#64748b' }}>
                    <FiRefreshCw className="animate-spin" size={32} style={{ marginBottom: 12 }} />
                    <p>Loading your carousels...</p>
                </div>
            ) : activeTab === 'home' ? (
                <div className="berry-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div>
                            <h2 className="berry-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><FiImage /> Home Hero Carousel</h2>
                            <p style={{ color: '#697586', margin: '4px 0 0' }}>{slides.length} slides configured</p>
                        </div>
                        <button className="berry-btn-primary" onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiPlus /> Add New Slide
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[...slides].sort((a, b) => a.order - b.order).map(slide => (
                            <div key={slide.id} style={{ border: '1px solid #e3e8ef', borderRadius: 12, overflow: 'hidden', background: '#ffffff', display: 'flex' }}>
                                <div style={{ padding: 24, flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#121926', marginBottom: 6 }}>{slide.title}</div>
                                            <div style={{ color: '#364152', fontSize: '0.88rem', marginBottom: 12 }}>{slide.subtitle}</div>
                                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                <span className="berry-badge info">Order: {slide.order}</span>
                                                <span className="berry-badge warning">→ {slide.ctaLink}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end', width: 200 }}>
                                            <button
                                                style={{ background: slide.isActive ? '#b9f6ca' : '#ffcdd2', color: slide.isActive ? '#00c853' : '#c62828', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                                                onClick={() => { dispatch(toggleSlideActiveThunk(slide)); }}
                                            >
                                                {slide.isActive ? '✓︎ Active' : '✕︎ Hidden'}
                                            </button>
                                            <button className="berry-btn-outline" style={{ padding: '6px 14px', fontSize: '0.82rem' }} onClick={() => openEdit(slide)}>Edit</button>
                                            <button style={{ padding: '6px 14px', fontSize: '0.82rem', background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', borderRadius: 8, cursor: 'pointer' }}
                                                onClick={() => setDeleteId(slide.id)}>
                                                Del
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: 140, background: slide.bgColor, borderLeft: '1px solid #e3e8ef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {slide.image ? (
                                        <img src={slide.image} alt="Slide" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ fontSize: '2rem', opacity: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiImage /></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="berry-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <div>
                            <h2 className="berry-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><FiLayers /> Product Strip Carousel</h2>
                            <p style={{ color: '#697586', margin: '4px 0 0' }}>{productSlides.length} items configured</p>
                        </div>
                        <button className="berry-btn-primary" onClick={openNewProduct} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiPlus /> Add New Item
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[...productSlides].sort((a, b) => a.order - b.order).map(slide => (
                            <div key={slide.id} style={{ border: '1px solid #e3e8ef', borderRadius: 12, overflow: 'hidden', background: '#ffffff', display: 'flex' }}>
                                <div style={{ padding: 20, flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div style={{ width: 60, height: 60, borderRadius: 8, background: '#f8fafc', border: '1px solid #e3e8ef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                {slide.image ? <img src={slide.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiImage style={{ opacity: 0.3 }} size={24} />}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#121926', marginBottom: 4 }}>{slide.text}</div>
                                                <div className="berry-badge info">Order: {slide.order}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button
                                                style={{ background: slide.isActive ? '#b9f6ca' : '#ffcdd2', color: slide.isActive ? '#00c853' : '#c62828', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                                                onClick={() => { dispatch(toggleProductSlideActiveThunk(slide)); }}
                                            >
                                                {slide.isActive ? 'Active' : 'Hidden'}
                                            </button>
                                            <button className="berry-btn-outline" style={{ padding: '6px 14px', fontSize: '0.82rem' }} onClick={() => openEditProduct(slide)}>Edit</button>
                                            <button style={{ padding: '6px 14px', fontSize: '0.82rem', background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', borderRadius: 8, cursor: 'pointer' }}
                                                onClick={() => setDeleteProductId(slide.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Home Carousel Modal */}
            {showForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(18,25,38,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
                    <div className="berry-card" style={{ maxWidth: 600, width: '100%', margin: 0, animation: 'fadeInUp 0.3s ease', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 style={{ fontWeight: 800, margin: 0, color: '#121926', display: 'flex', alignItems: 'center', gap: 8 }}>
                                {editSlide ? <><FiEdit2 /> Edit Slide</> : <><FiPlus /> New Slide</>}
                            </h2>
                            <button onClick={() => setShowForm(false)} style={{ background: '#f8fafc', border: '1px solid #e3e8ef', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#697586' }}>✕︎</button>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Title *</label>
                            <input className="berry-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="🚀︎︎ Amazing Business Solutions" />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Subtitle *</label>
                            <input className="berry-input" value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} placeholder="Short description for the slide" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>CTA Text</label>
                                <input className="berry-input" value={form.ctaText} onChange={e => setForm(p => ({ ...p, ctaText: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>CTA Link</label>
                                <input className="berry-input" value={form.ctaLink} onChange={e => setForm(p => ({ ...p, ctaLink: e.target.value }))} placeholder="/projects" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Order</label>
                                <input type="number" className="berry-input" value={form.order} onChange={e => setForm(p => ({ ...p, order: +e.target.value }))} min={1} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Active</label>
                                <select className="berry-input" value={form.isActive ? 'yes' : 'no'} onChange={e => setForm(p => ({ ...p, isActive: e.target.value === 'yes' }))}>
                                    <option value="yes">Active (Visible)</option>
                                    <option value="no">Hidden</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Background Gradient</label>
                                <input className="berry-input" value={form.bgColor} onChange={e => setForm(p => ({ ...p, bgColor: e.target.value }))} placeholder="linear-gradient(135deg, #e5f6d4 0%, #f4fbee 100%)" />
                                <div style={{ height: 48, borderRadius: 8, marginTop: 12, background: form.bgColor, border: '1px solid #e3e8ef' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Slide Image (Optional)</label>
                                <input type="file" accept="image/*" className="berry-input" onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (evt) => setForm(p => ({ ...p, image: evt.target?.result as string }));
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                                {form.image && (
                                    <div style={{ marginTop: 12, position: 'relative' }}>
                                        <img src={form.image} alt="Preview" style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #e3e8ef' }} />
                                        <button onClick={() => setForm(p => ({ ...p, image: undefined }))} style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, fontSize: 10, cursor: 'pointer' }}>✕︎</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="berry-btn-primary" onClick={handleSave} style={{ flex: 1, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                {editSlide ? <><FiCheck /> Update Slide</> : <><FiPlus /> Add Slide</>}
                            </button>
                            <button className="berry-btn-outline" onClick={() => setShowForm(false)} style={{ flex: 1, padding: 14, color: '#364152', borderColor: '#e3e8ef' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Carousel Modal */}
            {showProductForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(18,25,38,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
                    <div className="berry-card" style={{ maxWidth: 500, width: '100%', margin: 0, animation: 'fadeInUp 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 style={{ fontWeight: 800, margin: 0, color: '#121926', display: 'flex', alignItems: 'center', gap: 8 }}>
                                {editProductSlide ? <><FiEdit2 /> Edit Strip Image/Discount</> : <><FiPlus /> New Strip Image/Discount</>}
                            </h2>
                            <button onClick={() => setShowProductForm(false)} style={{ background: '#f8fafc', border: '1px solid #e3e8ef', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#697586' }}>✕︎</button>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Step 1: Upload Banner / Image</label>
                            <div style={{ 
                                border: '2px dashed #e3e8ef', 
                                borderRadius: 12, 
                                padding: '20px', 
                                textAlign: 'center',
                                background: '#f8fafc',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }} onClick={() => document.getElementById('product-image-upload')?.click()}>
                                <input id="product-image-upload" type="file" accept="image/*" hidden onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (evt) => setProductForm(p => ({ ...p, image: evt.target?.result as string }));
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                                {productForm.image ? (
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <img src={productForm.image} alt="" style={{ maxHeight: 100, maxWidth: '100%', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <div style={{ marginTop: 8, fontSize: '0.75rem', color: '#6db03a', fontWeight: 700 }}>✓ Image Selected</div>
                                    </div>
                                ) : (
                                    <div style={{ color: '#64748b' }}>
                                        <FiImage size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click to upload discount banner</div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>PNG, JPG or WebP supported</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Step 2: Add Overlay Text (Optional)</label>
                            <input className="berry-input" value={productForm.text} onChange={e => setProductForm(p => ({ ...p, text: e.target.value }))} placeholder="e.g. 🎁 Special Offer: Valid till Sunday!" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Display Order</label>
                                <input type="number" className="berry-input" value={productForm.order} onChange={e => setProductForm(p => ({ ...p, order: +e.target.value }))} min={1} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Status</label>
                                <select className="berry-input" value={productForm.isActive ? 'yes' : 'no'} onChange={e => setProductForm(p => ({ ...p, isActive: e.target.value === 'yes' }))}>
                                    <option value="yes">Active</option>
                                    <option value="no">Hidden</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="berry-btn-primary" onClick={handleSaveProduct} style={{ flex: 1, padding: 14 }}>
                                {editProductSlide ? 'Update Item' : 'Add to Strip'}
                            </button>
                            <button className="berry-btn-outline" onClick={() => setShowProductForm(false)} style={{ flex: 1, padding: 14 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
            
            <ConfirmModal 
                isOpen={!!deleteId}
                title="Delete Slide"
                message="Are you sure you want to permanently delete this carousel slide?"
                onConfirm={executeDelete}
                onCancel={() => setDeleteId(null)}
            />

            <ConfirmModal 
                isOpen={!!deleteProductId}
                title="Delete Item"
                message="Are you sure you want to permanently delete this strip item?"
                onConfirm={executeDeleteProduct}
                onCancel={() => setDeleteProductId(null)}
            />
        </div>
    );
}

