'use client';
import { useAppSelector } from '@/hooks/useRedux';
import Link from 'next/link';
import { renderCategoryIcon } from '@/lib/icons';
import { FiGlobe } from 'react-icons/fi';

export default function CategoryCarousel() {
    const categories = useAppSelector(s => s.categories.items);
    const projects = useAppSelector(s => s.products.items);
    return (
        <section style={{ padding: '70px 0', background: 'var(--bg-primary)' }}>
            <div className="container">
                <div className="section-header">
                    <div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: 'var(--pista-xlight)', color: 'var(--pista-dark)',
                            border: '1.5px solid var(--pista-border)', borderRadius: '9999px',
                            padding: '4px 14px', fontSize: '0.72rem', fontWeight: '700',
                            textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px',
                        }}>
                            <FiGlobe size={13} style={{ color: 'var(--pista-primary)' }} /> Website Categories
                        </div>
                        <h2 className="section-title">Find Solutions by <span>Industry</span></h2>
                    </div>
                    <Link href="/projects" className="view-all-link">View All →</Link>
                </div>

                <div style={{
                    display: 'flex', gap: '14px', overflowX: 'auto',
                    paddingBottom: '12px', scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                }}>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/projects?category=${cat.slug}`}
                            className="category-chip"
                            style={{ flexShrink: 0, textDecoration: 'none' }}
                        >
                            <div className="category-chip-icon" style={{ color: 'var(--pista-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {renderCategoryIcon(cat, 22)}
                            </div>
                            <span className="category-chip-label">{cat.name}</span>
                            <span style={{
                                fontSize: '0.68rem', color: 'var(--text-muted)',
                                fontWeight: 600, marginTop: '-2px',
                            }}>
                                {projects.filter(p =>
                                    p.category === cat.name ||
                                    p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cat.slug
                                ).length} Solutions
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
