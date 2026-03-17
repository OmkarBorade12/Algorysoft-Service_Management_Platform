import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

export interface OrderMessage {
    sender: 'admin' | 'client';
    text: string;
    time: string;
}

export interface OrderItem {
    id: string;
    clientName: string;
    clientEmail: string;
    product: string;
    tier: 'Basic' | 'Silver' | 'Gold' | 'Custom Request';
    amount: number;
    status: OrderStatus;
    progress: number;
    date: string;
    chat: OrderMessage[];
}

const INITIAL_ORDERS: OrderItem[] = [];

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        items: INITIAL_ORDERS,
    },
    reducers: {
        addOrder: (state, action: PayloadAction<OrderItem>) => {
            state.items.unshift(action.payload);
        },
        updateOrderStatus: (state, action: PayloadAction<{ id: string; status: OrderStatus }>) => {
            const order = state.items.find(o => o.id === action.payload.id);
            if (order) order.status = action.payload.status;
        },
        updateOrderProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
            const order = state.items.find(o => o.id === action.payload.id);
            if (order) order.progress = action.payload.progress;
        },
        addOrderMessage: (state, action: PayloadAction<{ id: string; message: OrderMessage }>) => {
            const order = state.items.find(o => o.id === action.payload.id);
            if (order) {
                if (!order.chat) order.chat = [];
                order.chat.push(action.payload.message);
            }
        },
        deleteOrder: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(o => o.id !== action.payload);
        }
    },
});

export const { updateOrderStatus, updateOrderProgress, addOrderMessage, addOrder, deleteOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
