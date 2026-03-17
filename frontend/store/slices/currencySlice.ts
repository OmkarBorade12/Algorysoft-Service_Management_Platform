import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrencyState {
    currency: 'INR' | 'USD';
    usdRate: number; // 1 USD = N INR
}

const currencySlice = createSlice({
    name: 'currency',
    initialState: {
        currency: 'INR',
        usdRate: 83.5,
    } as CurrencyState,
    reducers: {
        setCurrency: (state, action: PayloadAction<'INR' | 'USD'>) => {
            state.currency = action.payload;
        },
        toggleCurrency: (state) => {
            state.currency = state.currency === 'INR' ? 'USD' : 'INR';
        },
        setUsdRate: (state, action: PayloadAction<number>) => {
            state.usdRate = action.payload;
        },
    },
});

export const { setCurrency, toggleCurrency, setUsdRate } = currencySlice.actions;
export default currencySlice.reducer;

// Helper to format price
export function formatPrice(priceINR: number, currency: 'INR' | 'USD', rate: number): string {
    if (currency === 'USD') {
        const usd = priceINR / rate;
        return `$${usd.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
    return `₹${priceINR.toLocaleString('en-IN')}`;
}
