import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Review {
    id: number;
    projectSlug: string;
    userName: string;
    userEmail: string;
    rating: number;
    text: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

interface ReviewState {
    reviews: Review[];
    loading: boolean;
}

const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        reviews: [],
        loading: false,
    } as ReviewState,
    reducers: {
        setReviews: (state, action: PayloadAction<Review[]>) => {
            state.reviews = action.payload;
        },
        addReview: (state, action: PayloadAction<Review>) => {
            state.reviews.unshift(action.payload);
        },
        approveReview: (state, action: PayloadAction<number>) => {
            const r = state.reviews.find(r => r.id === action.payload);
            if (r) r.status = 'approved';
        },
        rejectReview: (state, action: PayloadAction<number>) => {
            const r = state.reviews.find(r => r.id === action.payload);
            if (r) r.status = 'rejected';
        },
        deleteReview: (state, action: PayloadAction<number>) => {
            state.reviews = state.reviews.filter(r => r.id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setReviews, addReview, approveReview, rejectReview, deleteReview, setLoading } = reviewSlice.actions;
export default reviewSlice.reducer;
