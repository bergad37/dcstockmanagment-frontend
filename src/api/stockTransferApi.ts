import axiosClient from './axiosClient';

export interface TransferPayload {
  mainStockProductId: string;
  miniStockProductId?: string | null;
  quantity: number;
  notes?: string;
  transferredBy?: string;
  transferredAt?: string;
}

const stockTransferApi = {
  list: (params?: Record<string, any>) =>
    axiosClient.get('/stock-transfers', { params }),

  create: (payload: TransferPayload) =>
    axiosClient.post('/stock-transfers', payload),
};

export default stockTransferApi;
