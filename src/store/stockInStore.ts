import { create } from 'zustand';
import stockInApi, { type StockInPayload } from '../api/stockInApi';

interface StockInRecord {
  id: string;
  [key: string]: any;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StockInState {
  stockIns: StockInRecord[];
  loading: boolean;
  createLoading: boolean;
  error: string | null;
  pagination: Pagination | null;
  fetchStockIns: (params?: Record<string, any>) => Promise<void>;
  createStockIn: (data: StockInPayload) => Promise<void>;
}

export const useStockInStore = create<StockInState>((set) => ({
  stockIns: [],
  loading: false,
  createLoading: false,
  error: null,
  pagination: null,

  fetchStockIns: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await stockInApi.list(params);
      const payload = res.data?.data;
      const list = payload?.stockIns ?? [];
      const p = payload?.pagination ?? null;
      set({ stockIns: list, pagination: p, loading: false });
    } catch {
      set({ loading: false, error: 'Failed to load stock-in records' });
    }
  },

  createStockIn: async (data) => {
    set({ createLoading: true, error: null });
    try {
      await stockInApi.create(data);
      set({ createLoading: false });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || 'Failed to record stock-in';
      set({ createLoading: false, error: msg });
      throw new Error(msg);
    }
  },
}));
