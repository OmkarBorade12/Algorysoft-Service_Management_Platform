'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { addProductThunk, updateProductThunk, deleteProductThunk, Product, fetchProducts } from '@/store/slices/productsSlice';
import { addCategoryThunk, deleteCategoryThunk, Category, fetchCategories } from '@/store/slices/categoriesSlice';
import ConfirmModal from '@/components/ui/ConfirmModal';
import * as FiIcons from 'react-icons/fi';
import { 
    FiBox, FiSearch, FiList, FiPlus, FiEdit2, FiCheck, FiSettings, 
    FiChevronDown, FiX, FiTrash2, FiMaximize2, FiChevronLeft, FiChevronRight,
    FiBriefcase, FiShoppingBag, FiShoppingCart, FiCreditCard, FiDollarSign,
    FiPieChart, FiBarChart2, FiTrendingUp, FiActivity, FiGlobe, FiCloud,
    FiDatabase, FiMonitor, FiSmartphone, FiCpu, FiHash, FiLayout, FiGrid,
    FiLayers, FiPackage, FiTruck, FiMapPin, FiUsers, FiClock, FiShield
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Expanded list from user's manual edit + my business focused ones
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
}

export default function AdminProductsPage() {
    const dispatch = useAppDispatch();
    const { items: projects, status: pStatus } = useAppSelector(state => state.products);
    const { items: categories, status: cStatus } = useAppSelector(state => state.categories);

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showManageCategories, setShowManageCategories] = useState(false);
    const [showIconDropdown, setShowIconDropdown] = useState(false);
    
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
    }, [dispatch]);

    useEffect(() => {
        if (form.price && form.originalPrice && form.originalPrice > form.price) {
            const newDiscount = Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100);
            if (form.discount !== newDiscount) {
                setForm(p => ({ ...p, discount: newDiscount }));
            }
        }
    }, [form.price, form.originalPrice, form.discount]);

    const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(p => ({ ...p, mainImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0 && (files.length < 2 || files.length > 10)) {
            toast.error('Please upload between 2 and 10 images.');
            e.target.value = ''; 
            return;
        }
        
        Promise.all(files.map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        })).then(base64Images => {
            setForm((p: any) => ({ ...p, images: [...(form.images || []), ...base64Images].slice(0, 10) }));
        });
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

        const catObj = categories.find(c => c.name === form.category);
        const payload = { 
            ...form, 
            category: catObj ? catObj.id : (typeof form.category === 'number' ? form.category : 1)
        } as any;

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
            toast.error(err.message || 'Error saving product');
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
        } catch (err: any) {
            toast.error(err.message || 'Error adding category');
        }
    };

    const executeDeleteProduct = async () => {
        if (deleteProductId !== null) {
            try {
                await dispatch(deleteProductThunk(deleteProductId)).unwrap();
                toast.success('Product deleted');
                setDeleteProductId(null);
            } catch (err: any) {
                toast.error('Delete failed');
            }
        }
    };

    const executeDeleteCategory = async () => {
        if (deleteCategoryId !== null) {
            try {
                await dispatch(deleteCategoryThunk(deleteCategoryId)).unwrap();
                toast.success('Category removed');
                setDeleteCategoryId(null);
            } catch (err: any) {
                toast.error('Failed to delete category');
            }
        }
    };

    if (pStatus === 'loading' || cStatus === 'loading') return (
        <div style={{ padding: 24 }}>
            <div className="berry-card" style={{ opacity: 0.6 }}>
                <div style={{ height: 32, width: '40%', backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 16 }} />
                <div style={{ height: 16, width: '60%', backgroundColor: '#f0f0f0', borderRadius: 6, marginBottom: 32 }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} style={{ height: 320, backgroundColor: '#f5f5f5', borderRadius: 16 }} />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <AnimatePresence>
                {/* CATEGORY MODAL */}
                {showCategoryForm && (
                    <div className="modal-overlay">
                        <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} className="berry-card modal-container" style={{ maxWidth: 450 }}>
                            <div className="modal-header">
                                <h3>New Category</h3>
                                <button onClick={() => setShowCategoryForm(false)} className="close-btn"><FiX /></button>
                            </div>
                            <div className="field-group">
                                <label className="input-label">Name</label>
                                <input className="berry-input" placeholder="e.g. Booking Systems" onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} />
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
                                                <button key={key} onClick={() => { setCategoryForm({...categoryForm, icon: key}); setShowIconDropdown(false); }} title={key} className={`icon-item ${categoryForm.icon === key ? 'active' : ''}`}>
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
                    <div className="modal-overlay">
                        <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} className="berry-card modal-container" style={{ maxWidth: 850 }}>
                            <div className="modal-header">
                                <h3>{editProject ? 'Edit Project' : 'Add New Project'}</h3>
                                <button onClick={() => setShowForm(false)} className="close-btn"><FiX /></button>
                            </div>
                            <div className="berry-form-grid-2">
                                <div className="field-group">
                                    <label className="input-label">Project Title</label>
                                    <input className="berry-input" placeholder="e.g. Finance App Dashboard" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} />
                                </div>
                                <div className="field-group">
                                    <label className="input-label">Category</label>
                                    <select className="berry-input" value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})}>
                                        <option value="">Select Category</option>
                                        {categories.map((c: Category) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="input-label">Short Description</label>
                                <textarea 
                                    className="berry-input" 
                                    style={{ height: 100, paddingTop: 12 }} 
                                    placeholder="Briefly describe the product features..." 
                                    value={form.description || ''} 
                                    onChange={e => setForm({...form, description: e.target.value})} 
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#121926' }}>
                                    <input type="checkbox" checked={!!form.isNew} onChange={e => setForm({...form, isNew: e.target.checked})} /> New
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#121926' }}>
                                    <input type="checkbox" checked={!!form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> Featured
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#121926' }}>
                                    <input type="checkbox" checked={!!form.popular} onChange={e => setForm({...form, popular: e.target.checked})} /> Popular
                                </label>
                            </div>
                            
                            <div className="field-group">
                                <label className="input-label">Landing Page Image (Main)</label>
                                <div className="upload-preview-box" onClick={() => document.getElementById('lp-upload')?.click()}>
                                    {form.mainImage ? <img src={form.mainImage} className="full-cover" /> : <><FiPlus size={32}/><span className="sub-text">Upload landing page image</span></>}
                                    <input id="lp-upload" type="file" hidden accept="image/*" onChange={handleMainImageUpload} />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="input-label">Gallery (2-10 Images)</label>
                                <div className="gallery-upload-grid">
                                    {form.images?.map((img, idx) => (
                                        <div key={idx} className="gallery-item-admin" onClick={() => setMaximizedImage({ index: idx, images: form.images || [] })}>
                                            <img src={img} />
                                            <button onClick={(e) => { e.stopPropagation(); setForm({...form, images: form.images?.filter((_, i) => i !== idx)}); }} className="del-img"><FiTrash2 /></button>
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
                                    <input type="number" className="berry-input" value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})} />
                                </div>
                                <div className="field-group">
                                    <label className="input-label">Actual Price (₹)</label>
                                    <input type="number" className="berry-input" value={form.originalPrice || ''} onChange={e => setForm({...form, originalPrice: Number(e.target.value)})} />
                                </div>
                                <div className="field-group">
                                    <label className="input-label">Discount (%)</label>
                                    <input type="number" className="berry-input" value={form.discount || 0} readOnly style={{ background: '#f8fafc' }} />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="input-label">Technologies Used (Comma separated)</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        className="berry-input" 
                                        value={form.tech_input ?? (form.tech || []).join(', ')} 
                                        onChange={e => {
                                            const val = e.target.value;
                                            const techs = val.split(',').map(s => s.trim()).filter(Boolean);
                                            setForm({...form, tech_input: val, tech: techs});
                                        }} 
                                        placeholder="e.g. Next.js, React, Tailwind, Framer Motion"
                                        style={{ paddingRight: 40 }}
                                    />
                                    <FiSettings style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="berry-btn-primary" style={{ flex: 1, padding: '14px' }} onClick={handleSave}>{editProject ? 'Update Product' : 'Create Product'}</button>
                                <button className="berry-btn-outline" style={{ flex: 1, padding: '14px', borderColor: '#ffccbc', color: '#d84315' }} onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* MANAGE CATEGORIES MODAL */}
                {showManageCategories && (
                    <div className="modal-overlay">
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
                        <input className="berry-input" value={search} onChange={e => {setSearch(e.target.value); setCurrentPage(1);}} placeholder="Search title..." style={{ paddingLeft: 36 }} />
                    </div>
                    <select className="berry-input" value={filter} onChange={e => {setFilter(e.target.value); setCurrentPage(1);}} style={{ width: 'auto', minWidth: 200 }}>
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProducts.map((p) => (
                            <tr key={p.id}>
                                <td>{p.mainImage ? <img src={p.mainImage} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} /> : <FiBox size={24} />}</td>
                                <td><div style={{ fontWeight: 600 }}>{p.title}</div><div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{p.slug}</div></td>
                                <td><span className="berry-badge info">{p.category}</span></td>
                                <td>₹{p.price.toLocaleString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => openEdit(p)} className="berry-btn-outline" style={{ padding: '4px 8px' }}>Edit</button>
                                        <button onClick={() => setDeleteProductId(Number(p.id))} className="berry-btn-outline" style={{ padding: '4px 8px', color: '#ef4444', borderColor: '#ef4444' }}>Del</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 8 }}>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button key={i} onClick={() => setCurrentPage(i + 1)} className={currentPage === i+1 ? 'berry-btn-primary' : 'berry-btn-outline'} style={{ minWidth: 40 }}>{i + 1}</button>
                    ))}
                </div>
            )}
            </div>
            </div>
            </motion.div>

            <ConfirmModal 
                isOpen={deleteProductId !== null} 
                title="Delete Product" 
                message="Are you sure you want to delete this product? This action cannot be undone." 
                onConfirm={executeDeleteProduct} 
                onCancel={() => setDeleteProductId(null)} 
            />
            <ConfirmModal 
                isOpen={deleteCategoryId !== null} 
                title="Delete Category" 
                message="Are you sure? Products assigned to this category will lose their association." 
                onConfirm={executeDeleteCategory} 
                onCancel={() => setDeleteCategoryId(null)} 
            />

            <style jsx>{`
                .modal-overlay { position: fixed; inset: 0; background: rgba(18,25,38,0.6); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: flex-start; z-index: 10000; padding: 100px 20px 60px; overflow-y: auto; }
                .modal-container { border: none; box-shadow: 0 40px 100px rgba(0,0,0,0.3); width: 100%; position: relative; margin-bottom: 60px; }
                .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .modal-header h3 { margin: 0; font-size: 1.5rem; color: #121926; }
                .close-btn { background: #f1f5f9; border: none; width: 36px; height: 36px; border-radius: 10px; cursor: pointer; color: #64748b; }
                .input-label { display: block; font-size: 0.85rem; font-weight: 600; color: #364152; margin-bottom: 8px; }
                .field-group { margin-bottom: 20px; }
                .modal-footer { display: flex; gap: 16px; margin-top: 32px; }
                
                .icon-dropdown-box { position: relative; }
                .dropdown-trigger { background: #fff; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
                .icon-grid-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid #e3e8ef; border-radius: 12px; margin-top: 8px; z-index: 1200; padding: 8px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-height: 200px; overflow-y: auto; }
                .icon-item { height: 40px; display: flex; align-items: center; justify-content: center; border: none; background: transparent; border-radius: 8px; cursor: pointer; font-size: 1.4rem; color: #64748b; }
                .icon-item:hover { background: #f8fafc; color: #5e35b1; transform: scale(1.1); }
                .icon-item.active { background: #ede7f6; color: #5e35b1; }

                .upload-preview-box { width: 100%; height: 180px; border: 2px dashed #e3e8ef; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; background: #f8fafc; overflow: hidden; position: relative; }
                .full-cover { width: 100%; height: 100%; object-fit: cover; }
                .sub-text { font-size: 0.85rem; color: #94a3b8; margin-top: 8px; }
                
                .gallery-upload-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 10px; }
                .gallery-item-admin { height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid #e3e8ef; position: relative; }
                .gallery-item-admin img { width: 100%; height: 100%; object-fit: cover; cursor: zoom-in; }
                .del-img { position: absolute; top: 4px; right: 4px; background: rgba(239, 68, 68, 0.8); border: none; color: #fff; border-radius: 4px; padding: 2px; cursor: pointer; }
                .add-gallery-btn { height: 80px; border: 2px dashed #cbd5e1; border-radius: 8px; background: #f8fafc; cursor: pointer; color: #64748b; }

                .lightroom-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 2000; display: flex; align-items: center; justify-content: center; }
                .lr-container { position: relative; width: 90vw; height: 80vh; display: flex; align-items: center; justify-content: center; flex-direction: column; }
                .lr-image { max-width: 100%; max-height: 100%; border-radius: 8px; object-fit: contain; }
                .lr-close { position: absolute; top: 20px; right: 20px; color: #fff; background: transparent; border: none; cursor: pointer; }
                .lr-nav { position: absolute; width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.1); border: none; color: #fff; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; }
                .lr-nav.left { left: 0; }
                .lr-nav.right { right: 0; }
                .lr-actions { margin-top: 24px; }
                .lr-btn { background: #5e35b1; color: #fff; border: none; padding: 10px 20px; border-radius: 12px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; }
            `}</style>
        </>
    );
}
