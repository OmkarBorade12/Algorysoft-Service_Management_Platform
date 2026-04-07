'use client';
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import toast from 'react-hot-toast';
import {
    fetchBasicCard, saveBasicCard, fetchPricingCards,
    addPricingCard, updatePricingCard, deletePricingCard,
    PricingCard, BasicCard
} from '@/store/slices/pricingCardsSlice';
import { fetchFeatures } from '@/store/slices/featuresSlice';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { FiCreditCard, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiAward, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import '../admin-custom.css';

/* ── MultiSelectFeatures ─────────────────────────────────────── */
const MultiSelectFeatures = ({
    value, onChange, options
}: {
    value: string;
    onChange: (val: string, ap: number, rp: number) => void;
    options: { id: number; name: string; price: number }[];
}) => {
    const selectedNames = value.split('\n').filter(Boolean);
    const available = options.filter(o => !selectedNames.includes(o.name));
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filtered = available.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={{ border: '1px solid #e3e8ef', padding: 8, borderRadius: 8, background: '#fff' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8, minHeight: 28 }}>
                {selectedNames.map(name => (
                    <span key={name} style={{ background: '#ede7f6', color: '#5e35b1', padding: '4px 8px', borderRadius: 6, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                        {name}
                        <button type="button" onClick={() => {
                            const removed = options.find(o => o.name === name);
                            onChange(selectedNames.filter(n => n !== name).join('\n'), 0, removed?.price || 0);
                        }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5e35b1', fontSize: '1rem', lineHeight: 1, padding: 0 }}>×</button>
                    </span>
                ))}
            </div>
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    className="berry-input"
                    placeholder="+ Search and add feature..."
                    value={searchTerm}
                    onChange={e => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    style={{ padding: '8px', fontSize: '0.85rem' }}
                />

                {isOpen && filtered.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e3e8ef', borderRadius: 8, marginTop: 4, maxHeight: 200, overflowY: 'auto', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        {filtered.map(o => (
                            <div
                                key={o.id}
                                style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.85rem', borderBottom: '1px solid #eee' }}
                                onMouseDown={(e) => {
                                    e.preventDefault(); // prevent blur
                                    onChange(selectedNames.concat(o.name).join('\n'), o.price, 0);
                                    setSearchTerm('');
                                    setIsOpen(false);
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                {o.name} <span style={{ color: '#10b981', fontWeight: 600 }}>(+₹{o.price.toLocaleString('en-IN')})</span>
                            </div>
                        ))}
                    </div>
                )}
                {isOpen && filtered.length === 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e3e8ef', borderRadius: 8, marginTop: 4, padding: '8px 12px', fontSize: '0.85rem', color: '#697586', zIndex: 10 }}>
                        No features found
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── CardFormModal ───────────────────────────────────────────── */
type CardFormData = { name: string; tier: 'silver' | 'gold'; price: number; features: string };
const EMPTY_FORM: CardFormData = { name: '', tier: 'silver', price: 0, features: '' };

const CardFormModal = ({
    initial, onSave, onClose, catalogFeatures
}: {
    initial?: PricingCard | null;
    onSave: (d: CardFormData) => void;
    onClose: () => void;
    catalogFeatures: { id: number; name: string; price: number }[];
}) => {
    const [form, setForm] = useState<CardFormData>(
        initial ? { name: initial.name, tier: initial.tier, price: initial.price, features: initial.features } : EMPTY_FORM
    );
    return (
        <div className="pc-overlay">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="berry-card pc-modal-box"
            >
                <div className="pc-modal-header">
                    <h3><FiCreditCard /> {initial ? 'Edit Card' : 'Create New Card'}</h3>
                    <button onClick={onClose} className="pc-close-btn"><FiX /></button>
                </div>

                <div className="pc-field">
                    <label className="pc-label">Tier</label>
                    <div style={{ display: 'flex', gap: 12 }}>
                        {(['silver', 'gold'] as const).map(t => (
                            <button key={t} type="button" onClick={() => setForm(p => ({ ...p, tier: t }))}
                                className={`pc-tier-btn ${form.tier === t ? t : ''}`}>
                                {t === 'silver' ? '🥈︎︎ Silver' : '🥇︎︎ Gold'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pc-field">
                    <label className="pc-label">Card Name</label>
                    <input className="berry-input" placeholder="e.g. Silver Standard, Gold Premium…"
                        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>

                <div className="pc-field">
                    <label className="pc-label">Price (₹)</label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#94a3b8' }}>₹</span>
                        <input type="number" className="berry-input" style={{ paddingLeft: 28 }}
                            value={form.price || ''} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} />
                    </div>
                </div>

                <div className="pc-field">
                    <label className="pc-label">Features Included</label>
                    <MultiSelectFeatures value={form.features}
                        onChange={(val, ap, rp) => setForm(p => ({ ...p, features: val, price: Math.max(0, Number(p.price) + ap - rp) }))}
                        options={catalogFeatures} />
                </div>

                <div className="pc-modal-footer">
                    <button className="berry-btn-primary" style={{ flex: 1 }} onClick={() => {
                        if (!form.name.trim()) { toast.error('Card name is required'); return; }
                        onSave(form);
                    }}>
                        <FiCheck /> {initial ? 'Update Card' : 'Create Card'}
                    </button>
                    <button className="berry-btn-outline" style={{ flex: 1, borderColor: '#ffccbc', color: '#d84315' }} onClick={onClose}>Cancel</button>
                </div>
            </motion.div>
        </div>
    );
};

/* ── Pricing Card Visual Component ──────────────────────────── */
const PricingCardTile = ({ card, onEdit, onDelete }: { card: PricingCard; onEdit: () => void; onDelete: () => void }) => {
    const isSilver = card.tier === 'silver';
    const features = card.features.split('\n').filter(Boolean);
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className={`pc-card-tile ${isSilver ? 'silver' : 'gold'}`}
        >
            {/* Top accent bar */}
            <div className={`pc-card-accent ${isSilver ? 'silver' : 'gold'}`} />

            {/* Tier badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span className={`pc-tier-badge ${isSilver ? 'silver' : 'gold'}`}>
                    {isSilver ? '🥈︎︎ Silver' : '🥇︎︎ Gold'}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                    <button className="pc-icon-btn edit" onClick={onEdit} title="Edit"><FiEdit2 size={13} /></button>
                    <button className="pc-icon-btn delete" onClick={onDelete} title="Delete"><FiTrash2 size={13} /></button>
                </div>
            </div>

            {/* Card name */}
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#121926', marginBottom: 6 }}>{card.name}</div>

            {/* Price */}
            <div style={{ fontWeight: 800, fontSize: '1.5rem', color: isSilver ? '#5e35b1' : '#f57f17', marginBottom: 12 }}>
                ₹{Number(card.price).toLocaleString('en-IN')}
            </div>

            {/* Features */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {features.length === 0
                    ? <span style={{ color: '#94a3b8', fontSize: '0.78rem', fontStyle: 'italic' }}>No features added</span>
                    : features.map((f, i) => (
                        <span key={i} className={`pc-feat-pill ${isSilver ? 'silver' : 'gold'}`}>{f}</span>
                    ))
                }
            </div>
        </motion.div>
    );
};

/* ── Simple Pagination ───────────────────────────────────────── */
const SimplePagination = ({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) => {
    const pages = Math.ceil(total / perPage);
    if (pages <= 1) return null;
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
            <button onClick={() => onChange(page - 1)} disabled={page === 1} className="berry-btn-outline" style={{ width: 36, height: 36, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === 1 ? 0.4 : 1 }}>
                <FiChevronLeft />
            </button>
            {Array.from({ length: pages }).map((_, i) => (
                <button key={i} onClick={() => onChange(i + 1)}
                    className={page === i + 1 ? 'berry-btn-primary' : 'berry-btn-outline'}
                    style={{ width: 36, height: 36, padding: 0 }}>{i + 1}</button>
            ))}
            <button onClick={() => onChange(page + 1)} disabled={page === pages} className="berry-btn-outline" style={{ width: 36, height: 36, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: page === pages ? 0.4 : 1 }}>
                <FiChevronRight />
            </button>
        </div>
    );
};

const CARDS_PER_PAGE = 8;

/* ── MAIN PAGE ───────────────────────────────────────────────── */
export default function PricingCardsAdmin() {
    const dispatch = useAppDispatch();
    const { basicCard, cards, status } = useAppSelector(s => (s as any).pricingCards);
    const catalogFeatures = useAppSelector(s => (s as any).features?.items || []);

    const [basicForm, setBasicForm] = useState({ price: 0, features: '' });
    const [basicEdited, setBasicEdited] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [editingCard, setEditingCard] = useState<PricingCard | null>(null);
    const [deleteCardId, setDeleteCardId] = useState<number | null>(null);
    const [tierFilter, setTierFilter] = useState<'all' | 'silver' | 'gold'>('all');
    const [cardPage, setCardPage] = useState(1);

    useEffect(() => {
        dispatch(fetchBasicCard() as any);
        dispatch(fetchPricingCards() as any);
        dispatch(fetchFeatures() as any);
    }, [dispatch]);

    useEffect(() => {
        if (basicCard) setBasicForm({ price: basicCard.price, features: basicCard.features || '' });
    }, [basicCard]);

    const handleSaveBasic = async () => {
        try {
            await dispatch(saveBasicCard({ ...(basicCard || {}), price: basicForm.price, features: basicForm.features }) as any).unwrap();
            toast.success('Basic card saved!');
            setBasicEdited(false);
        } catch { toast.error('Error saving basic card'); }
    };

    const handleSaveCard = async (data: CardFormData) => {
        try {
            if (editingCard) {
                await dispatch(updatePricingCard({ ...editingCard, ...data }) as any).unwrap();
                toast.success('Card updated!');
            } else {
                await dispatch(addPricingCard(data) as any).unwrap();
                toast.success('Card created!');
            }
            setShowCardModal(false);
            setEditingCard(null);
            setCardPage(1);
        } catch { toast.error('Error saving card'); }
    };

    const executeDelete = async () => {
        if (deleteCardId !== null) {
            try {
                await dispatch(deletePricingCard(deleteCardId) as any).unwrap();
                toast.success('Card deleted');
                setCardPage(1);
            } catch { toast.error('Error deleting card'); }
            setDeleteCardId(null);
        }
    };

    const filteredCards: PricingCard[] = tierFilter === 'all' ? cards : cards.filter((c: PricingCard) => c.tier === tierFilter);
    const pagedCards = filteredCards.slice((cardPage - 1) * CARDS_PER_PAGE, cardPage * CARDS_PER_PAGE);
    const silverCount = cards.filter((c: PricingCard) => c.tier === 'silver').length;
    const goldCount = cards.filter((c: PricingCard) => c.tier === 'gold').length;

    if (status === 'loading') return (
        <div style={{ padding: 24 }}>
            <div className="berry-card" style={{ opacity: 0.6 }}>
                <div style={{ height: 32, width: '40%', backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 16 }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                    {[1, 2, 3, 4].map(i => <div key={i} style={{ height: 200, backgroundColor: '#f5f5f5', borderRadius: 14 }} />)}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <AnimatePresence>
                {showCardModal && (
                    <CardFormModal
                        key="card-form"
                        initial={editingCard}
                        onSave={handleSaveCard}
                        onClose={() => { setShowCardModal(false); setEditingCard(null); }}
                        catalogFeatures={catalogFeatures}
                    />
                )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                style={{ width: '100%', maxWidth: '100%' }}>
                <div className="berry-animate-in">

                    {/* ── BASIC CARD ── */}
                    <div className="berry-card">
                        <h2 className="berry-title" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiAward color="#2196f3" /> Basic Card
                            <span style={{ fontSize: '0.72rem', background: '#e3f2fd', color: '#1565c0', padding: '3px 10px', borderRadius: 20, fontWeight: 700, marginLeft: 4 }}>
                                Auto-applied to all products
                            </span>
                        </h2>
                        <p style={{ color: '#697586', marginBottom: 20, fontSize: '0.88rem' }}>
                            The Basic card is automatically assigned to every product. Edit its features and price here.
                        </p>

                        <div className="pc-basic-grid">
                            {/* Preview card */}
                            <div className="pc-basic-preview">
                                <div className="pc-card-accent blue" />
                                <span className="pc-tier-badge blue">⭐︎ Basic</span>
                                <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#2196f3', margin: '12px 0 8px' }}>
                                    ₹{Number(basicForm.price).toLocaleString('en-IN')}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                    {basicForm.features.split('\n').filter(Boolean).map((f, i) => (
                                        <span key={i} className="pc-feat-pill blue">{f}</span>
                                    ))}
                                    {!basicForm.features && <span style={{ color: '#94a3b8', fontSize: '0.78rem', fontStyle: 'italic' }}>No features yet</span>}
                                </div>
                            </div>

                            {/* Edit form */}
                            <div>
                                <div className="pc-field">
                                    <label className="pc-label">Price (₹)</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#94a3b8' }}>₹</span>
                                        <input type="number" className="berry-input" style={{ paddingLeft: 28 }}
                                            value={basicForm.price || ''}
                                            onChange={e => { setBasicForm(p => ({ ...p, price: Number(e.target.value) })); setBasicEdited(true); }} />
                                    </div>
                                </div>
                                <div className="pc-field">
                                    <label className="pc-label">Features Included</label>
                                    <MultiSelectFeatures
                                        value={basicForm.features}
                                        onChange={(val, ap, rp) => { setBasicForm(p => ({ ...p, features: val, price: Math.max(0, Number(p.price) + ap - rp) })); setBasicEdited(true); }}
                                        options={catalogFeatures}
                                    />
                                </div>
                                {basicEdited && (
                                    <button className="berry-btn-primary" onClick={handleSaveBasic} style={{ padding: '11px 28px', marginTop: 4 }}>
                                        <FiCheck style={{ marginRight: 6 }} /> Save Basic Card
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── SILVER & GOLD CARDS ── */}
                    <div className="berry-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                            <div>
                                <h2 className="berry-title" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <FiCreditCard /> Silver & Gold Cards
                                </h2>
                                <p style={{ color: '#697586', fontSize: '0.88rem', margin: 0 }}>
                                    Create reusable cards — assign them to products when adding or editing a product.
                                </p>
                            </div>
                            <button className="berry-btn-primary" onClick={() => { setEditingCard(null); setShowCardModal(true); }}
                                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', whiteSpace: 'nowrap' }}>
                                <FiPlus /> Create Card
                            </button>
                        </div>

                        {/* Stats chips */}
                        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
                            <span className="pc-stat-chip silver"><FiStar size={13} /> {silverCount} Silver</span>
                            <span className="pc-stat-chip gold"><FiAward size={13} /> {goldCount} Gold</span>
                        </div>

                        {/* Filter tabs */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                            {(['all', 'silver', 'gold'] as const).map(t => (
                                <button key={t} onClick={() => { setTierFilter(t); setCardPage(1); }}
                                    className={`pc-filter-tab ${t} ${tierFilter === t ? 'active' : ''}`}>
                                    {t === 'all' ? 'All Cards' : t === 'silver' ? '🥈︎︎ Silver' : '🥇︎︎ Gold'}
                                </button>
                            ))}
                        </div>

                        {/* Cards grid */}
                        {filteredCards.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '52px 0', color: '#94a3b8' }}>
                                <FiCreditCard size={42} style={{ marginBottom: 12, opacity: 0.35 }} />
                                <p style={{ fontWeight: 600, fontSize: '1rem', margin: '0 0 4px' }}>No cards yet</p>
                                <p style={{ fontSize: '0.85rem', margin: 0 }}>Click "Create Card" to build your first Silver or Gold pricing card.</p>
                            </div>
                        ) : (
                            <>
                                <div className="pc-cards-grid">
                                    {pagedCards.map((card: PricingCard) => (
                                        <PricingCardTile
                                            key={card.id}
                                            card={card}
                                            onEdit={() => { setEditingCard(card); setShowCardModal(true); }}
                                            onDelete={() => setDeleteCardId(card.id)}
                                        />
                                    ))}
                                </div>
                                <SimplePagination page={cardPage} total={filteredCards.length} perPage={CARDS_PER_PAGE} onChange={setCardPage} />
                            </>
                        )}
                    </div>

                </div>
            </motion.div>

            <ConfirmModal
                isOpen={!!deleteCardId}
                title="Delete Pricing Card"
                message="Are you sure you want to delete this card? Products assigned to it will lose their Silver/Gold card."
                onConfirm={executeDelete}
                onCancel={() => setDeleteCardId(null)}
            />
        </>
    );
}
