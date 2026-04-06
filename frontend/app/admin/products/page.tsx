'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { addProductThunk, updateProductThunk, deleteProductThunk, Product, fetchProducts } from '@/store/slices/productsSlice';
import { addCategoryThunk, deleteCategoryThunk, Category, fetchCategories } from '@/store/slices/categoriesSlice';
import { fetchPricingCards, fetchBasicCard, PricingCard } from '@/store/slices/pricingCardsSlice';
import ConfirmModal from '@/components/ui/ConfirmModal';
import * as FiIcons from 'react-icons/fi';
import {
    FiBox, FiSearch, FiList, FiPlus, FiEdit2, FiCheck, FiSettings,
    FiChevronDown, FiX, FiTrash2, FiMaximize2, FiChevronLeft, FiChevronRight,
    FiBriefcase, FiShoppingBag, FiShoppingCart, FiCreditCard, FiDollarSign,
    FiPieChart, FiBarChart2, FiTrendingUp, FiActivity, FiGlobe, FiCloud,
    FiDatabase, FiMonitor, FiSmartphone, FiCpu, FiHash, FiLayout, FiGrid,
    FiLayers, FiPackage, FiTruck, FiMapPin, FiUsers, FiClock, FiShield,
    FiAward
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import '../admin-custom.css';

const RECOMMENDED_ICONS = [
    'FiBriefcase', 'FiShoppingBag', 'FiShoppingCart', 'FiCreditCard', 'FiDollarSign',
    'FiPieChart', 'FiBarChart2', 'FiTrendingUp', 'FiActivity', 'FiHeart',
    'FiHome', 'FiTruck', 'FiMonitor', 'FiSmartphone', 'FiCpu',
    'FiDatabase', 'FiCloud', 'FiWifi', 'FiGlobe', 'FiCamera',
    'FiVideo', 'FiFilm', 'FiMusic', 'FiHeadphones', 'FiMic',
    'FiRadio', 'FiTv', 'FiBookOpen', 'FiBook', 'FiEdit3',
    'FiPenTool', 'FiScissors', 'FiTool', 'FiSettings', 'FiTarget',
    'FiAward', 'FiShield', 'FiLock', 'FiKey', 'FiCoffee',
    'FiUser', 'FiUsers', 'FiMapPin', 'FiMap', 'FiNavigation',
    'FiCompass', 'FiSun', 'FiMoon', 'FiUmbrella', 'FiDroplet',
    'FiWind', 'FiZap', 'FiStar', 'FiSmile', 'FiCrosshair',
    'FiAnchor', 'FiFeather', 'FiClock', 'FiCalendar', 'FiBell',
    'FiArchive', 'FiLayers', 'FiBox', 'FiPackage', 'FiFlag',
    'FiFolder', 'FiFileText', 'FiClipboard', 'FiMessageCircle', 'FiMessageSquare',
    'FiMail', 'FiSend', 'FiShare2', 'FiThumbsUp', 'FiCast',
    'FiSpeaker', 'FiPrinter', 'FiServer', 'FiTerminal', 'FiCode',
    'FiCommand', 'FiAlignLeft', 'FiCheckCircle', 'FiLink', 'FiLayout',
    'FiGrid', 'FiMaximize', 'FiType', 'FiPlay', 'FiPower',
    'FiLifeBuoy', 'FiGift', 'FiAperture', 'FiHexagon',
    'FiOctagon', 'FiTriangle', 'FiPercent', 'FiPocket', 'FiSliders',
    'FiBookmark', 'FiHardDrive', 'FiInbox', 'FiList', 'FiHash'
];

const BUSINESS_ICONS = RECOMMENDED_ICONS.filter(k => (FiIcons as any)[k]);

const renderIcon = (iconStr: string) => {
    if (!iconStr) return <FiBox />;
    const IconComponent = (FiIcons as any)[iconStr];
    return IconComponent ? <IconComponent /> : <FiBox />;
};

/* ============================================================
   CARD ASSIGNMENT POPUP
   ============================================================ */
interface CardAssignmentPopupProps {
    silverCardId: number | null;
    goldCardId: number | null;
    onSave: (s: number | null, g: number | null) => void;
    onClose: () => void;
}

function CardAssignmentPopup({ silverCardId, goldCardId, onSave, onClose }: CardAssignmentPopupProps) {
    const { cards, basicCard } = useAppSelector(s => (s as any).pricingCards);
    const [selectedSilver, setSelectedSilver] = useState<number | null>(silverCardId);
    const [selectedGold, setSelectedGold] = useState<number | null>(goldCardId);

    const silverCards: PricingCard[] = cards.filter((c: PricingCard) => c.tier === 'silver');
    const goldCards: PricingCard[]   = cards.filter((c: PricingCard) => c.tier === 'gold');

    const FeaturePills = ({ features, color }: { features: string; color: 'blue' | 'silver' | 'gold' }) => (
        <>
            {features.split('\n').filter(Boolean).map((f, i) => (
                <span key={i} style={{
                    background: color === 'blue' ? '#e3f2fd' : color === 'silver' ? '#ede7f6' : '#fff8e1',
                    color: color === 'blue' ? '#1565c0' : color === 'silver' ? '#5e35b1' : '#f57f17',
                    padding: '2px 8px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 600,
                    display: 'inline-block', margin: '2px'
                }}>{f}</span>
            ))}
        </>
    );

    /* Card selector tile */
    const SelectorCard = ({ card, selected, onToggle }: { card: PricingCard; selected: boolean; onToggle: () => void }) => {
        const isSilver = card.tier === 'silver';
        return (
            <button type="button" onClick={onToggle} style={{
                textAlign: 'left', padding: '14px 14px 12px', borderRadius: 12,
                border: `2px solid ${selected ? (isSilver ? '#673ab7' : '#ffb300') : '#e3e8ef'}`,
                background: selected
                    ? (isSilver ? 'linear-gradient(135deg,#faf8ff,#ede7f6)' : 'linear-gradient(135deg,#fffde7,#fff8e1)')
                    : '#fff',
                cursor: 'pointer', width: '100%', transition: 'all .15s',
                position: 'relative', overflow: 'hidden',
                boxShadow: selected ? (isSilver ? '0 4px 16px rgba(103,58,183,0.15)' : '0 4px 16px rgba(255,179,0,0.2)') : 'none'
            }}>
                {/* top accent */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: isSilver ? 'linear-gradient(90deg,#9c27b0,#673ab7)' : 'linear-gradient(90deg,#ffb300,#ff8f00)',
                    borderRadius: '10px 10px 0 0'
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, marginTop: 4 }}>
                    <span style={{ fontWeight: 700, color: '#121926', fontSize: '0.88rem' }}>{card.name}</span>
                    {selected && <FiCheck size={15} color={isSilver ? '#5e35b1' : '#f57f17'} />}
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: isSilver ? '#5e35b1' : '#f57f17', marginBottom: 6 }}>
                    ₹{Number(card.price).toLocaleString('en-IN')}
                </div>
                <FeaturePills features={card.features} color={isSilver ? 'silver' : 'gold'} />
            </button>
        );
    };

    return (
        /* The outer div is the scrollable backdrop */
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(18,25,38,0.65)', backdropFilter: 'blur(8px)',
            zIndex: 13000, overflowY: 'auto',
            display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
            padding: '60px 16px 60px'
        }}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="berry-card"
                style={{ maxWidth: 820, width: '100%', boxShadow: '0 40px 100px rgba(0,0,0,0.35)', position: 'relative' }}
            >
                {/* Header */}
                <div className="modal-header">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiCreditCard color="#673ab7" /> Assign Pricing Cards
                    </h3>
                    <button onClick={onClose} className="close-btn"><FiX /></button>
                </div>

                <p style={{ color: '#697586', marginBottom: 24, fontSize: '0.88rem' }}>
                    The <strong>Basic card</strong> is automatically applied. Choose one <strong>Silver</strong> and one <strong>Gold</strong> card below.
                </p>

                {/* BASIC (read-only) */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontWeight: 700, color: '#364152', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: '0.9rem' }}>
                        <FiAward color="#2196f3" /> Basic Card
                        <span style={{ background: '#e3f2fd', color: '#1565c0', fontSize: '0.68rem', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>Auto-selected</span>
                    </div>
                    <div style={{ padding: '14px 16px', border: '2px solid #e3f2fd', borderRadius: 12, background: '#f0f9ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                        {basicCard ? (
                            <>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#121926' }}>{basicCard.name || 'Basic'}</div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#2196f3', margin: '4px 0' }}>₹{Number(basicCard.price).toLocaleString('en-IN')}</div>
                                    <FeaturePills features={basicCard.features || ''} color="blue" />
                                </div>
                                <span style={{ background: '#2196f3', color: '#fff', borderRadius: 20, padding: '5px 14px', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>✓ Included</span>
                            </>
                        ) : (
                            <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>No basic card configured — go to Cards section to set one up.</span>
                        )}
                    </div>
                </div>

                {/* SILVER CARDS — 4 per row */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontWeight: 700, color: '#364152', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: '0.9rem' }}>
                        🥈 Silver Cards
                        {selectedSilver && <span style={{ background: '#ede7f6', color: '#5e35b1', fontSize: '0.68rem', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>1 selected</span>}
                    </div>
                    {silverCards.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.83rem', margin: 0 }}>No silver cards yet — create them in the Cards section.</p>
                    ) : (
                        <div className="popup-cards-grid">
                            {silverCards.map((c: PricingCard) => (
                                <SelectorCard key={c.id} card={c} selected={selectedSilver === c.id}
                                    onToggle={() => setSelectedSilver(selectedSilver === c.id ? null : c.id)} />
                            ))}
                        </div>
                    )}
                </div>

                {/* GOLD CARDS — 4 per row */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontWeight: 700, color: '#364152', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: '0.9rem' }}>
                        🥇 Gold Cards
                        {selectedGold && <span style={{ background: '#fff8e1', color: '#f57f17', fontSize: '0.68rem', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>1 selected</span>}
                    </div>
                    {goldCards.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.83rem', margin: 0 }}>No gold cards yet — create them in the Cards section.</p>
                    ) : (
                        <div className="popup-cards-grid">
                            {goldCards.map((c: PricingCard) => (
                                <SelectorCard key={c.id} card={c} selected={selectedGold === c.id}
                                    onToggle={() => setSelectedGold(selectedGold === c.id ? null : c.id)} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Summary bar */}
                <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', marginBottom: 20, border: '1px solid #e3e8ef', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Selection:</span>
                    <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '3px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>✓ Basic</span>
                    {selectedSilver
                        ? <span style={{ background: '#ede7f6', color: '#5e35b1', padding: '3px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>🥈 {silverCards.find((c: PricingCard) => c.id === selectedSilver)?.name}</span>
                        : <span style={{ background: '#f1f5f9', color: '#94a3b8', padding: '3px 12px', borderRadius: 20, fontSize: '0.78rem' }}>🥈 No Silver</span>
                    }
                    {selectedGold
                        ? <span style={{ background: '#fff8e1', color: '#f57f17', padding: '3px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>🥇 {goldCards.find((c: PricingCard) => c.id === selectedGold)?.name}</span>
                        : <span style={{ background: '#f1f5f9', color: '#94a3b8', padding: '3px 12px', borderRadius: 20, fontSize: '0.78rem' }}>🥇 No Gold</span>
                    }
                </div>

                {/* Action buttons */}
                <div className="modal-footer">
                    <button className="berry-btn-primary" style={{ flex: 1, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                        onClick={() => onSave(selectedSilver, selectedGold)}>
                        <FiCheck /> Apply Card Selection
                    </button>
                    <button className="berry-btn-outline" style={{ flex: 1, padding: '14px', borderColor: '#ffccbc', color: '#d84315' }} onClick={onClose}>Cancel</button>
                </div>
            </motion.div>
        </div>
    );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
// ── Image compression utility ─────────────────────────────────────────────
// Resizes to max 900px and compresses to JPEG 70% — reduces 3-8MB images to ~80-150KB
function compressImage(file: File, maxSize = 900, quality = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas');
            canvas.width  = Math.round(img.width  * scale);
            canvas.height = Math.round(img.height * scale);
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = url;
    });
}

export default function AdminProductsPage() {
    const dispatch = useAppDispatch();
    const { items: projects, status: pStatus } = useAppSelector(state => state.products);
    const { items: categories, status: cStatus } = useAppSelector(state => state.categories);
    const { cards: pricingCards, basicCard } = useAppSelector(s => (s as any).pricingCards);

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showManageCategories, setShowManageCategories] = useState(false);
    const [showIconDropdown, setShowIconDropdown] = useState(false);
    const [showCardPopup, setShowCardPopup] = useState(false);

    const [editProject, setEditProject] = useState<Product | null>(null);
    const [form, setForm] = useState<Partial<Product>>({});
    const [categoryForm, setCategoryForm] = useState<Partial<Category>>({});

    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
    const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);

    const [maximizedImage, setMaximizedImage] = useState<{ index: number; images: string[] } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts());
        dispatch(fetchPricingCards() as any);
        dispatch(fetchBasicCard() as any);
    }, [dispatch]);

    useEffect(() => {
        if (form.price && form.originalPrice && form.originalPrice > form.price) {
            const newDiscount = Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100);
            if (form.discount !== newDiscount) {
                setForm(p => ({ ...p, discount: newDiscount }));
            }
        }
    }, [form.price, form.originalPrice, form.discount]);

    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const compressed = await compressImage(file);
            setForm(p => ({ ...p, mainImage: compressed }));
        } catch {
            toast.error('Failed to process image. Try a different file.');
        }
    };

    const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0 && (files.length < 2 || files.length > 10)) {
            toast.error('Please upload between 2 and 10 images.');
            e.target.value = '';
            return;
        }
        const toastId = toast.loading('Compressing images...');
        Promise.all(files.map(file => compressImage(file)))
            .then(compressed => {
                setForm((p: any) => ({ ...p, images: [...(p.images || []), ...compressed].slice(0, 10) }));
                toast.success('Images added!', { id: toastId });
            })
            .catch(() => toast.error('Image processing failed.', { id: toastId }));
    };

    const itemsPerPage = 8;
    const filtered = projects.filter((p: Product) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || p.category === filter;
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedProducts = [...filtered]
        .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const openEdit = (p: Product) => { setEditProject(p); setForm({ ...p }); setShowForm(true); };
    const openNew = () => { setEditProject(null); setForm({}); setShowForm(true); };

    const handleSave = async () => {
        if (!form.title || !form.price || !form.category || !form.description) {
            toast.error('Please fill in title, price, category and description.');
            return;
        }
        // Resolve category to its numeric ID — form.category is the category name string
        const catObj = categories.find(c => c.name === form.category || String(c.id) === String(form.category));
        const categoryId = catObj ? Number(catObj.id) : null;

        if (!categoryId) {
            toast.error('Could not resolve the selected category. Please re-select it.');
            return;
        }

        // Build a clean payload with the numeric category ID
        const payload: any = {
            ...form,
            category: categoryId,
        };

        try {
            if (editProject) {
                await dispatch(updateProductThunk(payload)).unwrap();
                toast.success('Product updated!');
            } else {
                await dispatch(addProductThunk(payload)).unwrap();
                toast.success('Product added successfully!');
            }
            setShowForm(false);
            setForm({});
        } catch (err: any) {
            const msg = err?.message || err?.toString() || 'Error saving product';
            toast.error(`❌ ${msg}`);
            console.error('[Product Save Error]', err);
        }
    };

    const handleSaveCategory = async () => {
        if (!categoryForm.name || !categoryForm.icon) { toast.error('Name and Icon are required'); return; }
        try {
            await dispatch(addCategoryThunk({
                name: categoryForm.name,
                icon: categoryForm.icon,
                slug: categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            })).unwrap();
            toast.success('Category added!');
            setShowCategoryForm(false);
            setCategoryForm({});
        } catch (err: any) { toast.error(err.message || 'Error adding category'); }
    };

    const executeDeleteProduct = async () => {
        if (deleteProductId !== null) {
            try {
                await dispatch(deleteProductThunk(deleteProductId)).unwrap();
                toast.success('Product deleted');
                setDeleteProductId(null);
            } catch { toast.error('Delete failed'); }
        }
    };

    const executeDeleteCategory = async () => {
        if (deleteCategoryId !== null) {
            try {
                await dispatch(deleteCategoryThunk(deleteCategoryId)).unwrap();
                toast.success('Category removed');
                setDeleteCategoryId(null);
            } catch { toast.error('Failed to delete category'); }
        }
    };

    // Derive assigned card names for display in product form
    const assignedSilverCard = pricingCards.find((c: PricingCard) => c.id === form.silverCard);
    const assignedGoldCard = pricingCards.find((c: PricingCard) => c.id === form.goldCard);

    if (pStatus === 'loading' || cStatus === 'loading') return (
        <div style={{ padding: 24 }}>
            <div className="berry-card" style={{ opacity: 0.6 }}>
                <div style={{ height: 32, width: '40%', backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 16 }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} style={{ height: 320, backgroundColor: '#f5f5f5', borderRadius: 16 }} />)}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <AnimatePresence>
                {/* CATEGORY MODAL */}
                {showCategoryForm && (
                    <div key="category-modal" className="modal-overlay" style={{ zIndex: 11000 }}>
                        <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} className="berry-card modal-container" style={{ maxWidth: 450 }}>
                            <div className="modal-header">
                                <h3>New Category</h3>
                                <button onClick={() => setShowCategoryForm(false)} className="close-btn"><FiX /></button>
                            </div>
                            <div className="field-group">
                                <label className="input-label">Name</label>
                                <input className="berry-input" placeholder="e.g. Booking Systems" onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} />
                            </div>
                            <div className="field-group">
                                <label className="input-label">Select Business Icon</label>
                                <div className="icon-dropdown-box">
                                    <button className="berry-input dropdown-trigger" onClick={() => setShowIconDropdown(!showIconDropdown)}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            {categoryForm.icon ? renderIcon(categoryForm.icon) : <FiBox />}
                                            {categoryForm.icon || 'Choose business icon'}
                                        </span>
                                        <FiChevronDown />
                                    </button>
                                    {showIconDropdown && (
                                        <div className="icon-grid-dropdown">
                                            {BUSINESS_ICONS.map(key => (
                                                <button key={key} onClick={() => { setCategoryForm({ ...categoryForm, icon: key }); setShowIconDropdown(false); }} title={key} className={`icon-item ${categoryForm.icon === key ? 'active' : ''}`}>
                                                    {renderIcon(key)}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="berry-btn-primary" onClick={handleSaveCategory}>Create Category</button>
                                <button className="berry-btn-outline" style={{ borderColor: '#ffccbc', color: '#d84315' }} onClick={() => setShowCategoryForm(false)}>Cancel</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* PRODUCT MODAL */}
                {showForm && (
                    <div key="product-modal" className="modal-overlay" style={{ zIndex: 10000 }}>
                        <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} className="berry-card modal-container" style={{ maxWidth: 850 }}>
                            <div className="modal-header">
                                <h3>{editProject ? 'Edit Project' : 'Add New Project'}</h3>
                                <button onClick={() => setShowForm(false)} className="close-btn"><FiX /></button>
                            </div>
                            <div className="berry-form-grid-2">
                                <div className="field-group">
                                    <label className="input-label">Project Title</label>
                                    <input className="berry-input" placeholder="e.g. Finance App Dashboard" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} />
                                </div>
                                <div className="field-group">
                                    <label className="input-label">Category</label>
                                    <select className="berry-input" value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        <option value="">Select Category</option>
                                        {categories.map((c: Category) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="input-label">Short Description</label>
                                <textarea className="berry-input" style={{ height: 100, paddingTop: 12 }} placeholder="Briefly describe the product features..."
                                    value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
                            </div>

                            <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#121926' }}>
                                    <input type="checkbox" checked={!!form.isNew} onChange={e => setForm({ ...form, isNew: e.target.checked })} /> New
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#121926' }}>
                                    <input type="checkbox" checked={!!form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> Featured
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#121926' }}>
                                    <input type="checkbox" checked={!!form.popular} onChange={e => setForm({ ...form, popular: e.target.checked })} /> Popular
                                </label>
                            </div>

                            <div className="field-group">
                                <label className="input-label">Landing Page Image (Main)</label>
                                <div className="upload-preview-box" onClick={() => document.getElementById('lp-upload')?.click()}>
                                    {form.mainImage ? <img src={form.mainImage} className="full-cover" /> : <><FiPlus size={32} /><span className="sub-text">Upload landing page image</span></>}
                                    <input id="lp-upload" type="file" hidden accept="image/*" onChange={handleMainImageUpload} />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="input-label">Gallery (2-10 Images)</label>
                                <div className="gallery-upload-grid">
                                    {form.images?.map((img, idx) => (
                                        <div key={idx} className="gallery-item-admin" onClick={() => setMaximizedImage({ index: idx, images: form.images || [] })}>
                                            <img src={img} />
                                            <button onClick={(e) => { e.stopPropagation(); setForm({ ...form, images: form.images?.filter((_, i) => i !== idx) }); }} className="del-img"><FiTrash2 /></button>
                                        </div>
                                    ))}
                                    {(!form.images || form.images.length < 10) && (
                                        <button className="add-gallery-btn" onClick={() => document.getElementById('gal-upload')?.click()}><FiPlus /></button>
                                    )}
                                    <input id="gal-upload" type="file" hidden multiple accept="image/*" onChange={handleImagesUpload} />
                                </div>
                            </div>

                            <div className="berry-form-grid-3">
                                <div className="field-group">
                                    <label className="input-label">Price (₹)</label>
                                    <input type="number" className="berry-input" value={form.price || ''} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
                                </div>
                                <div className="field-group">
                                    <label className="input-label">Actual Price (₹)</label>
                                    <input type="number" className="berry-input" value={form.originalPrice || ''} onChange={e => setForm({ ...form, originalPrice: Number(e.target.value) })} />
                                </div>
                                <div className="field-group">
                                    <label className="input-label">Discount (%)</label>
                                    <input type="number" className="berry-input" value={form.discount || 0} readOnly style={{ background: '#f8fafc' }} />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="input-label">Technologies Used (Comma separated)</label>
                                <div style={{ position: 'relative' }}>
                                    <input className="berry-input"
                                        value={form.tech_input ?? (form.tech || []).join(', ')}
                                        onChange={e => {
                                            const val = e.target.value;
                                            const techs = val.split(',').map(s => s.trim()).filter(Boolean);
                                            setForm({ ...form, tech_input: val, tech: techs });
                                        }}
                                        placeholder="e.g. Next.js, React, Tailwind, Framer Motion"
                                        style={{ paddingRight: 40 }}
                                    />
                                    <FiSettings style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                                </div>
                            </div>

                            {/* ======= ADD CARDS BUTTON ======= */}
                            <div className="field-group" style={{ marginBottom: 24 }}>
                                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <FiCreditCard /> Pricing Cards
                                </label>

                                {/* Current assignment preview */}
                                <div className="assigned-cards-preview">
                                    <div className="assigned-card-chip basic">
                                        <FiAward size={13} />
                                        Basic {basicCard ? `– ₹${Number(basicCard.price).toLocaleString('en-IN')}` : ''}
                                        <span className="chip-auto-tag">Auto</span>
                                    </div>
                                    <div className={`assigned-card-chip silver ${assignedSilverCard ? 'active' : 'empty'}`}>
                                        🥈 {assignedSilverCard ? `${assignedSilverCard.name} – ₹${Number(assignedSilverCard.price).toLocaleString('en-IN')}` : 'No Silver'}
                                    </div>
                                    <div className={`assigned-card-chip gold ${assignedGoldCard ? 'active' : 'empty'}`}>
                                        🥇 {assignedGoldCard ? `${assignedGoldCard.name} – ₹${Number(assignedGoldCard.price).toLocaleString('en-IN')}` : 'No Gold'}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="assign-cards-btn"
                                    onClick={() => setShowCardPopup(true)}
                                >
                                    <FiCreditCard style={{ marginRight: 8 }} />
                                    {(form.silverCard || form.goldCard) ? 'Change Cards' : 'Assign Cards'}
                                </button>
                            </div>

                            <div className="modal-footer">
                                <button className="berry-btn-primary" style={{ flex: 1, padding: '14px' }} onClick={handleSave}>{editProject ? 'Update Product' : 'Create Product'}</button>
                                <button className="berry-btn-outline" style={{ flex: 1, padding: '14px', borderColor: '#ffccbc', color: '#d84315' }} onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* CARD ASSIGNMENT POPUP - rendered inside AnimatePresence */}
                {showCardPopup && (
                    <CardAssignmentPopup
                        key="card-popup"
                        silverCardId={form.silverCard ?? null}
                        goldCardId={form.goldCard ?? null}
                        onSave={(silver, gold) => {
                            setForm(p => ({ ...p, silverCard: silver, goldCard: gold }));
                            setShowCardPopup(false);
                            toast.success('Cards assigned!');
                        }}
                        onClose={() => setShowCardPopup(false)}
                    />
                )}

                {/* MANAGE CATEGORIES MODAL */}
                {showManageCategories && (
                    <div key="manage-categories-modal" className="modal-overlay" style={{ zIndex: 11000 }}>
                        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="berry-card modal-container" style={{ maxWidth: 500 }}>
                            <div className="modal-header">
                                <h3>Manage Categories</h3>
                                <button onClick={() => setShowManageCategories(false)} className="close-btn"><FiX /></button>
                            </div>
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {categories.map(c => (
                                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #e3e8ef' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontSize: '1.2rem', color: '#5e35b1' }}>{renderIcon(c.icon)}</span>
                                            <span style={{ fontWeight: 500 }}>{c.name}</span>
                                        </div>
                                        <button onClick={() => setDeleteCategoryId(Number(c.id))} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><FiTrash2 /></button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%' }}
            >
                <div className="berry-animate-in">
                    <div className="berry-card">
                        <h2 className="berry-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiBox /> Product Management</h2>

                        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: 1, minWidth: 300 }}>
                                <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 450 }}>
                                    <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input className="berry-input" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search title..." style={{ paddingLeft: 36 }} />
                                </div>
                                <select className="berry-input" value={filter} onChange={e => { setFilter(e.target.value); setCurrentPage(1); }} style={{ width: 'auto', minWidth: 200 }}>
                                    <option value="all">All Categories</option>
                                    {categories.map((c: Category) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                <button className="berry-btn-outline" onClick={() => setShowManageCategories(true)} style={{ borderColor: '#c2185b', color: '#c2185b' }}>Categories</button>
                                <button className="berry-btn-primary" onClick={() => setShowCategoryForm(true)} style={{ background: '#364152' }}>+ Category</button>
                                <button className="berry-btn-primary" onClick={openNew}>+ Product</button>
                            </div>
                        </div>

                        <div className="berry-table-container">
                            <table className="berry-table">
                                <thead>
                                    <tr>
                                        <th>Preview</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Cards</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedProducts.map((p) => {
                                        const sc = pricingCards.find((c: PricingCard) => c.id === p.silverCard);
                                        const gc = pricingCards.find((c: PricingCard) => c.id === p.goldCard);
                                        return (
                                            <tr key={p.id}>
                                                <td>{p.mainImage ? <img src={p.mainImage} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} /> : <FiBox size={24} />}</td>
                                                <td><div style={{ fontWeight: 600 }}>{p.title}</div><div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{p.slug}</div></td>
                                                <td><span className="berry-badge info">{p.category}</span></td>
                                                <td>₹{p.price.toLocaleString()}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                                        <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '2px 7px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 600 }}>B</span>
                                                        {sc && <span style={{ background: '#ede7f6', color: '#5e35b1', padding: '2px 7px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 600 }}>🥈</span>}
                                                        {gc && <span style={{ background: '#fff8e1', color: '#f57f17', padding: '2px 7px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 600 }}>🥇</span>}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <button onClick={() => openEdit(p)} className="berry-btn-outline" style={{ padding: '4px 8px' }}>Edit</button>
                                                        <button onClick={() => setDeleteProductId(Number(p.id))} className="berry-btn-outline" style={{ padding: '4px 8px', color: '#ef4444', borderColor: '#ef4444' }}>Del</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 8 }}>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? 'berry-btn-primary' : 'berry-btn-outline'} style={{ minWidth: 40 }}>{i + 1}</button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <ConfirmModal isOpen={deleteProductId !== null} title="Delete Product" message="Are you sure you want to delete this product? This action cannot be undone." onConfirm={executeDeleteProduct} onCancel={() => setDeleteProductId(null)} />
            <ConfirmModal isOpen={deleteCategoryId !== null} title="Delete Category" message="Are you sure? Products assigned to this category will lose their association." onConfirm={executeDeleteCategory} onCancel={() => setDeleteCategoryId(null)} />

        </>
    );
}
