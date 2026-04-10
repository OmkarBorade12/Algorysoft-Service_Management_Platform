'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

interface ImageLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    altText?: string;
}

export default function ImageLightbox({ isOpen, onClose, imageSrc, altText }: ImageLightboxProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div 
            className="lightbox-overlay"
            onClick={onClose}
        >
            <div className="lightbox-content animate-zoomIn" onClick={e => e.stopPropagation()}>
                <button className="lightbox-close" onClick={onClose} aria-label="Close">
                    <FiX size={26} />
                </button>
                <div className="lightbox-image-wrapper">
                    <img src={imageSrc} alt={altText || 'Enlarged view'} className="lightbox-image" />
                    {altText && <div className="lightbox-caption">{altText}</div>}
                </div>
            </div>

            <style jsx>{`
                .lightbox-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.95);
                    backdrop-filter: blur(15px);
                    z-index: 99999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: zoom-out;
                }

                .lightbox-content {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    cursor: default;
                }

                .lightbox-image-wrapper {
                    position: relative;
                    max-width: 90vw;
                    max-height: 85vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .lightbox-image {
                    max-width: 100%;
                    max-height: 80vh;
                    object-fit: contain;
                    border-radius: 16px;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.8);
                    border: 1px solid rgba(255,255,255,0.15);
                    background: #000;
                }

                .lightbox-close {
                    position: absolute;
                    top: 40px;
                    right: 40px;
                    background: rgba(255, 255, 255, 0.15);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    z-index: 100;
                    backdrop-filter: blur(10px);
                }

                .lightbox-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg) scale(1.1);
                    border-color: white;
                }

                .lightbox-caption {
                    color: white;
                    margin-top: 20px;
                    font-size: 1.25rem;
                    font-weight: 700;
                    text-shadow: 0 4px 10px rgba(0,0,0,0.8);
                    text-align: center;
                    background: rgba(0,0,0,0.4);
                    padding: 8px 24px;
                    border-radius: 9999px;
                    backdrop-filter: blur(5px);
                }

                @keyframes zoomIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .animate-zoomIn {
                    animation: zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                @media (max-width: 768px) {
                    .lightbox-content {
                        padding: 20px;
                    }
                    .lightbox-close {
                        top: 20px;
                        right: 20px;
                        width: 40px;
                        height: 40px;
                    }
                    .lightbox-caption {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </div>,
        document.body
    );
}
