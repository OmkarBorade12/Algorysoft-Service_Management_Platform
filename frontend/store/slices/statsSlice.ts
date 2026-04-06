import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';

interface LandingStats {
    websites_delivered: number;
    happy_businesses: number;
    avg_rating: string;
}

interface StatsState {
    landing: LandingStats;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: StatsState = {
    landing: {
        websites_delivered: 0,
        happy_businesses: 0,
        avg_rating: '5.0',
    },
    status: 'idle',
};

export const fetchLandingStats = createAsyncThunk('stats/fetchLandingStats', async () => {
    const response = await api.get('/api/landing-stats/');
    return response.data;
});

const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLandingStats.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLandingStats.fulfilled, (state, action) => {
                state.landing = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchLandingStats.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export default statsSlice.reducer;
