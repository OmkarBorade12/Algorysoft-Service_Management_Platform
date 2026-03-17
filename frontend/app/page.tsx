'use client';
import { lazy, Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import CategoryCarousel from '@/components/home/CategoryCarousel';
import StatsSection from '@/components/home/StatsSection';
import USPSection from '@/components/home/USPSection';
import HeroCarousel from '@/components/home/HeroCarousel';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const ProductSection = lazy(() => import('@/components/home/ProductSection'));
const TestimonialsSection = lazy(() => import('@/components/home/TestimonialsSection'));
const CTASection = lazy(() => import('@/components/home/CTASection'));

const ProductSkeleton = () => (
  <div style={{ padding: '40px 0' }}>
    <div className="skeleton" style={{ height: '26px', width: '200px', marginBottom: '10px', borderRadius: '6px' }} />
    <div className="skeleton" style={{ height: '20px', width: '130px', marginBottom: '28px', borderRadius: '6px' }} />
    <div className="products-grid">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: '340px', borderRadius: '18px' }} />
      ))}
    </div>
  </div>
);

export default function HomePage() {
  const projects = useSelector((state: RootState) => state.products.items);
  
  // Sort all by newest first (highest id = most recently added)
  const allSorted = [...projects].sort((a, b) => Number(b.id) - Number(a.id));
  
  // Show top 8 most recent projects as latest
  const latestSolutions = allSorted.slice(0, 8);

  // "Popular" or "Featured" flagged products first, else next 4 most recent
  const popFlagged = allSorted.filter((p) => p.featured || p.popular);
  const popularSolutions = popFlagged.length > 0 ? popFlagged : allSorted.slice(0, 4);

  return (
    <>
      <HeroSection />
      <StatsSection />
      <HeroCarousel />
      <CategoryCarousel />

      {/* Latest Work */}
      <section style={{ padding: '70px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <Suspense fallback={<ProductSkeleton />}>
            <ProductSection
              title="🆕 Latest Solutions"
              subtitle="Freshly Launched"
              projects={latestSolutions}
              viewAllLink="/projects?filter=new"
            />
          </Suspense>
        </div>
      </section>

      <USPSection />

      {/* Most Popular */}
      <section style={{ padding: '70px 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <Suspense fallback={<ProductSkeleton />}>
            <ProductSection
              title="🔥 Most Popular"
              subtitle="Client Favourites"
              projects={popularSolutions}
              viewAllLink="/projects?filter=popular"
            />
          </Suspense>
        </div>
      </section>



      <Suspense fallback={<div style={{ height: '200px' }} />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={null}>
        <CTASection />
      </Suspense>
    </>
  );
}
