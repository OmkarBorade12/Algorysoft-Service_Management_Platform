'use client';
import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleSearch } from '@/store/slices/uiSlice';
import { setQuery, addRecentSearch, clearSearch } from '@/store/slices/searchSlice';
import { RootState } from '@/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './SearchOverlay.module.css';
import { FiSearch, FiX, FiClock, FiGlobe } from 'react-icons/fi';
import { CATEGORY_ICON_MAP } from '@/lib/icons';

export default function SearchOverlay() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { query, recentSearches } = useAppSelector((s) => s.search);
    const projects = useAppSelector((s: RootState) => s.products.items);
    const categories = useAppSelector((s: RootState) => s.categories.items);
    const [localQuery, setLocalQuery] = useState(query);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const suggestions = localQuery.length > 1
        ? projects.filter((p) => p.title.toLowerCase().includes(localQuery.toLowerCase()) || p.category.toLowerCase().includes(localQuery.toLowerCase())).slice(0, 6)
        : [];

    const handleSearch = (q: string) => {
        if (!q.trim()) return;
        dispatch(setQuery(q));
        dispatch(addRecentSearch(q));
        router.push(`/projects?search=${encodeURIComponent(q)}`);
        dispatch(toggleSearch());
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch(localQuery);
        if (e.key === 'Escape') dispatch(toggleSearch());
    };

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && dispatch(toggleSearch())}>
            <div className={styles.box}>
                <div className={styles.searchBar}>
                    <span className={styles.searchIcon}><FiSearch size={18} /></span>
                    <input
                        ref={inputRef}
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search for projects, technologies, categories..."
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        onKeyDown={handleKey}
                    />
                    {localQuery && (
                        <button className={styles.clearSearch} onClick={() => { setLocalQuery(''); dispatch(clearSearch()); }}><FiX size={16} /></button>
                    )}
                    <button className={styles.closeSearch} onClick={() => dispatch(toggleSearch())}>ESC</button>
                </div>

                {/* Results/Suggestions */}
                {suggestions.length > 0 ? (
                    <div className={styles.results}>
                        <p className={styles.resultLabel}>Projects</p>
                        {suggestions.map((p) => (
                            <Link key={p.id} href={`/project/${p.slug}`} className={styles.resultItem} onClick={() => { dispatch(addRecentSearch(localQuery)); dispatch(toggleSearch()); }}>
                                <span className={styles.resultIcon} style={{ color: 'var(--pista-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{CATEGORY_ICON_MAP[p.icon?.replace(/[^a-z-]/g, '')] || <FiGlobe size={18} />}</span>
                                <div>
                                    <p className={styles.resultTitle}>{p.title}</p>
                                    <p className={styles.resultCat}>{p.category} • ₹{p.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : localQuery.length > 1 ? (
                    <div className={styles.noResults}>No results for "{localQuery}" — <button onClick={() => handleSearch(localQuery)} className={styles.searchAllBtn}>Search all projects</button></div>
                ) : null}

                {/* Recent Searches */}
                {recentSearches.length > 0 && !localQuery && (
                    <div className={styles.results}>
                        <p className={styles.resultLabel}>Recent Searches</p>
                        <div className={styles.tags}>
                            {recentSearches.map((s) => (
                                <button key={s} className="tag" onClick={() => { setLocalQuery(s); handleSearch(s); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><FiClock size={12} /> {s}</button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Popular Categories */}
                {!localQuery && (
                    <div className={styles.results}>
                        <p className={styles.resultLabel}>Popular Categories</p>
                        <div className={styles.tags}>
                            {categories.slice(0, 10).map((c) => (
                                <Link key={c.id} href={`/projects?category=${c.slug}`} className="tag" onClick={() => dispatch(toggleSearch())} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <span style={{ color: 'var(--pista-primary)', display: 'flex' }}>{CATEGORY_ICON_MAP[c.slug] || <FiGlobe size={14} />}</span> {c.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
