import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    id: number;
    title: string;
    price: number;          // total price (basePrice + tierPrice if tier item, otherwise base alone)
    originalPrice: number;
    discount: number;
    icon?: string;
    slug?: string;
    category?: string;
    image?: string;
    quantity: number;
    tier?: string;          // tier key: 'Basic' | 'Silver' | 'Gold' (undefined = no tier)
    basePrice?: number;     // original product price set during creation
    tierPrice?: number;     // the tier add-on price
}

// Per-user cart: keyed by user email (or 'guest')
interface UserCart {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

interface CartState {
    byUser: Record<string, UserCart>;
    // Computed for the current user (populated by selectors)
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    currentUserEmail: string;
}

const emptyCart = (): UserCart => ({ items: [], totalItems: 0, totalPrice: 0 });

const calculateTotals = (items: CartItem[]) => ({
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
});

const initialState: CartState = {
    byUser: {},
    items: [],
    totalItems: 0,
    totalPrice: 0,
    currentUserEmail: 'guest',
};

const syncCurrent = (state: CartState) => {
    if (!state.byUser) state.byUser = {};
    if (!state.currentUserEmail) state.currentUserEmail = 'guest';
    const uc = state.byUser[state.currentUserEmail] || emptyCart();
    state.items = uc.items;
    state.totalItems = uc.totalItems;
    state.totalPrice = uc.totalPrice;
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartUser: (state, action: PayloadAction<string>) => {
            if (!state.byUser) state.byUser = {};
            state.currentUserEmail = action.payload || 'guest';
            syncCurrent(state);
        },
        addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
            if (!state.byUser) state.byUser = {};
            const email = state.currentUserEmail || 'guest';
            if (!state.byUser[email]) state.byUser[email] = emptyCart();
            
            const existingItem = state.byUser[email].items.find((item) => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.byUser[email].items.push({ ...action.payload, quantity: 1 });
            }
            
            const totals = calculateTotals(state.byUser[email].items);
            state.byUser[email].totalItems = totals.totalItems;
            state.byUser[email].totalPrice = totals.totalPrice;
            syncCurrent(state);
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            if (!state.byUser) state.byUser = {};
            const email = state.currentUserEmail || 'guest';
            if (!state.byUser[email]) return;
            
            state.byUser[email].items = state.byUser[email].items.filter((item) => item.id !== action.payload);
            const totals = calculateTotals(state.byUser[email].items);
            state.byUser[email].totalItems = totals.totalItems;
            state.byUser[email].totalPrice = totals.totalPrice;
            syncCurrent(state);
        },
        updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
            if (!state.byUser) state.byUser = {};
            const email = state.currentUserEmail || 'guest';
            if (!state.byUser[email]) return;
            
            const item = state.byUser[email].items.find((i) => i.id === action.payload.id);
            if (item) {
                item.quantity = Math.max(1, action.payload.quantity);
            }
            
            const totals = calculateTotals(state.byUser[email].items);
            state.byUser[email].totalItems = totals.totalItems;
            state.byUser[email].totalPrice = totals.totalPrice;
            syncCurrent(state);
        },
        clearCart: (state) => {
            if (!state.byUser) state.byUser = {};
            const email = state.currentUserEmail || 'guest';
            state.byUser[email] = emptyCart();
            syncCurrent(state);
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartUser } = cartSlice.actions;
export default cartSlice.reducer;
