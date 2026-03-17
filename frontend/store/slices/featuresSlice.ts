import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Feature {
    id: number;
    name: string;
    price: number;
}

interface FeaturesState {
    items: Feature[];
}

const initialState: FeaturesState = {
    items: [
        { id: 1, name: 'Static Frontend', price: 1000 },
        { id: 2, name: 'Contact Form', price: 500 },
        { id: 3, name: 'Domain Setup', price: 1500 },
        { id: 4, name: 'Dynamic Frontend', price: 3000 },
        { id: 5, name: 'Admin Panel', price: 5000 },
        { id: 6, name: 'Database (MongoDB)', price: 4000 },
        { id: 7, name: 'Full Stack App', price: 8000 },
        { id: 8, name: 'AWS Deployment', price: 5000 },
        { id: 9, name: 'Payment Gateway', price: 2000 },
    ],
};

const featuresSlice = createSlice({
    name: 'features',
    initialState,
    reducers: {
        addFeature: (state, action: PayloadAction<Omit<Feature, 'id'>>) => {
            const nextId = state.items.length > 0 ? Math.max(...state.items.map(f => f.id)) + 1 : 1;
            state.items.push({ id: nextId, ...action.payload });
        },
        updateFeature: (state, action: PayloadAction<Feature>) => {
            const idx = state.items.findIndex((f) => f.id === action.payload.id);
            if (idx !== -1) {
                state.items[idx] = action.payload;
            }
        },
        deleteFeature: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((f) => f.id !== action.payload);
        },
    },
});

export const { addFeature, updateFeature, deleteFeature } = featuresSlice.actions;
export default featuresSlice.reducer;
