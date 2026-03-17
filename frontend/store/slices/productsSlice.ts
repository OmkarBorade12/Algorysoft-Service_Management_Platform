import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    icon: string;
    images?: string[];
    mainImage?: string;
    popular?: boolean;
    pricingTiers?: {
        basic: { price: number; features: string };
        silver: { price: number; features: string };
        gold: { price: number; features: string };
    };
}

interface ProductsState {
  items: Product[];
}

const initialState: ProductsState = {
  items: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsSlice.reducer;
