import { create } from 'zustand';
import stockTransferApi, { type TransferPayload } from '../api/stockTransferApi';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StockTransferState {
  transfers: any[];
  pagination: Pagination | null;
  loading: boolean;
  createLoading: boolean;
  error: string | null;
  fetchTransfers: (params?: Record<string, any>) => Promise<void>;
  createTransfer: (data: TransferPayload) => Promise<void>;
}

export const useStockTransferStore = create<StockTransferState>((set) => ({
  transfers: [],
  pagination: null,
  loading: false,
  createLoading: false,
  error: null,

  fetchTransfers: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await stockTransferApi.list(params);
      const payload = res.data?.data;
      set({
        transfers: payload?.transfers ?? [],
        pagination: payload?.pagination ?? null,
        loading: false,
      });
    } catch {
      set({ loading: false, error: 'Failed to load transfer history' });
    }
  },

  createTransfer: async (data) => {
    set({ createLoading: true, error: null });
    try {
      await stockTransferApi.create(data);
      set({ createLoading: false });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || 'Failed to complete transfer';
      set({ createLoading: false, error: msg });
      throw new Error(msg);
    }
  },
}));
