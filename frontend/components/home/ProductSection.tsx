import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import EmptyState from '@/components/ui/EmptyState';

interface ProductSectionProps {
    title: string;
    subtitle: string;
    projects: any[];
    viewAllLink: string;
    imageNum?: 1 | 2;
}

export default function ProductSection({ title, subtitle, projects, viewAllLink, imageNum = 1 }: ProductSectionProps) {
    return (
        <div>
            <div className="section-header">
                <div>
                    <span className="badge badge-category" style={{ marginBottom: '8px' }}>{subtitle}</span>
                    <h2 className="section-title">{title.split(' ')[0]} <span>{title.split(' ').slice(1).join(' ')}</span></h2>
                </div>
                <Link href={viewAllLink} className="view-all-link">View All →</Link>
            </div>

            {projects.length > 0 ? (
                <div className="products-grid">
                    {projects.slice(0, 4).map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            ) : (
                <EmptyState 
                    imageNum={imageNum}
                    imageOnly={true}
                />
            )}
        </div>
    );
}
