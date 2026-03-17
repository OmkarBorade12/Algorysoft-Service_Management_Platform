import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InvoiceData {
    id: string;
    invoiceNo: string;
    date: string;
    dueDate: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    clientAddress: string;
    projectName: string;
    description: string;
    amount: number;
    gstPercent: number;
    discount: number;
    notes: string;
    status: 'Draft' | 'Sent' | 'Paid';
    createdAt: string;
}

interface InvoicesState {
    items: InvoiceData[];
}

const initialState: InvoicesState = {
    items: [],
};

const invoicesSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {
        addInvoice: (state, action: PayloadAction<InvoiceData>) => {
            state.items.unshift(action.payload);
        },
        updateInvoiceStatus: (state, action: PayloadAction<{ id: string; status: InvoiceData['status'] }>) => {
            const index = state.items.findIndex(i => i.id === action.payload.id);
            if (index !== -1) {
                state.items[index].status = action.payload.status;
            }
        },
        deleteInvoice: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(i => i.id !== action.payload);
        }
    }
});

export const { addInvoice, updateInvoiceStatus, deleteInvoice } = invoicesSlice.actions;
export default invoicesSlice.reducer;
