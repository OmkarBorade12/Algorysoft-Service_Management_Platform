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

const defaultSlides: CarouselSlide[] = [];

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
