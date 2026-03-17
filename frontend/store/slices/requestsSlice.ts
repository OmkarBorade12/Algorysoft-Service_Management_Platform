import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RequestStatus = 'New' | 'Approved' | 'Quoted' | 'In Development';

export interface CustomRequest {
    id: string;
    client: string;
    email: string;
    requirements: string;
    status: RequestStatus;
    date: string;
    phone?: string;
    business?: string;
    timeline?: string;
    budget?: string;
}

interface RequestsState {
    items: CustomRequest[];
}

const initialState: RequestsState = {
    items: [],
};

const requestsSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        addRequest: (state, action: PayloadAction<CustomRequest>) => {
            state.items.unshift(action.payload);
        },
        updateRequestStatus: (state, action: PayloadAction<{id: string, status: RequestStatus}>) => {
            const req = state.items.find(r => r.id === action.payload.id);
            if (req) {
                req.status = action.payload.status;
            }
        },
        deleteRequest: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(r => r.id !== action.payload);
        }
    }
});

export const { addRequest, updateRequestStatus, deleteRequest } = requestsSlice.actions;
export default requestsSlice.reducer;
