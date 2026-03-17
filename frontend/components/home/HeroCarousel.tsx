'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/hooks/useRedux';
import type { CarouselSlide } from '@/store/slices/carouselSlice';
import { FiStar } from 'react-icons/fi';

function CarouselSlideItem({ slide, active }: { slide: CarouselSlide; active: boolean }) {
    return (
        <div
            className={`hero-carousel-slide ${active ? 'active' : ''}`}
            style={{ background: slide.bgColor }}
        >
            <div className="container hero-carousel-content">
                <div className="hero-carousel-left">
                    <div className="hero-carousel-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FiStar size={13} /> Featured Solution</div>
                    <h2 className="hero-carousel-title">{slide.title}</h2>
                    <p className="hero-carousel-sub">{slide.subtitle}</p>
                    <Link href={slide.ctaLink} className="btn-primary">
                        {slide.ctaText} →
                    </Link>
                </div>
                <div className="hero-carousel-right">
                    <div className="hero-carousel-visual">
                        {slide.image ? (
                            <div className="hero-carousel-image-container animate-pulse-soft" style={{ width: '100%', height: '100%', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.4)' }}>
                                <img src={slide.image} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ) : (
                            <div className="hero-carousel-window">
                                <div className="hero-carousel-dots">
                                    <span style={{ background: '#f87171' }} />
                                    <span style={{ background: '#fbbf24' }} />
                                    <span style={{ background: '#4ade80' }} />
                                </div>
                                <div className="hero-carousel-screen">
                                    <div className="hcs-bar" style={{ width: '70%', background: 'var(--pista-primary)', opacity: 0.7 }} />
                                    <div className="hcs-bar" style={{ width: '50%', background: 'var(--pista-light)', opacity: 0.5 }} />
                                    <div className="hcs-bar" style={{ width: '85%', background: 'var(--pista-border)', opacity: 0.4 }} />
                                    <div className="hcs-grid">
                                        {Array(6).fill(0).map((_, i) => (
                                            <div key={i} className="hcs-tile" style={{ animationDelay: `${i * 0.1}s` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HeroCarousel() {
    const { slides } = useAppSelector(s => s.carousel);
    const activeSlides = slides.filter(s => s.isActive).sort((a, b) => a.order - b.order);
    const [current, setCurrent] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const next = () => setCurrent(c => (c + 1) % activeSlides.length);
    const prev = () => setCurrent(c => (c - 1 + activeSlides.length) % activeSlides.length);

    useEffect(() => {
        if (activeSlides.length < 2) return;
        timerRef.current = setInterval(next, 5000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [activeSlides.length]);

    if (!activeSlides.length) return null;

    return (
        <div className="hero-carousel">
            <div className="hero-carousel-track">
                {activeSlides.map((slide, i) => (
                    <CarouselSlideItem key={slide.id} slide={slide} active={i === current} />
                ))}
            </div>

            {/* Navigation */}
            {activeSlides.length > 1 && (
                <>
                    <button className="hc-nav hc-prev" onClick={prev} aria-label="Previous">‹</button>
                    <button className="hc-nav hc-next" onClick={next} aria-label="Next">›</button>

                    {/* Dots */}
                    <div className="hc-dots">
                        {activeSlides.map((_, i) => (
                            <button
                                key={i}
                                className={`hc-dot ${i === current ? 'active' : ''}`}
                                onClick={() => setCurrent(i)}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
