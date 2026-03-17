'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { addProduct, updateProduct, deleteProduct, Product } from '@/store/slices/productsSlice';
import { addCategory, deleteCategory, Category } from '@/store/slices/categoriesSlice';
import ConfirmModal from '@/components/ui/ConfirmModal';
import * as FiIcons from 'react-icons/fi';
import { FiBox, FiSearch, FiList, FiPlus, FiEdit2, FiCheck, FiSettings, FiChevronDown } from 'react-icons/fi';

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
const BUSINESS_ICONS = RECOMMENDED_ICONS.filter(k => (FiIcons as any)[k]) as (keyof typeof FiIcons)[];

const renderIcon = (iconStr: string) => {
    if (!iconStr) return <FiIcons.FiBox />;
    if (iconStr.startsWith('Fi') && FiIcons[iconStr as keyof typeof FiIcons]) {
        const IconComponent = FiIcons[iconStr as keyof typeof FiIcons];
        return <IconComponent />;
    }
    return <span>{iconStr}</span>;
}

export default function AdminProductsPage() {
    const dispatch = useAppDispatch();
    const projects = useAppSelector((state) => state.products.items);
    const categories = useAppSelector((state) => state.categories.items);

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

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (form.price && form.originalPrice && form.originalPrice > form.price) {
            const newDiscount = Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100);
            if (form.discount !== newDiscount) {
                setForm((p: any) => ({ ...p, discount: newDiscount }));
            }
        } else if (form.discount !== 0 && (form.price || form.originalPrice)) {
            setForm((p: any) => ({ ...p, discount: 0 }));
        }
    }, [form.price, form.originalPrice, form.discount]);

    const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setForm((p: any) => ({ ...p, mainImage: reader.result as string }));
            reader.readAsDataURL(file);
        }
    };

    const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0 && (files.length < 2 || files.length > 10)) {
            toast.error('Please upload between 2 and 10 images.');
            e.target.value = ''; // Reset input
            return;
        }
        
        Promise.all(files.map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        })).then(base64Images => {
            setForm((p: any) => ({ ...p, images: base64Images }));
        });
    };
    const itemsPerPage = 8;

    const filtered = projects.filter((p: Product) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || p.category === filter;
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const currentProducts = filtered.sort((a: Product, b: Product) => (b.id || 0) - (a.id || 0));
    const paginatedProducts = currentProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const openEdit = (p: Product) => { setEditProject(p); setForm({ ...p }); setShowForm(true); };
    const openNew = () => { setEditProject(null); setForm({}); setShowForm(true); };

    const handleSave = () => {
        if (!form.title || !form.price || !form.category) { toast.error('Required fields missing'); return; }
        
        if (editProject) {
            dispatch(updateProduct({ ...form, id: editProject.id } as Product));
            toast.success('Product updated!');
        } else {
            const newP: Product = {
                ...form,
                id: Date.now(),
                slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                views: 0,
                isNew: true
            } as Product;
            dispatch(addProduct(newP));
            toast.success('Product added!');
        }
        setShowForm(false);
    };

    const executeDeleteProduct = () => {
        if (deleteProductId !== null) {
            dispatch(deleteProduct(deleteProductId));
            toast.success('Product deleted');
            setDeleteProductId(null);
        }
    };

    const executeDeleteCategory = () => {
        if (deleteCategoryId !== null) {
            dispatch(deleteCategory(deleteCategoryId));
            toast.success('Category deleted');
            setDeleteCategoryId(null);
        }
    };

    const handleSaveCategory = () => {
        if (!categoryForm.name || !categoryForm.icon) { toast.error('Name and icon required'); return; }
        const slug = categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const newCat: Category = {
            id: Date.now(),
            name: categoryForm.name,
            icon: categoryForm.icon,
            slug,
            count: 0
        };
        dispatch(addCategory(newCat));
        toast.success('Category added!');
        setShowCategoryForm(false);
        setCategoryForm({});
    };

    return (
        <div className="berry-card">
            <h2 className="berry-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiBox /> Product Management</h2>
            
            {/* Controls */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: 1 }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 400 }}>
                        <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#697586' }} />
                        <input className="berry-input" value={search} onChange={e => {setSearch(e.target.value); setCurrentPage(1);}} placeholder="Search product title..." style={{ width: '100%', paddingLeft: 36 }} />
                    </div>
                    <select className="berry-input" value={filter} onChange={e => {setFilter(e.target.value); setCurrentPage(1);}} style={{ width: 220 }}>
                        <option value="all">All Categories</option>
                        {categories.map((c: Category) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                    <button className="berry-btn-outline" onClick={() => setShowManageCategories(true)} style={{ padding: '12px 24px', borderColor: '#c2185b', color: '#c2185b', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FiSettings /> Manage Categories
                    </button>
                    <button className="berry-btn-primary" onClick={() => setShowCategoryForm(true)} style={{ padding: '12px 24px', background: '#364152', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FiPlus /> Add Category
                    </button>
                    <button className="berry-btn-primary" onClick={openNew} style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FiPlus /> Add Product
                    </button>
                </div>
            </div>

            <p style={{ color: '#697586', fontSize: '0.9rem', marginBottom: 16 }}>Showing {filtered.length} products</p>

            <div className="berry-table-container" style={{ marginBottom: 24 }}>
                <table className="berry-table">
                    <thead>
                        <tr>
                            <th>Icon</th>
                            <th>Title & Slug</th>
                            <th>Category</th>
                            <th>Price / Original</th>
                            <th>Discount</th>
                            <th>Badges</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProducts.map((p: Product) => (
                            <tr key={p.id}>
                                <td style={{ fontSize: '1.8rem', textAlign: 'center' }}>{p.icon}</td>
                                <td>
                                    <div style={{ fontWeight: 600, color: '#121926' }}>{p.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#697586' }}>/{p.slug}</div>
                                </td>
                                <td><span className="berry-badge info" style={{ whiteSpace: 'nowrap' }}>{p.category}</span></td>
                                <td>
                                    <div style={{ fontWeight: 700, color: '#5e35b1' }}>₹{p.price.toLocaleString('en-IN')}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#697586', textDecoration: 'line-through' }}>₹{p.originalPrice.toLocaleString('en-IN')}</div>
                                </td>
                                <td><span className="berry-badge warning">-{p.discount}%</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        {p.isNew && <span className="berry-badge success" style={{ padding: '2px 6px' }}>NEW</span>}
                                        {p.popular && <span className="berry-badge" style={{ background: '#fff3e0', color: '#e65100', padding: '2px 6px' }}>POPULAR</span>}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => openEdit(p)} className="berry-btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#1565c0', borderColor: '#1565c0' }}>Edit</button>
                                        <button onClick={() => setDeleteProductId(p.id as number)} className="berry-btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#c2185b', borderColor: '#c2185b' }}>Del</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))} 
                        disabled={currentPage === 1}
                        className="berry-btn-outline" 
                        style={{ padding: '8px 16px' }}
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentPage(i + 1)}
                            className={currentPage === i + 1 ? 'berry-btn-primary' : 'berry-btn-outline'}
                            style={{ padding: '8px 16px', minWidth: 40 }}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button 
                        onClick={() => setCurrentPage((prev: number) => Math.min(totalPages, prev + 1))} 
                        disabled={currentPage === totalPages}
                        className="berry-btn-outline" 
                        style={{ padding: '8px 16px' }}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modals */}
            {showForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(18,25,38,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
                    <div className="berry-card" style={{ maxWidth: 640, width: '100%', margin: 0, animation: 'fadeInUp 0.3s ease', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 style={{ margin: 0, color: '#121926', display: 'flex', alignItems: 'center', gap: 8 }}>
                                {editProject ? <><FiEdit2 /> Edit Product</> : <><FiPlus /> New Product</>}
                            </h2>
                            <button onClick={() => setShowForm(false)} style={{ background: '#f8fafc', border: '1px solid #e3e8ef', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#697586' }}>✕</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Product Title *</label>
                                <input className="berry-input" value={form.title || ''} onChange={(e: any) => setForm((p: any) => ({ ...p, title: e.target.value }))} placeholder="e.g. Modern E-commerce" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Category *</label>
                                <select className="berry-input" value={form.category || ''} onChange={(e: any) => setForm((p: any) => ({ ...p, category: e.target.value }))}>
                                    <option value="">Select Category</option>
                                    {categories.map((c: Category) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Price (₹) *</label>
                                <input type="number" className="berry-input" value={form.price || ''} onChange={(e: any) => setForm((p: any) => ({ ...p, price: +e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Original Price (₹)</label>
                                <input type="number" className="berry-input" value={form.originalPrice || ''} onChange={(e: any) => setForm((p: any) => ({ ...p, originalPrice: +e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Discount (%) - Auto</label>
                                <input type="number" className="berry-input" value={form.discount || 0} disabled style={{ backgroundColor: '#f8fafc', cursor: 'not-allowed' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Main Landing Image *</label>
                                <input type="file" accept="image/*" onChange={handleMainImageUpload} className="berry-input" style={{ padding: '8px' }} />
                                {form.mainImage && <img src={form.mainImage} alt="Main" style={{ width: '100%', height: 100, objectFit: 'cover', marginTop: 8, borderRadius: 8 }} />}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Gallery Images (Min 2, Max 10) *</label>
                                <input type="file" accept="image/*" multiple onChange={handleImagesUpload} className="berry-input" style={{ padding: '8px' }} />
                                {form.images && form.images.length > 0 && (
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8, overflowX: 'auto' }}>
                                        {form.images.map((img, i) => (
                                            <img key={i} src={img} alt={`Gallery ${i+1}`} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Description</label>
                            <textarea className="berry-input" value={form.description || ''} onChange={(e: any) => setForm((p: any) => ({ ...p, description: e.target.value }))} rows={3} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Technologies Used (comma separated)</label>
                            <input className="berry-input" value={form.tech?.join(', ') || ''} onChange={(e: any) => setForm((p: any) => ({ ...p, tech: e.target.value.split(',').map((t:string) => t.trimStart()) }))} placeholder="e.g. React, Node.js, MongoDB" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.isNew || false} onChange={(e: any) => setForm((p: any) => ({ ...p, isNew: e.target.checked }))} />
                                <span style={{ fontSize: '0.9rem' }}>Mark as New</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.popular || false} onChange={(e: any) => setForm((p: any) => ({ ...p, popular: e.target.checked }))} />
                                <span style={{ fontSize: '0.9rem' }}>Most Popular</span>
                            </label>
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
                            <button className="berry-btn-primary" onClick={handleSave} style={{ flex: 1, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                {editProject ? <><FiCheck /> Update Product</> : <><FiPlus /> Add Product</>}
                            </button>
                            <button className="berry-btn-outline" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '14px', border: '1px solid #e3e8ef', color: '#364152' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showCategoryForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(18,25,38,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
                    <div className="berry-card" style={{ maxWidth: 400, width: '100%', margin: 0, animation: 'fadeInUp 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 style={{ margin: 0, color: '#121926', display: 'flex', alignItems: 'center', gap: 8 }}><FiPlus /> New Category</h2>
                            <button onClick={() => setShowCategoryForm(false)} style={{ background: '#f8fafc', border: '1px solid #e3e8ef', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#697586' }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Category Name *</label>
                                <input className="berry-input" value={categoryForm.name || ''} onChange={(e: any) => setCategoryForm((c: any) => ({ ...c, name: e.target.value }))} placeholder="e.g. E-Commerce" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#364152', marginBottom: 8 }}>Icon *</label>
                                <div style={{ position: 'relative' }}>
                                    <div 
                                        className="berry-input" 
                                        onClick={() => setShowIconDropdown(!showIconDropdown)}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: '#f8fafc' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontSize: '1.2rem', display: 'flex', color: '#5e35b1' }}>
                                                {renderIcon(categoryForm.icon || 'FiBox')}
                                            </span>
                                            <span style={{ color: categoryForm.icon ? '#121926' : '#94a3b8' }}>{categoryForm.icon || 'Select an Icon'}</span>
                                        </div>
                                        <FiChevronDown />
                                    </div>
                                    {showIconDropdown && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e3e8ef', borderRadius: 8, marginTop: 4, zIndex: 100, maxHeight: 200, overflowY: 'auto', padding: 8, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))', gap: 8 }}>
                                                {BUSINESS_ICONS.map(iconKey => {
                                                    const IconC = FiIcons[iconKey];
                                                    return (
                                                        <button 
                                                            key={iconKey} 
                                                            type="button"
                                                            onClick={() => { setCategoryForm(c => ({ ...c, icon: iconKey })); setShowIconDropdown(false); }}
                                                            style={{ border: '1px solid #e3e8ef', background: categoryForm.icon === iconKey ? '#ede7f6' : '#f8fafc', borderRadius: 6, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: categoryForm.icon === iconKey ? '#5e35b1' : '#697586', transition: 'all 0.2s' }}
                                                            title={iconKey}
                                                        >
                                                            <IconC size={20} />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
                            <button className="berry-btn-primary" onClick={handleSaveCategory} style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                <FiPlus /> Add Category
                            </button>
                            <button className="berry-btn-outline" onClick={() => setShowCategoryForm(false)} style={{ flex: 1, padding: '12px', border: '1px solid #e3e8ef', color: '#364152' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Manage Categories Modal */}
            {showManageCategories && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(18,25,38,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
                    <div className="berry-card" style={{ maxWidth: 500, width: '100%', margin: 0, animation: 'fadeInUp 0.3s ease', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 style={{ margin: 0, color: '#121926', display: 'flex', alignItems: 'center', gap: 8 }}><FiSettings /> Manage Categories</h2>
                            <button onClick={() => setShowManageCategories(false)} style={{ background: '#f8fafc', border: '1px solid #e3e8ef', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#697586' }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {categories.length === 0 ? (
                                <p style={{ color: '#697586' }}>No categories found.</p>
                            ) : (
                                categories.map((c: Category) => (
                                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #e3e8ef', borderRadius: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', color: '#5e35b1' }}>{renderIcon(c.icon || '')}</span>
                                            <span style={{ fontWeight: 600, color: '#121926' }}>{c.name}</span>
                                        </div>
                                        <button onClick={() => setDeleteCategoryId(c.id as number)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600, padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>Delete</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal 
                isOpen={deleteProductId !== null}
                title="Delete Product"
                message="Are you sure you want to permanently delete this product? This action cannot be undone."
                onConfirm={executeDeleteProduct}
                onCancel={() => setDeleteProductId(null)}
            />
            <ConfirmModal 
                isOpen={deleteCategoryId !== null}
                title="Delete Category"
                message="Delete this category? Products in this category will remain but without an assigned category."
                onConfirm={executeDeleteCategory}
                onCancel={() => setDeleteCategoryId(null)}
            />
            <style jsx>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
