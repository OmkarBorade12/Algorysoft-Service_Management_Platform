'use client';
import {
    FiShoppingBag, FiBarChart2, FiZap, FiHome, FiGlobe,
    FiTrendingUp, FiShield, FiTarget, FiTool,
    FiBookOpen, FiTruck, FiScissors, FiCalendar, FiUsers,
} from 'react-icons/fi';
import { HiOutlineRocketLaunch } from 'react-icons/hi2';
import { MdOutlineRestaurant, MdOutlineLocalHospital, MdOutlineBalance, MdOutlineHotel, MdOutlineFitnessCenter } from 'react-icons/md';
import { BsAirplane } from 'react-icons/bs';
import { RiBankLine } from 'react-icons/ri';
import React from 'react';
import * as AllFiIcons from 'react-icons/fi';

// Central map from category icon-key → JSX icon component
export const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
    ecommerce: <FiShoppingBag size={22} />,
    corporate: <FiBarChart2 size={22} />,
    'landing-page': <HiOutlineRocketLaunch size={22} />,
    saas: <FiTrendingUp size={22} />,
    restaurant: <MdOutlineRestaurant size={22} />,
    'real-estate': <FiHome size={22} />,
    healthcare: <MdOutlineLocalHospital size={22} />,
    education: <FiBookOpen size={22} />,
    portfolio: <FiTarget size={22} />,
    hotel: <MdOutlineHotel size={22} />,
    law: <MdOutlineBalance size={22} />,
    fintech: <RiBankLine size={22} />,
    logistics: <FiTruck size={22} />,
    fitness: <MdOutlineFitnessCenter size={22} />,
    salon: <FiScissors size={22} />,
    startup: <FiZap size={22} />,
    travel: <BsAirplane size={22} />,
    webapp: <FiGlobe size={22} />,
    booking: <FiCalendar size={22} />,
    ngo: <FiUsers size={22} />,
};

// USP icon mapping by key
export const USP_ICON_MAP: Record<string, React.ReactNode> = {
    '🎯': <FiTarget size={26} />,
    '⚡': <FiZap size={26} />,
    '📈': <FiTrendingUp size={26} />,
    '🔒': <FiShield size={26} />,
    '🛠️': <FiTool size={26} />,
    '🌐': <FiGlobe size={26} />,
};

// Helper for dynamic categories created by admin
export const renderCategoryIcon = (cat: { slug: string, icon?: string }, size = 22) => {
    if (CATEGORY_ICON_MAP[cat.slug]) return CATEGORY_ICON_MAP[cat.slug];
    
    if (cat.icon && cat.icon.startsWith('Fi') && (AllFiIcons as any)[cat.icon]) {
        const DynamicIcon = (AllFiIcons as any)[cat.icon];
        return <DynamicIcon size={size} />;
    }
    
    if (cat.icon) {
        return <span style={{ fontSize: size }}>{cat.icon}</span>;
    }

    return <FiGlobe size={size} />;
};
