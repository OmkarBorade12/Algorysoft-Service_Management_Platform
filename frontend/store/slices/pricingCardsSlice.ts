import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

export interface BasicCard {
    id: number;
    name: string;
    price: number;
    features: string;
}

export interface PricingCard {
    id: number;
    name: string;
    tier: 'silver' | 'gold';
    price: number;
    features: string;
    created_at?: string;
}

interface PricingCardsState {
    basicCard: BasicCard | null;
    cards: PricingCard[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: PricingCardsState = {
    basicCard: null,
    cards: [],
    status: 'idle',
};

const mapBasicCard = (d: any): BasicCard => ({
    id: d.id,
    name: d.name || 'Basic',
    price: Number(d.price),
    features: d.features || '',
});

const mapCard = (d: any): PricingCard => ({
    id: d.id,
    name: d.name,
    tier: d.tier,
    price: Number(d.price),
    features: d.features || '',
    created_at: d.created_at,
});

// ---- BasicCard thunks ----

export const fetchBasicCard = createAsyncThunk('pricingCards/fetchBasicCard', async () => {
    const res = await api.get('/api/basic-card/');
    // Get or create: if none, return null
    if (res.data && res.data.length > 0) return mapBasicCard(res.data[0]);
    return null;
});

export const saveBasicCard = createAsyncThunk('pricingCards/saveBasicCard', async (card: Partial<BasicCard>) => {
    let res;
    if (card.id) {
        res = await api.put(`/api/basic-card/${card.id}/`, { name: card.name || 'Basic', price: card.price || 0, features: card.features || '' });
    } else {
        res = await api.post('/api/basic-card/', { name: card.name || 'Basic', price: card.price || 0, features: card.features || '' });
    }
    return mapBasicCard(res.data);
});

// ---- PricingCard thunks ----

export const fetchPricingCards = createAsyncThunk('pricingCards/fetchAll', async () => {
    const res = await api.get('/api/pricing-cards/');
    return (res.data as any[]).map(mapCard);
});

export const addPricingCard = createAsyncThunk('pricingCards/add', async (card: Omit<PricingCard, 'id' | 'created_at'>) => {
    const res = await api.post('/api/pricing-cards/', card);
    return mapCard(res.data);
});

export const updatePricingCard = createAsyncThunk('pricingCards/update', async (card: PricingCard) => {
    const res = await api.put(`/api/pricing-cards/${card.id}/`, {
        name: card.name, tier: card.tier, price: card.price, features: card.features
    });
    return mapCard(res.data);
});

export const deletePricingCard = createAsyncThunk('pricingCards/delete', async (id: number) => {
    await api.delete(`/api/pricing-cards/${id}/`);
    return id;
});

const pricingCardsSlice = createSlice({
    name: 'pricingCards',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // BasicCard
            .addCase(fetchBasicCard.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchBasicCard.fulfilled, (state, action) => {
                state.basicCard = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchBasicCard.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(saveBasicCard.fulfilled, (state, action) => {
                state.basicCard = action.payload;
            })
            // PricingCards
            .addCase(fetchPricingCards.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchPricingCards.fulfilled, (state, action) => {
                state.cards = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchPricingCards.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(addPricingCard.fulfilled, (state, action) => {
                state.cards.unshift(action.payload);
            })
            .addCase(updatePricingCard.fulfilled, (state, action) => {
                const idx = state.cards.findIndex(c => c.id === action.payload.id);
                if (idx !== -1) state.cards[idx] = action.payload;
            })
            .addCase(deletePricingCard.fulfilled, (state, action) => {
                state.cards = state.cards.filter(c => c.id !== action.payload);
            });
    },
});

export default pricingCardsSlice.reducer;
