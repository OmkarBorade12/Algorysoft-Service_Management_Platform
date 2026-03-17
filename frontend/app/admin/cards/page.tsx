'use client';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import toast from 'react-hot-toast';
import { updateProduct } from '@/store/slices/productsSlice';
import Pagination from '@/components/ui/Pagination';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { FiCreditCard, FiTag, FiAward, FiCheck } from 'react-icons/fi';

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

interface TierData {
    productId: number;
    basic: { price: number; features: string };
    silver: { price: number; features: string };
    gold: { price: number; features: string };
}

export default function PricingCardsAdmin() {
    const projects = useAppSelector(s => s.products.items);
    const catalogFeatures = useAppSelector(s => s.features?.items || []); // Get global features
    const [selectedProductId, setSelectedProductId] = useState<number>(projects[0]?.id || 0);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const itemsPerPage = 6;
    const dispatch = useAppDispatch();

    const selectedProduct = projects.find(p => p.id === selectedProductId);

    const defaultTiers = {
        basic: { price: '' as unknown as number, features: '' },
        silver: { price: '' as unknown as number, features: '' },
        gold: { price: '' as unknown as number, features: '' }
    };

    const [tiers, setTiers] = useState<{
        basic: { price: number; features: string };
        silver: { price: number; features: string };
        gold: { price: number; features: string };
    }>(selectedProduct?.pricingTiers || defaultTiers);

    // Sync form when selected product changes or on initial hydrate
    useEffect(() => {
        if (selectedProduct) {
            setTiers(selectedProduct.pricingTiers || defaultTiers);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProductId, projects.length]);

    const executeDelete = () => {
        if (deleteId !== null) {
            const product = projects.find(p => p.id === deleteId);
            if (product) {
                dispatch(updateProduct({ ...product, pricingTiers: undefined }));
                toast.success('Tiers reset to global defaults.');
            }
            setDeleteId(null);
        }
    };

    const handleSave = () => {
        if (selectedProduct) {
            dispatch(updateProduct({
                ...selectedProduct,
                pricingTiers: {
                    basic: tiers.basic,
                    silver: tiers.silver,
                    gold: tiers.gold
                }
            }));
            toast.success(`Pricing Tiers updated for ${selectedProduct.title}`);
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
        setTiers(prev => ({ ...prev, [tier]: { ...prev[tier], price: val } }));
    };

    return (
        <div style={{ maxWidth: 900 }}>
            <div className="berry-card">
                <h2 className="berry-title" style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: 8 }}><FiCreditCard /> Assign Pricing Cards (Tiers)</h2>
                <p style={{ color: '#697586', marginBottom: 24 }}>Select a product to configure its customized Basic, Silver, and Gold pricing cards.</p>

                <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontWeight: 600 }}><FiTag /> Select Product:</label>
                    <select
                        className="berry-input"
                        value={selectedProductId}
                        onChange={e => setSelectedProductId(Number(e.target.value))}
                    >
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.title} (ID: {p.id})</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                    {/* Basic Card */}
                    <div style={{ padding: 20, border: '1px solid #e3e8ef', borderRadius: 12, background: '#f8fafc' }}>
                        <h3 style={{ margin: '0 0 16px', color: '#1e88e5', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiAward /> Basic Tier
                        </h3>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6, fontWeight: 600 }}>Price (₹)</label>
                        <input
                            type="number"
                            className="berry-input"
                            style={{ marginBottom: 16 }}
                            value={tiers.basic.price || ''}
                            onChange={e => handlePriceChange('basic', Number(e.target.value))}
                        />

                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6, fontWeight: 600 }}>Features</label>
                        <MultiSelectFeatures 
                            value={tiers.basic.features} 
                            onChange={(val, ap, rp) => handleFeatureChange('basic', val, ap, rp)} 
                            options={catalogFeatures} 
                        />
                    </div>

                    {/* Silver Card */}
                    <div style={{ padding: 20, border: '1px solid #cfd8dc', borderRadius: 12, background: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 16px', color: '#607d8b', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiAward /> Silver Tier
                        </h3>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6, fontWeight: 600 }}>Price (₹)</label>
                        <input
                            type="number"
                            className="berry-input"
                            style={{ marginBottom: 16 }}
                            value={tiers.silver.price || ''}
                            onChange={e => handlePriceChange('silver', Number(e.target.value))}
                        />

                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6, fontWeight: 600 }}>Features</label>
                        <MultiSelectFeatures 
                            value={tiers.silver.features} 
                            onChange={(val, ap, rp) => handleFeatureChange('silver', val, ap, rp)} 
                            options={catalogFeatures} 
                        />
                    </div>

                    {/* Gold Card */}
                    <div style={{ padding: 20, border: '1px solid #ffd54f', borderRadius: 12, background: '#fffde7', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: '#ffb300' }} />
                        <h3 style={{ margin: '0 0 16px', color: '#f57f17', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiAward /> Gold Tier
                        </h3>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6, fontWeight: 600 }}>Price (₹)</label>
                        <input
                            type="number"
                            className="berry-input"
                            style={{ marginBottom: 16 }}
                            value={tiers.gold.price || ''}
                            onChange={e => handlePriceChange('gold', Number(e.target.value))}
                        />

                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6, fontWeight: 600 }}>Features</label>
                        <MultiSelectFeatures 
                            value={tiers.gold.features} 
                            onChange={(val, ap, rp) => handleFeatureChange('gold', val, ap, rp)} 
                            options={catalogFeatures} 
                        />
                    </div>
                </div>

                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <button className="berry-btn-primary" onClick={handleSave} style={{ padding: '12px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiCheck /> Save Tiers for {selectedProduct?.title || 'Selected Product'}
                    </button>
                </div>
            </div>
            
            <div className="berry-card">
                <h3 className="berry-title">Products with Customized Tiers</h3>
                {projects.filter(p => p.pricingTiers).length === 0 ? (
                    <p style={{ color: '#697586', fontStyle: 'italic' }}>No products have customized tiers saved yet. They are using global defaults.</p>
                ) : (
                    <>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {projects.filter(p => p.pricingTiers).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(p => (
                            <li key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, border: '1px solid #e3e8ef', borderRadius: 8 }}>
                                <div>
                                    <strong>{p.title}</strong> <span style={{ color: '#697586', fontSize: '0.85rem' }}>(ID: {p.id})</span>
                                </div>
                                <div style={{ display: 'flex', gap: 12, fontSize: '0.85rem' }}>
                                    <span className="berry-badge info">Basic: ₹{p.pricingTiers!.basic.price}</span>
                                    <span className="berry-badge warning">Silver: ₹{p.pricingTiers!.silver.price}</span>
                                    <span className="berry-badge success">Gold: ₹{p.pricingTiers!.gold.price}</span>
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
                    {projects.filter(p => p.pricingTiers).length > itemsPerPage && (
                        <Pagination 
                            currentPage={currentPage}
                            totalItems={projects.filter(p => p.pricingTiers).length}
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
    );
}
