import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
    id: number;
    title: string;
    price: number;
    originalPrice: number;
    discount: number;
    icon?: string;
    slug?: string;
    category?: string;
    image?: string;
}

interface UserWishlist {
    items: WishlistItem[];
}

interface WishlistState {
    byUser: Record<string, UserWishlist>;
    items: WishlistItem[];
    currentUserEmail: string;
}

const emptyWishlist = (): UserWishlist => ({ items: [] });

const syncWishlist = (state: WishlistState) => {
    if (!state.byUser) state.byUser = {};
    if (!state.currentUserEmail) state.currentUserEmail = 'guest';
    const uc = state.byUser[state.currentUserEmail] || emptyWishlist();
    state.items = uc.items;
};

const initialState: WishlistState = {
    byUser: {},
    items: [],
    currentUserEmail: 'guest',
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        setWishlistUser: (state, action: PayloadAction<string>) => {
            if (!state.byUser) state.byUser = {};
            state.currentUserEmail = action.payload || 'guest';
            syncWishlist(state);
        },
        addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
            if (!state.byUser) state.byUser = {};
            const email = state.currentUserEmail || 'guest';
            if (!state.byUser[email]) state.byUser[email] = emptyWishlist();
            
            const exists = state.byUser[email].items.find((item) => item.id === action.payload.id);
            if (!exists) {
                state.byUser[email].items.push(action.payload);
            }
            syncWishlist(state);
        },
        removeFromWishlist: (state, action: PayloadAction<number>) => {
            if (!state.byUser) state.byUser = {};
            const email = state.currentUserEmail || 'guest';
            if (!state.byUser[email]) return;
            
            state.byUser[email].items = state.byUser[email].items.filter((item) => item.id !== action.payload);
            syncWishlist(state);
        },
        toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
            if (!state.byUser) state.byUser = {};
            const email = state.currentUserEmail || 'guest';
            if (!state.byUser[email]) state.byUser[email] = emptyWishlist();
            
            const idx = state.byUser[email].items.findIndex((item) => item.id === action.payload.id);
            if (idx >= 0) {
                state.byUser[email].items.splice(idx, 1);
            } else {
                state.byUser[email].items.push(action.payload);
            }
            syncWishlist(state);
        },
        toggleWishlistItem: (state, action: PayloadAction<WishlistItem>) => {
            if (!state.byUser) state.byUser = {};
            const email = state.currentUserEmail || 'guest';
            if (!state.byUser[email]) state.byUser[email] = emptyWishlist();
            
            const idx = state.byUser[email].items.findIndex((item) => item.id === action.payload.id);
            if (idx >= 0) {
                state.byUser[email].items.splice(idx, 1);
            } else {
                state.byUser[email].items.push(action.payload);
            }
            syncWishlist(state);
        },
    },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, toggleWishlistItem, setWishlistUser } = wishlistSlice.actions;
export default wishlistSlice.reducer;
