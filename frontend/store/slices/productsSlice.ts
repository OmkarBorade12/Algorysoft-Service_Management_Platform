import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

export interface Product {
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
    tech_input?: string;
    icon: string;
    images?: string[];
    mainImage?: string;
    popular?: boolean;
    pricingTiers?: {
        basic: { price: number; features: string };
        silver: { price: number; features: string };
        gold: { price: number; features: string };
    };
    silverCard?: number | null;   // PricingCard id
    goldCard?: number | null;     // PricingCard id
    silverCardData?: { id: number; name: string; tier: string; price: number; features: string } | null;
    goldCardData?: { id: number; name: string; tier: string; price: number; features: string } | null;
}

interface ProductsState {
    items: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ProductsState = {
    items: [],
    status: 'idle',
};

// Map backend to frontend
const mapProduct = (p: any): Product => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category_name, // Mapping from source='category.name'
    price: Number(p.price),
    originalPrice: Number(p.original_price),
    discount: p.discount,
    views: p.views,
    icon: p.icon,
    isNew: p.is_new,
    featured: p.featured,
    popular: p.popular,
    description: p.description,
    tech: p.tech || [],
    mainImage: p.main_image,
    images: p.images || [],
    pricingTiers: p.pricing_tiers || {},
    silverCard: p.silver_card ?? null,
    goldCard: p.gold_card ?? null,
    silverCardData: p.silver_card_data ?? null,
    goldCardData: p.gold_card_data ?? null,
    tags: [], // Placeholder since it's not in BE model yet
});

// Map frontend to backend
const mapToBackend = (p: Partial<Product>) => {
    // Generate slug from title if missing (mostly for new products)
    const slug = p.slug || p.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `p-${Date.now()}`;
    
    return {
        title: p.title || '',
        slug: slug,
        category: typeof p.category === 'number' ? p.category : 1, // Default to category 1 if ID not found
        price: p.price || 0,
        original_price: p.originalPrice || p.price || 0, // Fallback to price if originalPrice missing
        discount: p.discount || 0,
        icon: p.icon || 'FiBox',
        is_new: !!p.isNew,
        featured: !!p.featured,
        popular: !!p.popular,
        description: p.description || '',
        tech: p.tech || [],
        main_image: p.mainImage || '',
        images: p.images || [],
        pricing_tiers: p.pricingTiers || {
            basic: { price: 0, features: '' },
            silver: { price: 0, features: '' },
            gold: { price: 0, features: '' }
        },
        silver_card: p.silverCard ?? null,
        gold_card: p.goldCard ?? null,
    };
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const response = await api.get('/api/projects/');
    return response.data.map(mapProduct);
});

export const addProductThunk = createAsyncThunk('products/addProduct', async (product: Partial<Product>) => {
    // Note: We need a category ID to create a project on backend
    // For now, let's assume we pass category ID or handle it carefully
    const response = await api.post('/api/projects/', mapToBackend(product));
    return mapProduct(response.data);
});

export const updateProductThunk = createAsyncThunk('products/updateProduct', async (product: Product) => {
    const response = await api.put(`/api/projects/${product.id}/`, mapToBackend(product));
    return mapProduct(response.data);
});

export const deleteProductThunk = createAsyncThunk('products/deleteProduct', async (id: number) => {
    await api.delete(`/api/projects/${id}/`);
    return id;
});

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchProducts.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(addProductThunk.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateProductThunk.fulfilled, (state, action) => {
                const index = state.items.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteProductThunk.fulfilled, (state, action) => {
                state.items = state.items.filter((p) => p.id !== action.payload);
            });
    },
});

export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;
