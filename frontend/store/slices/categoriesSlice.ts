import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Category {
  id: number | string;
  name: string;
  icon: string;
  count: number;
  slug: string;
}

interface CategoriesState {
  items: Category[];
}

const initialState: CategoriesState = {
  items: [],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.items = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.items.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.items.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<number | string>) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },
  },
});

export const { setCategories, addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
