import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CarouselSlide {
    id: number;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    image?: string;
    bgColor: string;
    order: number;
    isActive: boolean;
}

interface CarouselState {
    slides: CarouselSlide[];
    loading: boolean;
}

const defaultSlides: CarouselSlide[] = [
    {
        id: 1,
        title: 'Modern ERP Solutions',
        subtitle: 'Scalable and efficient business management software for your growing enterprise.',
        ctaText: 'Explore ERP',
        ctaLink: '/projects?category=erp',
        bgColor: 'linear-gradient(135deg, #f4fbee 0%, #e5f6d4 100%)',
        order: 1,
        isActive: true,
    },
    {
        id: 2,
        title: 'Advanced CRM Platforms',
        subtitle: 'Build stronger relationships with your customers with our custom CRM tools.',
        ctaText: 'View CRM',
        ctaLink: '/projects?category=crm',
        bgColor: 'linear-gradient(135deg, #e3f2fd 0%, #e1f5fe 100%)',
        order: 2,
        isActive: true,
    },
    {
        id: 3,
        title: 'Bespoke E-commerce Engines',
        subtitle: 'High-performance online stores designed to convert and scale effortlessly.',
        ctaText: 'Shop E-commerce',
        ctaLink: '/projects?category=ecommerce',
        bgColor: 'linear-gradient(135deg, #ede7f6 0%, #f3e5f5 100%)',
        order: 3,
        isActive: true,
    }
];

const carouselSlice = createSlice({
    name: 'carousel',
    initialState: {
        slides: defaultSlides,
        loading: false,
    } as CarouselState,
    reducers: {
        setSlides: (state, action: PayloadAction<CarouselSlide[]>) => {
            state.slides = action.payload;
        },
        addSlide: (state, action: PayloadAction<CarouselSlide>) => {
            state.slides.push(action.payload);
        },
        updateSlide: (state, action: PayloadAction<CarouselSlide>) => {
            const idx = state.slides.findIndex(s => s.id === action.payload.id);
            if (idx !== -1) state.slides[idx] = action.payload;
        },
        deleteSlide: (state, action: PayloadAction<number>) => {
            state.slides = state.slides.filter(s => s.id !== action.payload);
        },
        toggleSlideActive: (state, action: PayloadAction<number>) => {
            const s = state.slides.find(s => s.id === action.payload);
            if (s) s.isActive = !s.isActive;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setSlides, addSlide, updateSlide, deleteSlide, toggleSlideActive, setLoading } = carouselSlice.actions;
export default carouselSlice.reducer;
