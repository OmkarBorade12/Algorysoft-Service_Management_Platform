'use client';
import { useState } from 'react';
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa';

// ─── Centralise AlgorySoft social profile URLs ────────────────────────────
const SOCIALS = {
    instagram: 'https://www.instagram.com/algorysoft?igsh=aWxnc2E1bzFycDBz',
    linkedin: 'https://www.linkedin.com/company/algorysoft/',
} as const;

interface FloatBtnProps {
    href: string;
    label: string;
    ariaLabel: string;
    id: string;
    colorVar: string;
    glowColor: string;
    children: React.ReactNode;
    tooltip: string;
}

function FloatBtn({ href, ariaLabel, id, colorVar, glowColor, children, tooltip }: FloatBtnProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            id={id}
            aria-label={ariaLabel}
            title={tooltip}
            className="social-float-btn"
            style={{
                background: colorVar,
                boxShadow: hovered
                    ? `0 8px 28px ${glowColor}, 0 2px 8px rgba(0,0,0,0.18)`
                    : `0 4px 16px ${glowColor.replace('0.55', '0.3')}, 0 2px 6px rgba(0,0,0,0.12)`,
                transform: hovered ? 'scale(1.14) translateX(-3px)' : 'scale(1)',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
            {/* Tooltip */}
            <span className="social-float-tooltip" aria-hidden="true">
                {tooltip}
            </span>
        </a>
    );
}

export default function SocialFloat() {
    return (
        <div className="social-float-stack" aria-label="Follow us on social media">
            {/* LinkedIn */}
            <FloatBtn
                href={SOCIALS.linkedin}
                label="LinkedIn"
                ariaLabel="Follow AlgorySoft on LinkedIn"
                id="social-float-linkedin"
                colorVar="#0a66c2"
                glowColor="rgba(10,102,194,0.55)"
                tooltip="LinkedIn"
            >
                <FaLinkedinIn size={20} />
            </FloatBtn>

            {/* Instagram */}
            <FloatBtn
                href={SOCIALS.instagram}
                label="Instagram"
                ariaLabel="Follow AlgorySoft on Instagram"
                id="social-float-instagram"
                colorVar="linear-gradient(135deg,#f58529,#dd2a7b,#8134af,#515bd4)"
                glowColor="rgba(221,42,123,0.55)"
                tooltip="Instagram"
            >
                <FaInstagram size={20} />
            </FloatBtn>

        </div>
    );
}
