import axiosClient from './axiosClient';

export interface StockInPayload {
  productId: string;
  supplierId?: string | null;
  quantity: number;
  unitCost?: number | null;
  invoiceNo?: string;
  receivedBy?: string;
  notes?: string;
  receivedAt?: string;
}

const stockInApi = {
  list: (params?: Record<string, any>) =>
    axiosClient.get('/stock-in', { params }),

  getById: (id: string) => axiosClient.get(`/stock-in/${id}`),

  create: (payload: StockInPayload) => axiosClient.post('/stock-in', payload),
};

export default stockInApi;
