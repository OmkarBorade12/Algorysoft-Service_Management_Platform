'use client';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { fetchFeatures, addFeatureThunk, updateFeatureThunk, deleteFeatureThunk, Feature } from '@/store/slices/featuresSlice';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Pagination from '@/components/ui/Pagination';
import { FiStar, FiSave, FiCheck, FiRefreshCw } from 'react-icons/fi';

export default function FeaturesAdmin() {
    const { items: features, status } = useAppSelector(state => state.features);
    const dispatch = useAppDispatch();

    const [editingId, setEditingId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        dispatch(fetchFeatures());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || price === '') {
            toast.error('Please enter both name and price.');
            return;
        }

        try {
            if (editingId) {
                await dispatch(updateFeatureThunk({ id: editingId, name: name.trim(), price: Number(price) })).unwrap();
                toast.success('Feature updated successfully!');
            } else {
                await dispatch(addFeatureThunk({ name: name.trim(), price: Number(price) })).unwrap();
                toast.success('Feature added successfully!');
            }
            resetForm();
        } catch (err) {
            toast.error('Operation failed. Please try again.');
        }
    };

    const handleEdit = (f: Feature) => {
        setEditingId(f.id);
        setName(f.name);
        setPrice(f.price);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const confirmDelete = async () => {
        if (deleteId) {
            try {
                await dispatch(deleteFeatureThunk(deleteId)).unwrap();
                toast.success('Feature deleted successfully!');
                setDeleteId(null);
                
                const newTotal = features.length - 1;
                const newMaxPages = Math.ceil(newTotal / itemsPerPage) || 1;
                if (currentPage > newMaxPages) {
                    setCurrentPage(newMaxPages);
                }
            } catch (err) {
                toast.error('Delete failed.');
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setPrice('');
    };

    const displayedFeatures = (features || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div style={{ maxWidth: 1000 }} className="berry-animate-in">
            <div className="berry-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h2 className="berry-title" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}><FiStar /> {editingId ? 'Edit Feature' : 'Create New Feature'}</h2>
                        <p style={{ color: '#697586', fontSize: '0.9rem' }}>Define features that clients can select in quote forms.</p>
                    </div>
                    {status === 'loading' && <FiRefreshCw className="berry-icon-spin" style={{ color: '#5e35b1' }} />}
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 24 }}>
                        <div>
                            <label className="input-label">Feature Name <span style={{ color: '#ef5350' }}>*</span></label>
                            <input
                                type="text"
                                className="berry-input"
                                placeholder="e.g. SEO Optimization"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="input-label">Price Elevation (₹) <span style={{ color: '#ef5350' }}>*</span></label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#94a3b8' }}>₹</span>
                                <input
                                    type="number"
                                    className="berry-input"
                                    style={{ paddingLeft: 32 }}
                                    placeholder="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                                    required
                                    min={0}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button type="submit" className="berry-btn-primary" style={{ padding: '12px 32px' }}>
                            {editingId ? <><FiSave /> Update Feature</> : <><FiCheck /> Save Feature</>}
                        </button>
                        {editingId && (
                            <button type="button" className="berry-btn-outline" onClick={resetForm} style={{ padding: '12px 32px' }}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="berry-card" style={{ marginTop: 24 }}>
                <h3 className="berry-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.2rem' }}>
                    Available Features ({features?.length || 0})
                </h3>
                
                {status === 'loading' && features.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center' }}><FiRefreshCw className="berry-icon-spin" size={32} /></div>
                ) : features.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', background: '#f8fafc', borderRadius: 12, color: '#64748b' }}>
                        No features found. Start by creating one above.
                    </div>
                ) : (
                    <>
                        <div className="berry-table-container">
                            <table className="berry-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: 60 }}>#</th>
                                        <th>Feature Name</th>
                                        <th>Price Addition</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedFeatures.map((f, index) => (
                                        <tr key={f.id} style={{ background: editingId === f.id ? '#f5f3ff' : 'transparent' }}>
                                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td style={{ fontWeight: 600 }}>{f.name}</td>
                                            <td style={{ color: '#10b981', fontWeight: 700 }}>+ ₹{f.price.toLocaleString('en-IN')}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                    <button className="berry-btn-outline" style={{ padding: '6px 12px' }} onClick={() => handleEdit(f)}>Edit</button>
                                                    <button className="berry-btn-outline" style={{ padding: '6px 12px', color: '#ef4444', borderColor: '#ef4444' }} onClick={() => setDeleteId(f.id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {features.length > itemsPerPage && (
                            <div style={{ marginTop: 24 }}>
                                <Pagination 
                                    currentPage={currentPage}
                                    totalItems={features.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <ConfirmModal 
                isOpen={!!deleteId}
                title="Delete Feature"
                message="Are you sure you want to delete this feature? Clients will no longer see this as an option."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
            />

            <style jsx>{`
                .input-label { display: block; font-size: 0.85rem; font-weight: 700; color: #364152; margin-bottom: 8px; }
            `}</style>
        </div>
    );
}
