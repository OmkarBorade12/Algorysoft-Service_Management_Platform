'use client';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { addSlide, updateSlide, deleteSlide, toggleSlideActive, type CarouselSlide } from '@/store/slices/carouselSlice';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { FiImage, FiPlus, FiEdit2, FiCheck } from 'react-icons/fi';

const BLANK_SLIDE: Omit<CarouselSlide, 'id'> = {
    title: '',
    subtitle: '',
    ctaText: 'Explore Now',
    ctaLink: '/projects',
    bgColor: 'linear-gradient(135deg, #e5f6d4 0%, #f4fbee 100%)',
    order: 1,
    isActive: true,
};

export default function AdminCarouselPage() {
    const dispatch = useAppDispatch();
    const { slides } = useAppSelector(s => s.carousel);
    const [editSlide, setEditSlide] = useState<CarouselSlide | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<Omit<CarouselSlide, 'id'>>(BLANK_SLIDE);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const openNew = () => { setForm(BLANK_SLIDE); setEditSlide(null); setShowForm(true); };
    const openEdit = (s: CarouselSlide) => { setEditSlide(s); setForm({ ...s }); setShowForm(true); };

    const handleSave = () => {
        if (!form.title || !form.subtitle) { toast.error('Title and subtitle required'); return; }
        if (editSlide) {
            dispatch(updateSlide({ ...form, id: editSlide.id }));
            toast.success('✅ Slide updated!');
        } else {
            dispatch(addSlide({ ...form, id: Date.now() }));
            toast.success('✅ Slide added!');
        }
        setShowForm(false);
    };

    const executeDelete = () => {
        if (deleteId !== null) {
            dispatch(deleteSlide(deleteId));
            toast.success('Slide deleted');
            setDeleteId(null);
        }
    };

    return (
        <div className="berry-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2 className="berry-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><FiImage /> Manage Carousel</h2>
                    <p style={{ color: '#697586', margin: '4px 0 0' }}>{slides.length} slides configured</p>
                </div>
                <button className="berry-btn-primary" onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiPlus /> Add New Slide
                </button>
            </div>

            {/* Slides List */}
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
                                        onClick={() => { dispatch(toggleSlideActive(slide.id)); }}
                                    >
                                        {slide.isActive ? '✓ Active' : '✕ Hidden'}
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

            {/* Modal */}
            {showForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(18,25,38,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
                    <div className="berry-card" style={{ maxWidth: 600, width: '100%', margin: 0, animation: 'fadeInUp 0.3s ease', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 style={{ fontWeight: 800, margin: 0, color: '#121926', display: 'flex', alignItems: 'center', gap: 8 }}>
                                {editSlide ? <><FiEdit2 /> Edit Slide</> : <><FiPlus /> New Slide</>}
                            </h2>
                            <button onClick={() => setShowForm(false)} style={{ background: '#f8fafc', border: '1px solid #e3e8ef', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#697586' }}>✕</button>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Title *</label>
                            <input className="berry-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="🚀 Amazing Business Solutions" />
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
                                        <button onClick={() => setForm(p => ({ ...p, image: undefined }))} style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, fontSize: 10, cursor: 'pointer' }}>✕</button>
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
        </div>
    );
}
