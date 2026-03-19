'use client';
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import toast from 'react-hot-toast';
import { updateProductThunk } from '@/store/slices/productsSlice';
import Pagination from '@/components/ui/Pagination';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { FiCreditCard, FiTag, FiAward, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MultiSelectFeatures = ({ value, onChange, options }: { value: string, onChange: (val: string, addedPrice: number, removedPrice: number) => void, options: { id: number, name: string, price: number }[] }) => {
    const selectedNames = value.split('\n').filter(Boolean);
    const availableOptions = options.filter(o => !selectedNames.includes(o.name));

    return (
        <div style={{ border: '1px solid #e3e8ef', padding: 8, borderRadius: 8, background: '#fff' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8, minHeight: 28 }}>
                {selectedNames.map(name => (
                    <span key={name} style={{ background: '#ede7f6', color: '#5e35b1', padding: '4px 8px', borderRadius: 6, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                        {name}
                        <button type="button" onClick={() => {
                            const removed = options.find(o => o.name === name);
                            onChange(selectedNames.filter(n => n !== name).join('\n'), 0, removed?.price || 0)
                        }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5e35b1', fontSize: '1rem', lineHeight: 1, padding: 0 }}>×</button>
                    </span>
                ))}
            </div>
            <select
                className="berry-input"
                style={{ padding: '8px', fontSize: '0.85rem' }}
                value=""
                onChange={(e) => {
                    if (e.target.value) {
                        const added = options.find(o => o.name === e.target.value);
                        onChange(selectedNames.concat(e.target.value).join('\n'), added?.price || 0, 0);
                    }
                }}
            >
                <option value="" disabled>+ Add feature...</option>
                {availableOptions.map(o => (
                    <option key={o.id} value={o.name}>{o.name} (+₹{o.price.toLocaleString('en-IN')})</option>
                ))}
            </select>
        </div>
    );
};

export default function PricingCardsAdmin() {
    const dispatch = useAppDispatch();
    const projects = useAppSelector(s => s.products.items);
    const pStatus = useAppSelector(s => s.products.status);
    const catalogFeatures = useAppSelector(s => s.features?.items || []);
    
    const [selectedProductId, setSelectedProductId] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const itemsPerPage = 6;

    const selectedProduct = projects.find(p => p.id === selectedProductId);

    const defaultTiers = {
        basic: { price: 0, features: '' },
        silver: { price: 0, features: '' },
        gold: { price: 0, features: '' }
    };

    const [tiers, setTiers] = useState({
        basic: { price: 0, features: '' },
        silver: { price: 0, features: '' },
        gold: { price: 0, features: '' }
    });

    useEffect(() => {
        if (projects.length > 0 && selectedProductId === 0) {
            setSelectedProductId(projects[0].id);
        }
    }, [projects, selectedProductId]);

    useEffect(() => {
        if (selectedProduct) {
            setTiers({ ...defaultTiers, ...selectedProduct.pricingTiers });
        }
    }, [selectedProductId, projects.length]);

    const executeDelete = () => {
        if (deleteId !== null) {
            const product = projects.find(p => p.id === deleteId);
            if (product) {
                dispatch(updateProductThunk({ ...product, pricingTiers: undefined }));
                toast.success('Tiers reset to global defaults.');
            }
            setDeleteId(null);
        }
    };

    const handleSave = () => {
        if (selectedProduct) {
            dispatch(updateProductThunk({
                ...selectedProduct,
                pricingTiers: {
                    basic: tiers.basic,
                    silver: tiers.silver,
                    gold: tiers.gold
                }
            }));
            toast.success('Pricing tiers updated successfully!');
        }
    };

    const handleFeatureChange = (tier: 'basic' | 'silver' | 'gold', val: string, addedPrice = 0, removedPrice = 0) => {
        setTiers(prev => {
            const currentPrice = Number(prev[tier].price) || 0;
            const newPrice = Math.max(0, currentPrice + addedPrice - removedPrice);
            return {
                ...prev,
                [tier]: { ...prev[tier], features: val, price: newPrice }
            };
        });
    };

    const handlePriceChange = (tier: 'basic' | 'silver' | 'gold', val: number) => {
        setTiers((prev: any) => ({ ...prev, [tier]: { ...prev[tier], price: val } }));
    };

    if (pStatus === 'loading') return (
        <div style={{ padding: 24 }}>
            <div className="berry-card" style={{ opacity: 0.6 }}>
                <div style={{ height: 32, width: '40%', backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 16 }} />
                <div style={{ height: 60, width: '100%', backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 32 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ height: 400, backgroundColor: '#f5f5f5', borderRadius: 12 }} />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.99 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.4 }}
            style={{ width: '100%', maxWidth: '100%' }}
        >
            <div className="berry-animate-in">
                <div className="berry-card">
                    <h2 className="berry-title" style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: 8 }}><FiCreditCard /> Assign Pricing Cards (Tiers)</h2>
                    <p style={{ color: '#697586', marginBottom: 24 }}>Select a product to configure its customized Basic, Silver, and Gold pricing cards.</p>

                    <div style={{ marginBottom: 32, maxWidth: 450 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontWeight: 700, color: '#121926' }}><FiTag /> Working on Product:</label>
                        <select
                            className="berry-input"
                            style={{ fontSize: '1rem', padding: '12px 16px' }}
                            value={selectedProductId}
                            onChange={e => setSelectedProductId(Number(e.target.value))}
                        >
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.title} (ID: {p.id})</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                        {/* Basic Card */}
                        <div style={{ padding: 24, border: '1px solid #e3e8ef', borderRadius: 16, background: '#f8fafc', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <h3 style={{ margin: '0 0 20px', color: '#2196f3', display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.2rem' }}>
                                <FiAward /> Basic Tier
                            </h3>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, fontWeight: 600, color: '#364152' }}>Price (₹)</label>
                            <div style={{ position: 'relative', marginBottom: 20 }}>
                                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#94a3b8' }}>₹</span>
                                <input
                                    type="number"
                                    className="berry-input"
                                    style={{ paddingLeft: 28 }}
                                    value={tiers.basic.price || ''}
                                    onChange={e => handlePriceChange('basic', Number(e.target.value))}
                                />
                            </div>

                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, fontWeight: 600, color: '#364152' }}>Features Included</label>
                            <MultiSelectFeatures
                                value={tiers.basic.features}
                                onChange={(val, ap, rp) => handleFeatureChange('basic', val, ap, rp)}
                                options={catalogFeatures}
                            />
                        </div>

                        {/* Silver Card */}
                        <div style={{ padding: 24, border: '1px solid #ede7f6', borderRadius: 16, background: '#ffffff', boxShadow: '0 8px 24px rgba(103, 58, 183, 0.08)' }}>
                            <h3 style={{ margin: '0 0 20px', color: '#673ab7', display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.2rem' }}>
                                <FiAward /> Silver Tier
                            </h3>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, fontWeight: 600, color: '#364152' }}>Price (₹)</label>
                            <div style={{ position: 'relative', marginBottom: 20 }}>
                                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#94a3b8' }}>₹</span>
                                <input
                                    type="number"
                                    className="berry-input"
                                    style={{ paddingLeft: 28 }}
                                    value={tiers.silver.price || ''}
                                    onChange={e => handlePriceChange('silver', Number(e.target.value))}
                                />
                            </div>

                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, fontWeight: 600, color: '#364152' }}>Features Included</label>
                            <MultiSelectFeatures
                                value={tiers.silver.features}
                                onChange={(val, ap, rp) => handleFeatureChange('silver', val, ap, rp)}
                                options={catalogFeatures}
                            />
                        </div>

                        {/* Gold Card */}
                        <div style={{ padding: 24, border: '1px solid #ffd54f', borderRadius: 16, background: '#fffde7', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 24px rgba(255, 193, 7, 0.15)' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 6, background: '#ffb300' }} />
                            <h3 style={{ margin: '0 0 20px', color: '#f57f17', display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.2rem' }}>
                                <FiAward /> Gold Tier
                            </h3>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, fontWeight: 600, color: '#364152' }}>Price (₹)</label>
                            <div style={{ position: 'relative', marginBottom: 20 }}>
                                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#94a3b8' }}>₹</span>
                                <input
                                    type="number"
                                    className="berry-input"
                                    style={{ paddingLeft: 28 }}
                                    value={tiers.gold.price || ''}
                                    onChange={e => handlePriceChange('gold', Number(e.target.value))}
                                />
                            </div>

                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, fontWeight: 600, color: '#364152' }}>Features Included</label>
                            <MultiSelectFeatures
                                value={tiers.gold.features}
                                onChange={(val, ap, rp) => handleFeatureChange('gold', val, ap, rp)}
                                options={catalogFeatures}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        <button className="berry-btn-primary" onClick={handleSave} style={{ padding: '14px 32px', fontSize: '1.1rem' }}>
                            <FiCheck /> Save Tiers for {selectedProduct?.title}
                        </button>
                    </div>
                </div>

                <div className="berry-card">
                    <h3 className="berry-title">Products with Customized Tiers</h3>
                    {projects.filter(p => p.pricingTiers && p.pricingTiers.basic).length === 0 ? (
                        <p style={{ color: '#697586', fontStyle: 'italic' }}>No products have customized tiers saved yet. They are using global defaults.</p>
                    ) : (
                        <>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {projects.filter(p => p.pricingTiers && p.pricingTiers.basic).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(p => (
                                    <li key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, border: '1px solid #e3e8ef', borderRadius: 8 }}>
                                        <div>
                                            <strong>{p.title}</strong> <span style={{ color: '#697586', fontSize: '0.85rem' }}>(ID: {p.id})</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, fontSize: '0.85rem' }}>
                                            <span className="berry-badge info">Basic: ₹{p.pricingTiers?.basic?.price || 0}</span>
                                            <span className="berry-badge warning">Silver: ₹{p.pricingTiers?.silver?.price || 0}</span>
                                            <span className="berry-badge success">Gold: ₹{p.pricingTiers?.gold?.price || 0}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="berry-btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => {
                                                setSelectedProductId(p.id);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}>Edit</button>
                                            <button className="berry-btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem', borderColor: '#ef5350', color: '#ef5350' }} onClick={() => setDeleteId(p.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {projects.filter(p => p.pricingTiers && p.pricingTiers.basic).length > itemsPerPage && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={projects.filter(p => p.pricingTiers && p.pricingTiers.basic).length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </>
                    )}
                </div>

                <ConfirmModal
                    isOpen={!!deleteId}
                    title="Reset Pricing Tiers"
                    message="Are you sure you want to delete these custom pricing tiers? This product will instantly revert to using the global pricing defaults."
                    onConfirm={executeDelete}
                    onCancel={() => setDeleteId(null)}
                />
            </div>
        </motion.div>
    );
}
