'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchCarousel } from '@/store/slices/carouselSlice';
import { FiCheckCircle } from 'react-icons/fi';

export default function ProductStripCarousel() {
    const dispatch = useAppDispatch();
    const { productSlides, status } = useAppSelector(s => s.carousel);

    useEffect(() => {
        if (status === 'idle') dispatch(fetchCarousel());
    }, [dispatch, status]);

    const activeSlides = productSlides.filter(s => s.isActive).sort((a, b) => a.order - b.order);

    if (activeSlides.length === 0) return null;

    // Duplicate slides to create an infinite scroll effect
    const displaySlides = [...activeSlides, ...activeSlides, ...activeSlides];

    return (
        <div className="product-strip-marquee">
            <div className="marquee-content">
                {displaySlides.map((slide, i) => (
                    <div key={`${slide.id}-${i}`} className="marquee-item">
                        {slide.image && (
                            <img src={slide.image} alt="" className="marquee-banner" />
                        )}
                        {slide.text && <span className="marquee-text">{slide.text}</span>}
                    </div>
                ))}
            </div>

            <style jsx>{`
                .product-strip-marquee {
                    width: 100%;
                    overflow: hidden;
                    background: linear-gradient(90deg, #ffffff 0%, #f1f5f9 50%, #ffffff 100%);
                    padding: 32px 0;
                    margin: 40px 0;
                    border-top: 1px solid #e2e8f0;
                    border-bottom: 1px solid #e2e8f0;
                    position: relative;
                    box-shadow: inset 0 2px 10px rgba(0,0,0,0.02);
                }

                .marquee-content {
                    display: flex;
                    width: fit-content;
                    animation: marquee 80s linear infinite;
                    gap: 120px;
                    padding-left: 120px;
                    align-items: center;
                }

                .marquee-item {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .marquee-banner {
                    height: 120px;
                    width: auto;
                    min-width: 150px;
                    object-fit: contain;
                    border-radius: 12px;
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05));
                }

                .marquee-item:hover .marquee-banner {
                    transform: scale(1.1);
                    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));
                }

                .marquee-text {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #1e293b;
                    letter-spacing: -0.02em;
                    background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-33.33% - 40px)); }
                }

                .product-strip-marquee:hover .marquee-content {
                    animation-play-state: paused;
                }

                /* Gradient fades for the edges */
                .product-strip-marquee::before,
                .product-strip-marquee::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 100px;
                    z-index: 2;
                    pointer-events: none;
                }

                .product-strip-marquee::before {
                    left: 0;
                    background: linear-gradient(to right, #f8fafc, transparent);
                }

                .product-strip-marquee::after {
                    right: 0;
                    background: linear-gradient(to left, #f8fafc, transparent);
                }
            `}</style>
        </div>
    );
}
