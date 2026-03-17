'use client';
import { useState, useRef } from 'react';

interface SpotlightCardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function SpotlightCard({ children, className = '', style }: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            className={`aceternity-card ${className}`}
            style={style}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {hover && (
                <div
                    className="aceternity-spotlight"
                    style={{ left: position.x, top: position.y }}
                />
            )}
            <div className="aceternity-card-inner">{children}</div>
        </div>
    );
}

interface GlowBorderProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    color?: string;
}

export function GlowBorderCard({ children, className = '', style, color = '#6db03a' }: GlowBorderProps) {
    return (
        <div className={`glow-border-card ${className}`} style={{ '--glow-color': color, ...style } as React.CSSProperties}>
            <div className="glow-border-inner">{children}</div>
        </div>
    );
}

interface AnimatedBadgeProps {
    children: React.ReactNode;
    pulse?: boolean;
}

export function AnimatedBadge({ children, pulse = true }: AnimatedBadgeProps) {
    return (
        <div className="animated-badge">
            {pulse && <span className="animated-badge-dot" />}
            {children}
        </div>
    );
}

interface ShimmerButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit';
}

export function ShimmerButton({ children, onClick, className = '', disabled, type = 'button' }: ShimmerButtonProps) {
    return (
        <button type={type} className={`shimmer-btn ${className}`} onClick={onClick} disabled={disabled}>
            <span className="shimmer-btn-bg" />
            <span className="shimmer-btn-content">{children}</span>
        </button>
    );
}

interface FloatingCardProps {
    icon: string;
    title: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
}

export function FloatingStatCard({ icon, title, value, trend, trendUp }: FloatingCardProps) {
    return (
        <div className="floating-stat">
            <div className="floating-stat-icon">{icon}</div>
            <div>
                <div className="floating-stat-value">{value}</div>
                <div className="floating-stat-title">{title}</div>
                {trend && (
                    <div className={`floating-stat-trend ${trendUp ? 'up' : 'down'}`}>
                        {trendUp ? '↑' : '↓'} {trend}
                    </div>
                )}
            </div>
        </div>
    );
}
