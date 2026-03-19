import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

export interface Category {
    id: number | string;
    name: string;
    icon: string;
    count: number;
    slug: string;
}

interface CategoriesState {
    items: Category[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CategoriesState = {
    items: [],
    status: 'idle',
};

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    const response = await api.get('/api/categories/');
    return response.data;
});

export const addCategoryThunk = createAsyncThunk('categories/addCategory', async (category: Omit<Category, 'id' | 'count'>) => {
    const response = await api.post('/api/categories/', category);
    return response.data;
});

export const deleteCategoryThunk = createAsyncThunk('categories/deleteCategory', async (id: number | string) => {
    await api.delete(`/api/categories/${id}/`);
    return id;
});

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.items = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = 'succeeded';
            })
            .addCase(addCategoryThunk.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
                state.items = state.items.filter((c) => c.id !== action.payload);
            });
    },
});

export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
