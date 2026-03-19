'use client';
import { useEffect, useRef, ReactNode } from 'react';
import { motion, useAnimation, useInView, Variant } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade' | 'zoom' | 'wireframe';

interface ScrollRevealProps {
    children: ReactNode;
    direction?: Direction;
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const getVariants = (direction: Direction) => {
    const base: { hidden: Variant; visible: Variant } = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    switch (direction) {
        case 'up':
            return {
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
            };
        case 'down':
            return {
                hidden: { opacity: 0, y: -50 },
                visible: { opacity: 1, y: 0 },
            };
        case 'left':
            return {
                hidden: { opacity: 0, x: 60 },
                visible: { opacity: 1, x: 0 },
            };
        case 'right':
            return {
                hidden: { opacity: 0, x: -60 },
                visible: { opacity: 1, x: 0 },
            };
        case 'zoom':
            return {
                hidden: { opacity: 0, scale: 0.85 },
                visible: { opacity: 1, scale: 1 },
            };
        case 'wireframe':
            // Wireframe: draws/sketches in from an outline state
            return {
                hidden: { 
                    opacity: 0, 
                    scale: 0.94,
                    filter: 'contrast(0) brightness(2)',
                    y: 30,
                },
                visible: { 
                    opacity: 1, 
                    scale: 1,
                    filter: 'contrast(1) brightness(1)',
                    y: 0,
                },
            };
        default:
            return base;
    }
};

export default function ScrollReveal({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    threshold = 0.2,
    once = true,
    className,
    style,
}: ScrollRevealProps) {
    const controls = useAnimation();
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once, amount: threshold });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else if (!once) {
            controls.start('hidden');
        }
    }, [controls, inView, once]);

    const variants = getVariants(direction);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
}
