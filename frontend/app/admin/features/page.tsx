'use client';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { addFeature, updateFeature, deleteFeature, Feature } from '@/store/slices/featuresSlice';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Pagination from '@/components/ui/Pagination';
import { FiStar, FiSave, FiCheck } from 'react-icons/fi';

export default function FeaturesAdmin() {
    const features = useAppSelector(state => state.features?.items || []);
    const dispatch = useAppDispatch();

    const [editingId, setEditingId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || price === '') {
            toast.error('Please enter both name and price.');
            return;
        }

        if (editingId) {
            dispatch(updateFeature({ id: editingId, name: name.trim(), price: Number(price) }));
            toast.success('Feature updated successfully!');
        } else {
            dispatch(addFeature({ name: name.trim(), price: Number(price) }));
            toast.success('Feature added successfully!');
        }

        resetForm();
    };

    const handleEdit = (f: Feature) => {
        setEditingId(f.id);
        setName(f.name);
        setPrice(f.price);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const confirmDelete = () => {
        if (deleteId) {
            dispatch(deleteFeature(deleteId));
            toast.success('Feature deleted successfully!');
            setDeleteId(null);
            
            // Adjust pagination if needed
            const newTotal = features.length - 1;
            const newMaxPages = Math.ceil(newTotal / itemsPerPage) || 1;
            if (currentPage > newMaxPages) {
                setCurrentPage(newMaxPages);
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setPrice('');
    };

    const displayedFeatures = features.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div style={{ maxWidth: 900 }}>
            {/* Form Section */}
            <div className="berry-card">
                <h2 className="berry-title" style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: 8 }}><FiStar /> {editingId ? 'Edit Feature' : 'Create New Feature'}</h2>
                <p style={{ color: '#697586', marginBottom: 24 }}>Manage the features that can be added to pricing cards/tiers.</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'revert', gap: 16 }}>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <div style={{ flex: 2, minWidth: 200 }}>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Feature Name <span style={{ color: '#ef5350' }}>*</span></label>
                                <input
                                    type="text"
                                    className="berry-input"
                                    placeholder="e.g. Dynamic Frontend"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: 150 }}>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Price (₹) <span style={{ color: '#ef5350' }}>*</span></label>
                                <input
                                    type="number"
                                    className="berry-input"
                                    placeholder="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                                    required
                                    min={0}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-start', gap: 12 }}>
                        <button type="submit" className="berry-btn-primary" style={{ padding: '12px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            {editingId ? <><FiSave /> Update Feature</> : <><FiCheck /> Save Feature</>}
                        </button>
                        {editingId && (
                            <button type="button" className="berry-btn-outline" onClick={resetForm} style={{ padding: '12px 24px' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Table Section */}
            <div className="berry-card">
                <h3 className="berry-title" style={{ marginBottom: 16 }}>Available Features List</h3>
                
                {features.length === 0 ? (
                    <p style={{ color: '#697586', fontStyle: 'italic', padding: '16px 0' }}>No features created yet.</p>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 500 }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e3e8ef' }}>
                                        <th style={{ padding: '12px 16px', fontWeight: 600, color: '#364152' }}># ID</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 600, color: '#364152' }}>Feature Name</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 600, color: '#364152' }}>Price (₹)</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 600, color: '#364152', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedFeatures.map((f, index) => (
                                        <tr key={f.id} style={{ borderBottom: '1px solid #e3e8ef', transition: 'background 0.2s', background: editingId === f.id ? '#f5f3ff' : 'transparent' }}>
                                            <td style={{ padding: '12px 16px', color: '#697586' }}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td style={{ padding: '12px 16px', fontWeight: 500 }}>{f.name}</td>
                                            <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: 600 }}>₹{f.price.toLocaleString('en-IN')}</td>
                                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                    <button 
                                                        className="berry-btn-outline" 
                                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                        onClick={() => handleEdit(f)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="berry-btn-outline" 
                                                        style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: '#ef5350', color: '#ef5350' }}
                                                        onClick={() => setDeleteId(f.id)}
                                                    >
                                                        Delete
                                                    </button>
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
                message="Are you sure you want to delete this feature? It will no longer be available for use."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}
