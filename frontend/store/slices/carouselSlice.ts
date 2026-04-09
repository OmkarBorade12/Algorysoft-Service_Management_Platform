import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

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

export interface ProductDetailSlide {
    id: number;
    text: string;
    image?: string;
    order: number;
    isActive: boolean;
}

interface CarouselState {
    slides: CarouselSlide[];
    productSlides: ProductDetailSlide[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const mapSlide = (s: any): CarouselSlide => ({
    id: s.id,
    title: s.title || '',
    subtitle: s.subtitle || '',
    ctaText: s.cta_text || '',
    ctaLink: s.cta_link || '',
    image: s.image,
    bgColor: s.bg_color || '',
    order: s.order || 1,
    isActive: s.is_active,
});

const mapToBackendSlide = (s: Partial<CarouselSlide>) => ({
    type: 'home',
    title: s.title,
    subtitle: s.subtitle,
    cta_text: s.ctaText,
    cta_link: s.ctaLink,
    image: s.image,
    bg_color: s.bgColor,
    order: s.order,
    is_active: s.isActive,
});

const mapProductSlide = (s: any): ProductDetailSlide => ({
    id: s.id,
    text: s.text || '',
    image: s.image,
    order: s.order || 1,
    isActive: s.is_active,
});

const mapToBackendProductSlide = (s: Partial<ProductDetailSlide>) => ({
    type: 'product',
    text: s.text,
    image: s.image,
    order: s.order,
    is_active: s.isActive,
});

export const fetchCarousel = createAsyncThunk('carousel/fetchCarousel', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/api/carousels/');
        const home = response.data.filter((s: any) => s.type === 'home').map(mapSlide);
        const product = response.data.filter((s: any) => s.type === 'product').map(mapProductSlide);
        return { home, product };
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Failed to fetch carousels');
    }
});

export const addSlideThunk = createAsyncThunk('carousel/addSlide', async (slide: Partial<CarouselSlide>, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/carousels/', mapToBackendSlide(slide));
        return mapSlide(response.data);
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Failed to add slide');
    }
});

export const updateSlideThunk = createAsyncThunk('carousel/updateSlide', async (slide: CarouselSlide, { rejectWithValue }) => {
    try {
        const response = await api.put(`/api/carousels/${slide.id}/`, mapToBackendSlide(slide));
        return mapSlide(response.data);
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Failed to update slide');
    }
});

export const toggleSlideActiveThunk = createAsyncThunk('carousel/toggleSlide', async (slide: CarouselSlide, { rejectWithValue }) => {
    try {
        const updated = { ...slide, isActive: !slide.isActive };
        const response = await api.put(`/api/carousels/${slide.id}/`, mapToBackendSlide(updated));
        return mapSlide(response.data);
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Failed to toggle slide');
    }
});

export const deleteSlideThunk = createAsyncThunk('carousel/deleteSlide', async (id: number, { rejectWithValue }) => {
    try {
        await api.delete(`/api/carousels/${id}/`);
        return id;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Failed to delete slide');
    }
});

// Product Strip Thunks
export const addProductSlideThunk = createAsyncThunk('carousel/addProductSlide', async (slide: Partial<ProductDetailSlide>, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/carousels/', mapToBackendProductSlide(slide));
        return mapProductSlide(response.data);
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Failed to add product item');
    }
});

export const updateProductSlideThunk = createAsyncThunk('carousel/updateProductSlide', async (slide: ProductDetailSlide, { rejectWithValue }) => {
    try {
        const response = await api.put(`/api/carousels/${slide.id}/`, mapToBackendProductSlide(slide));
        return mapProductSlide(response.data);
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Failed to update product item');
    }
});

export const toggleProductSlideActiveThunk = createAsyncThunk('carousel/toggleProductSlide', async (slide: ProductDetailSlide, { rejectWithValue }) => {
    try {
        const updated = { ...slide, isActive: !slide.isActive };
        const response = await api.put(`/api/carousels/${slide.id}/`, mapToBackendProductSlide(updated));
        return mapProductSlide(response.data);
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Failed to toggle product item');
    }
});

export const deleteProductSlideThunk = createAsyncThunk('carousel/deleteProductSlide', async (id: number, { rejectWithValue }) => {
    try {
        await api.delete(`/api/carousels/${id}/`);
        return id;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || 'Failed to delete product item');
    }
});

const initialState: CarouselState = {
    slides: [],
    productSlides: [],
    status: 'idle',
};

const carouselSlice = createSlice({
    name: 'carousel',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCarousel.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCarousel.fulfilled, (state, action) => {
                state.slides = action.payload.home;
                state.productSlides = action.payload.product;
                state.status = 'succeeded';
            })
            .addCase(fetchCarousel.rejected, (state) => {
                state.status = 'failed';
            })
            // Home Slides
            .addCase(addSlideThunk.fulfilled, (state, action) => {
                state.slides.push(action.payload);
            })
            .addCase(updateSlideThunk.fulfilled, (state, action) => {
                const idx = state.slides.findIndex(s => s.id === action.payload.id);
                if (idx !== -1) state.slides[idx] = action.payload;
            })
            .addCase(toggleSlideActiveThunk.fulfilled, (state, action) => {
                const idx = state.slides.findIndex(s => s.id === action.payload.id);
                if (idx !== -1) state.slides[idx] = action.payload;
            })
            .addCase(deleteSlideThunk.fulfilled, (state, action) => {
                state.slides = state.slides.filter(s => s.id !== action.payload);
            })
            // Product Slides
            .addCase(addProductSlideThunk.fulfilled, (state, action) => {
                state.productSlides.push(action.payload);
            })
            .addCase(updateProductSlideThunk.fulfilled, (state, action) => {
                const idx = state.productSlides.findIndex(s => s.id === action.payload.id);
                if (idx !== -1) state.productSlides[idx] = action.payload;
            })
            .addCase(toggleProductSlideActiveThunk.fulfilled, (state, action) => {
                const idx = state.productSlides.findIndex(s => s.id === action.payload.id);
                if (idx !== -1) state.productSlides[idx] = action.payload;
            })
            .addCase(deleteProductSlideThunk.fulfilled, (state, action) => {
                state.productSlides = state.productSlides.filter(s => s.id !== action.payload);
            });
    },
});

export default carouselSlice.reducer;
