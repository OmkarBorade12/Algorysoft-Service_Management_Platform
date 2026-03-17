import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    cartOpen: boolean;
    wishlistOpen: boolean;
    mobileMenuOpen: boolean;
    searchOpen: boolean;
    loginModalOpen: boolean;
    registerModalOpen: boolean;
    activeCategory: string | null;
}

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        cartOpen: false,
        wishlistOpen: false,
        mobileMenuOpen: false,
        searchOpen: false,
        loginModalOpen: false,
        registerModalOpen: false,
        activeCategory: null,
    } as UIState,
    reducers: {
        toggleCart: (state) => { state.cartOpen = !state.cartOpen; },
        toggleWishlist: (state) => { state.wishlistOpen = !state.wishlistOpen; },
        toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen; },
        toggleSearch: (state) => { state.searchOpen = !state.searchOpen; },
        openLogin: (state) => { state.loginModalOpen = true; state.registerModalOpen = false; },
        openRegister: (state) => { state.registerModalOpen = true; state.loginModalOpen = false; },
        closeModals: (state) => {
            state.loginModalOpen = false;
            state.registerModalOpen = false;
            state.cartOpen = false;
            state.wishlistOpen = false;
        },
        setActiveCategory: (state, action: PayloadAction<string | null>) => {
            state.activeCategory = action.payload;
        },
    },
});

export const {
    toggleCart, toggleWishlist, toggleMobileMenu, toggleSearch,
    openLogin, openRegister, closeModals, setActiveCategory,
} = uiSlice.actions;
export default uiSlice.reducer;
