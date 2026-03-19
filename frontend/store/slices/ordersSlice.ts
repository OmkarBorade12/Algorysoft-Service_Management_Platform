import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

export type OrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

export interface OrderMessage {
    sender: 'admin' | 'client';
    text: string;
    time: string;
}

export interface OrderItem {
    id: number | string;
    order_id: string; // Backend calls it order_id for the display code
    client_name: string;
    client_email: string;
    product: string;
    tier: string;
    amount: number;
    status: OrderStatus;
    progress: number;
    date: string;
    chat: OrderMessage[];
}

// Map backend to frontend
const mapOrder = (o: any): OrderItem => ({
    id: o.id,
    order_id: o.order_id || `ORD-${o.id}`,
    client_name: o.client_name,
    client_email: o.client_email,
    product: o.product,
    tier: o.tier,
    amount: Number(o.amount),
    status: o.status as OrderStatus,
    progress: o.progress,
    date: o.date,
    chat: o.chat || [],
});

interface OrdersState {
    items: OrderItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: OrdersState = {
    items: [],
    status: 'idle',
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
    const response = await api.get('/api/orders/');
    return response.data.map(mapOrder);
});

export const addOrderThunk = createAsyncThunk('orders/addOrder', async (order: Partial<OrderItem>) => {
    const response = await api.post('/api/orders/', {
        order_id: order.order_id,
        client_name: order.client_name,
        client_email: order.client_email,
        product: order.product,
        tier: order.tier,
        amount: order.amount,
        status: order.status,
        progress: order.progress,
        chat: order.chat || []
    });
    return mapOrder(response.data);
});

export const updateOrderStatusThunk = createAsyncThunk('orders/updateStatus', async ({ id, status }: { id: string | number; status: OrderStatus }) => {
    const response = await api.patch(`/api/orders/${id}/`, { status });
    return mapOrder(response.data);
});

export const updateOrderProgressThunk = createAsyncThunk('orders/updateProgress', async ({ id, progress }: { id: string | number; progress: number }) => {
    const response = await api.patch(`/api/orders/${id}/`, { progress });
    return mapOrder(response.data);
});

export const addOrderMessageThunk = createAsyncThunk('orders/addMessage', async ({ id, message, chat }: { id: string | number; message: OrderMessage; chat: OrderMessage[] }) => {
    const newChat = [...chat, message];
    const response = await api.patch(`/api/orders/${id}/`, { chat: newChat });
    return mapOrder(response.data);
});

export const deleteOrderThunk = createAsyncThunk('orders/deleteOrder', async (id: string | number) => {
    await api.delete(`/api/orders/${id}/`);
    return id;
});

export const updateOrderAmountThunk = createAsyncThunk('orders/updateAmount', async ({ id, amount }: { id: string | number; amount: number }) => {
    const response = await api.patch(`/api/orders/${id}/`, { amount });
    return mapOrder(response.data);
});

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = 'succeeded';
            })
            .addCase(addOrderThunk.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
                const index = state.items.findIndex(o => o.id == action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(updateOrderAmountThunk.fulfilled, (state, action) => {
                const index = state.items.findIndex(o => o.id == action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(updateOrderProgressThunk.fulfilled, (state, action) => {
                const index = state.items.findIndex(o => o.id == action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(addOrderMessageThunk.fulfilled, (state, action) => {
                const index = state.items.findIndex(o => o.id == action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteOrderThunk.fulfilled, (state, action) => {
                state.items = state.items.filter(o => o.id != action.payload);
            });
    }
});

export default ordersSlice.reducer;
