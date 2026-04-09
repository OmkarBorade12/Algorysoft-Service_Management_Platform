'use client';
import { lazy, Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import CategoryCarousel from '@/components/home/CategoryCarousel';
import StatsSection from '@/components/home/StatsSection';
import USPSection from '@/components/home/USPSection';
import HeroCarousel from '@/components/home/HeroCarousel';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useRedux';
import { fetchLandingStats } from '@/store/slices/statsSlice';

const ProductSection = lazy(() => import('@/components/home/ProductSection'));
const TestimonialsSection = lazy(() => import('@/components/home/TestimonialsSection'));
const MapSection = lazy(() => import('@/components/home/MapSection'));
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchLandingStats());
  }, [dispatch]);

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
      {/* Hero doesn't need scroll reveal — it's above the fold */}
      <HeroSection />

      {/* Stats — wireframe reveal from below */}
      <ScrollReveal direction="wireframe" delay={0} duration={0.7}>
        <StatsSection />
      </ScrollReveal>

      {/* Hero Carousel — slide in from right */}
      <ScrollReveal direction="right" delay={0.05} duration={0.65}>
        <HeroCarousel />
      </ScrollReveal>

      {/* Category Carousel — fade up */}
      <ScrollReveal direction="up" delay={0} duration={0.55}>
        <CategoryCarousel />
      </ScrollReveal>

      {/* Latest Work — standard fade up reveal */}
      <ScrollReveal direction="up" delay={0} duration={0.6}>
        <section style={{ padding: '50px 0', background: 'var(--bg-secondary)' }}>
          <div className="container">
            <Suspense fallback={<ProductSkeleton />}>
              <ProductSection
                title="🆕︎ Latest Solutions"
                subtitle="Freshly Launched"
                projects={latestSolutions}
                viewAllLink="/projects?filter=new"
                imageNum={1}
              />
            </Suspense>
          </div>
        </section>
      </ScrollReveal>

      {/* Most Popular — standard fade up reveal */}
      <ScrollReveal direction="up" delay={0} duration={0.6}>
        <section style={{ padding: '50px 0', background: 'var(--bg-primary)' }}>
          <div className="container">
            <Suspense fallback={<ProductSkeleton />}>
              <ProductSection
                title="🔥︎︎ Most Popular"
                subtitle="Client Favourites"
                projects={popularSolutions}
                viewAllLink="/projects?filter=popular"
                imageNum={2}
              />
            </Suspense>
          </div>
        </section>
      </ScrollReveal>

      {/* Removed USP Section to eliminate white space between Most Popular and Testimonials 
      <ScrollReveal direction="left" delay={0} duration={0.65}>
        <USPSection />
      </ScrollReveal>
      */}

      {/* Testimonials — zoom in */}
      <ScrollReveal direction="zoom" delay={0} duration={0.6}>
        <Suspense fallback={<div style={{ height: '200px' }} />}>
          <TestimonialsSection />
        </Suspense>
      </ScrollReveal>

      {/* Map Section — wireframe reveal */}
      <ScrollReveal direction="wireframe" delay={0} duration={0.7}>
        <Suspense fallback={<div style={{ height: '400px', background: 'var(--bg-secondary)', borderRadius: '28px', margin: '50px 0' }} />}>
          <MapSection />
        </Suspense>
      </ScrollReveal>

      {/* CTA — fade up */}
      <ScrollReveal direction="up" delay={0} duration={0.5}>
        <Suspense fallback={null}>
          <CTASection />
        </Suspense>
      </ScrollReveal>
    </>
  );
}
