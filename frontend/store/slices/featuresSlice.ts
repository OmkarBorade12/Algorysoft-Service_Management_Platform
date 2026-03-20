import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

export interface Feature {
    id: number;
    name: string;
    price: number;
}

interface FeaturesState {
    items: Feature[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: FeaturesState = {
    items: [],
    status: 'idle',
};

export const fetchFeatures = createAsyncThunk('features/fetchFeatures', async () => {
    const response = await api.get('/api/features/');
    return response.data.map((f: any) => ({
        id: f.id,
        name: f.name,
        price: Number(f.price)
    }));
});

export const addFeatureThunk = createAsyncThunk('features/addFeature', async (feature: Omit<Feature, 'id'>) => {
    const response = await api.post('/api/features/', feature);
    return {
        id: response.data.id,
        name: response.data.name,
        price: Number(response.data.price)
    };
});

export const updateFeatureThunk = createAsyncThunk('features/updateFeature', async (feature: Feature) => {
    const response = await api.put(`/api/features/${feature.id}/`, feature);
    return {
        id: response.data.id,
        name: response.data.name,
        price: Number(response.data.price)
    };
});

export const deleteFeatureThunk = createAsyncThunk('features/deleteFeature', async (id: number) => {
    await api.delete(`/api/features/${id}/`);
    return id;
});

const featuresSlice = createSlice({
    name: 'features',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeatures.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFeatures.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchFeatures.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(addFeatureThunk.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateFeatureThunk.fulfilled, (state, action) => {
                const index = state.items.findIndex(f => f.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteFeatureThunk.fulfilled, (state, action) => {
                state.items = state.items.filter(f => f.id !== action.payload);
            });
    }
});

export default featuresSlice.reducer;
