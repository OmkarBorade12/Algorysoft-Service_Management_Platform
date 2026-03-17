import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    token?: string;
    role: 'customer' | 'admin';
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean;
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
    } as AuthState,
    reducers: {
        setUser: (state, action: PayloadAction<AuthUser | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
