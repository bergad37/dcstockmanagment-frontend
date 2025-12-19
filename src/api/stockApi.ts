import axiosClient from './axiosClient';

export interface StockOutPayload {
  productId: string;
  type: 'SOLD' | 'RENTED'; // SOLD or RENTED
  clientName: string;
  clientEmail: string;
  quantity: number;
  returnDate?: string; // Only for RENTED type
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
  fetchStock: () => axiosClient.get('/stock'),

  // Stock Out - Record sold or rented items
  recordStockOut: (payload: StockOutPayload) =>
    axiosClient.post('/stock/out', payload),

  // Stock In - Add items back to inventory
  recordStockIn: (payload: StockInPayload) =>
    axiosClient.post('/stock/in', payload),

  // Fetch all stock out transactions
  fetchStockOut: () => axiosClient.get('/stock/out'),

  // Fetch stock out by type (SOLD or RENTED)
  fetchStockOutByType: (type: 'SOLD' | 'RENTED') =>
    axiosClient.get(`/stock/out?type=${type}`),

  // Fetch all stock in/inventory
  fetchInventory: () => axiosClient.get('/stock/inventory'),

  // Mark rented item as returned
  markAsReturned: (transactionId: string) =>
    axiosClient.patch(`/stock/out/${transactionId}/return`)
};

export default stockApi;
