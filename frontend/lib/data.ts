// ============================================================
// AlgorySoft — Business Web Solutions Data
// ============================================================

export const CATEGORIES: { id: number | string; name: string; icon: string; count: number; slug: string }[] = [];

export const PROJECTS: {
    id: number;
    title: string;
    category: string;
    price: number;
    originalPrice: number;
    discount: number;
    views: number;
    slug: string;
    tags: string[];
    featured: boolean;
    isNew: boolean;
    description: string;
    tech: string[];
    icon: string;
}[] = [];

export const USP_ITEMS = [
    { icon: '🎯', title: 'Custom Business Design', desc: 'Fully tailored to your brand identity, industry, and target audience — no generic templates.' },
    { icon: '⚡', title: 'Fast Delivery', desc: 'Most websites delivered within 7–14 business days. Urgent projects taken up with priority.' },
    { icon: '📈', title: 'SEO & Performance First', desc: 'Every website is optimised for search engines, speed (90+ Lighthouse score), and conversions.' },
    { icon: '🔒', title: 'Secure & Scalable', desc: 'Built with modern security best practices. Scales gracefully as your business grows.' },
    { icon: '🛠️', title: '1-Year Free Support', desc: 'We stand behind our work. Get free bug fixes, minor changes, and guidance for a full year.' },
    { icon: '🌐', title: 'Full Source Code', desc: 'You own everything. Complete source code, hosting setup, and domain configuration included.' },
];

export const PHONE = '+91 78995 33525';
export const WHATSAPP = '917899533525';
export const EMAIL = 'algorysoft@gmail.com';
export const WORKING_HOURS = '9:30 AM – 6:30 PM (Mon–Sat)';
export const LINKEDIN = 'https://www.linkedin.com/company/algorysoft/';
export const INSTAGRAM = 'https://www.instagram.com/algorysoft?igsh=aWxnc2E1bzFycDBz';
