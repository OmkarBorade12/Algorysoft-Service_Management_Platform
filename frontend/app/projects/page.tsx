'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ProductCard from '@/components/products/ProductCard';

function ProjectsContent() {
    const searchParams = useSearchParams();
    const initCategory = searchParams.get('category') || 'all';
    const initSearch = searchParams.get('search') || '';

    const projects = useSelector((state: RootState) => state.products.items);
    const categories = useSelector((state: RootState) => state.categories.items);

    const [activeCategory, setActiveCategory] = useState(initCategory);
    const [searchQuery, setSearchQuery] = useState(initSearch);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
    const [sortBy, setSortBy] = useState('relevant');

    const [showSidebar, setShowSidebar] = useState(false);

    const filteredProjects = useMemo(() => {
        let result = [...projects];

        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.tags.some(t => t.toLowerCase().includes(q)) ||
                p.tech.some(t => t.toLowerCase().includes(q))
            );
        }

        // Category filter
        if (activeCategory !== 'all') {
            const catName = categories.find(c => c.slug === activeCategory)?.name;
            if (catName) {
                result = result.filter(p => p.category === catName);
            }
        }

        // Price filter
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Sorting
        switch (sortBy) {
            case 'price-low': result.sort((a, b) => a.price - b.price); break;
            case 'price-high': result.sort((a, b) => b.price - a.price); break;
            case 'newest': result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1)); break;
            case 'popular': result.sort((a, b) => b.views - a.views); break;
            case 'discount': result.sort((a, b) => b.discount - a.discount); break;
        }

        return result;
    }, [activeCategory, searchQuery, priceRange, sortBy, projects, categories]);

    return (
        <div className="container projects-listing-container" style={{ padding: '40px 24px' }}>
            {/* Filters Sidebar */}
            <aside className={`sidebar ${showSidebar ? 'show' : ''}`} style={{ width: '280px', flexShrink: 0, background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Filters</h3>
                    <button onClick={() => setShowSidebar(false)} className="mobile-only" style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Search</h4>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '10px 14px' }}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categories</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                        <button
                            onClick={() => { setActiveCategory('all'); setShowSidebar(false); }}
                            style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', color: activeCategory === 'all' ? 'var(--dark-pista-bright)' : 'var(--text-secondary)', fontWeight: activeCategory === 'all' ? '600' : '400', padding: '4px 0' }}
                        >
                            All Categories
                        </button>
                        {categories.map(c => (
                            <button
                                key={c.slug}
                                onClick={() => { setActiveCategory(c.slug); setShowSidebar(false); }}
                                style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', color: activeCategory === c.slug ? 'var(--dark-pista-bright)' : 'var(--text-secondary)', fontWeight: activeCategory === c.slug ? '600' : '400', padding: '4px 0' }}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Price: ₹{priceRange[1].toLocaleString('en-IN')}</h4>
                    <input
                        type="range"
                        min="5000"
                        max="50000"
                        step="1000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                        <span>₹5,000</span>
                        <span>₹50,000+</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, minWidth: 0 }}>
                <div style={{ marginBottom: '20px' }} className="mobile-only">
                    <button className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => setShowSidebar(true)}>
                        🔍︎︎ Filter & Search
                    </button>
                </div>
                <div className="section-header" style={{ marginBottom: '24px' }}>
                    <div>
                        <h1 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
                            {activeCategory === 'all' ? 'All Projects' : categories.find(c => c.slug === activeCategory)?.name}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
                            {searchQuery && ` for "${searchQuery}"`}
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sort by:</span>
                        <select
                            className="form-input"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ width: 'auto', padding: '8px 16px', background: 'var(--bg-card)' }}
                        >
                            <option value="relevant">Relevance</option>
                            <option value="popular">Most Popular</option>
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="discount">Biggest Discount</option>
                        </select>
                    </div>
                </div>

                {filteredProjects.length > 0 ? (
                    <div className="products-grid">
                        {filteredProjects.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <div className="no-results-icon">🔍︎︎</div>
                        <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>No projects found</h3>
                        <p>Try adjusting your filters or search query.</p>
                        <button className="btn-secondary" style={{ marginTop: '24px' }} onClick={() => { setSearchQuery(''); setActiveCategory('all'); setPriceRange([0, 50000]); }}>
                            Clear Filters
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function ProjectsPage() {
    return (
        <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>}>
            <ProjectsContent />
        </Suspense>
    );
}
