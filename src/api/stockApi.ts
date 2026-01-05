import axiosClient from './axiosClient';

export interface StockOutPayload {
  productId: string;
  type: 'SOLD' | 'RENTED'; // SOLD or RENTED
  clientName: string;
  clientEmail: string;
  quantity: number;
  returnDate?: string; // Only for RENTED type
  expectedReturnDate?: string;
}

export interface StockInPayload {
  productId: string;
  quantity: number;
}

export interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'SOLD' | 'RENTED';
  clientName: string;
  clientEmail: string;
  quantity: number;
  transactionDate: string;
  returnDate?: string;
  status?: 'ACTIVE' | 'RETURNED'; // For rented items
  createdAt: string;
  updatedAt: string;
}

const stockApi = {
  fetchStock: (params?: Record<string, any>) =>
    axiosClient.get('/stock', { params }),

  // Fetch all stock out transactions
  fetchAllTransactions: (params?: Record<string, any>) =>
    axiosClient.get('/transactions', { params }),

  // Stock Out - Record sold or rented items
  recordStockOut: (payload: StockOutPayload) =>
    axiosClient.post('/transactions/stock/out', payload),

  // Stock In - Add items back to inventory
  recordStockIn: (payload: StockInPayload) =>
    axiosClient.post('/stock/in', payload),

  // Fetch stock out by type (SOLD or RENTED)
  fetchStockOutByType: (type: 'SOLD' | 'RENTED') =>
    axiosClient.get(`/stock/out?type=${type}`),

  // Fetch all stock in/inventory
  fetchInventory: () => axiosClient.get('/stock/inventory'),

  // Mark rented item as returned
  markAsReturned: (payload: any, transactionId: string) =>
    axiosClient.patch(`/stock/out/${transactionId}/return`, payload),

  // Stock In - Add items quantity in stock
  updateStockIn: (payload: StockInPayload, id: string) =>
    axiosClient.put(`/stock/${id}`, payload)
};

export default stockApi;
