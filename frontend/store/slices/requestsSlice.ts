import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

export type RequestStatus = 'New' | 'Approved' | 'Quoted' | 'In Development';

export interface CustomRequest {
    id: string; // Backend 'id' is number, but frontend uses string for internal mapping sometimes. 
    // Wait, let's use number/string as appropriate.
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
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: RequestsState = {
    items: [],
    status: 'idle',
};

export const fetchRequests = createAsyncThunk('requests/fetchRequests', async () => {
    const response = await api.get('/api/requests/');
    return response.data;
});

export const addRequestThunk = createAsyncThunk('requests/addRequest', async (req: Partial<CustomRequest>) => {
    const response = await api.post('/api/requests/', req);
    return response.data;
});

export const updateRequestStatusThunk = createAsyncThunk('requests/updateStatus', async ({id, status}: {id: string | number, status: RequestStatus}) => {
    const response = await api.patch(`/api/requests/${id}/`, { status });
    return response.data;
});

export const deleteRequestThunk = createAsyncThunk('requests/deleteRequest', async (id: string | number) => {
    await api.delete(`/api/requests/${id}/`);
    return id;
});

const requestsSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = 'succeeded';
            })
            .addCase(addRequestThunk.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(updateRequestStatusThunk.fulfilled, (state, action) => {
                const index = state.items.findIndex(r => r.id == action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteRequestThunk.fulfilled, (state, action) => {
                state.items = state.items.filter(r => r.id != action.payload);
            });
    }
});

export default requestsSlice.reducer;
