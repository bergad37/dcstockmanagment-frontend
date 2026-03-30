import { create } from 'zustand';
import stockApi, {
  type StockTransaction,
  type StockOutPayload,
  type StockInPayload
} from '../api/stockApi';
import { dummyStockOut, dummyInventory } from '../data/dummyData';

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

interface StockState {
  stockOut: StockTransaction[];
  // backend usually returns { stocks: [...], pagination: {...} }
  stock: any;
  transactions: any;

  stockPagination: Pagination | null;
  transactionsPagination: Pagination | null;

  stockOutLoading: boolean;
  allTransactionsLoading: boolean;
  allTransactionError: string | null;
  stockOutError: string | null;
  stockOutSucess: boolean;

  stockLoading: boolean;
  stockError: string | null;

  inventory: StockTransaction[];
  inventoryLoading: boolean;
  inventoryError: string | null;

  updateStockLoading: boolean;
  updateStockSucess: boolean;
  updateStockError: string | null;

  markAsReturnedSuccess: boolean;
  markAsReturnedError: string | null;
  markAsReturnedLoading: boolean;

  fetchAllTransaction: (params?: Record<string, any>) => Promise<void>;
  fetchStockOutByType: (type: 'SOLD' | 'RENTED') => Promise<void>;
  fetchInventory: () => Promise<void>;
  recordStockOut: (payload: StockOutPayload) => Promise<void>;
  recordStockIn: (payload: StockInPayload) => Promise<void>;
  fetchStock: (params?: Record<string, any>) => Promise<void>;
  fetchAllStock: () => Promise<void>;
  resetStockOutSuccess: (value?: boolean) => void;
  updateStock: (payload: StockInPayload, params: string) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markAsReturned: (payload: any, params: string) => Promise<void>;
}

export const useStockStore = create<StockState>((set) => ({
  stockOut: dummyStockOut,
  stock: [],
  transactions: [],

  stockPagination: null,
  transactionsPagination: null,

  stockOutLoading: false,
  stockLoading: false,
  stockError: null,
  stockOutError: null,
  stockOutSucess: false,

  inventory: dummyInventory,
  inventoryLoading: false,
  inventoryError: null,

  allTransactionError: null,
  allTransactionsLoading: false,

  updateStockLoading: false,
  updateStockSucess: false,
  updateStockError: null,

  markAsReturnedSuccess: false,
  markAsReturnedError: null,
  markAsReturnedLoading: false,

  fetchStock: async (params) => {
    set({ stockLoading: true, stockError: null });
    try {
      const res = await stockApi.fetchStock(params);
      const payload = res.data?.data;
      const stocks = payload?.stocks ?? payload ?? [];
      const p = payload?.pagination;

      const pagination: Pagination | null = p
        ? {
            page: p.page ?? params?.page ?? 1,
            limit: p.limit ?? params?.limit ?? stocks.length,
            total: p.total ?? stocks.length
          }
        : stocks
          ? {
              page: params?.page ?? 1,
              limit: params?.limit ?? stocks.length,
              total: stocks.length
            }
          : null;

      set({
        stock: payload ?? { stocks },
        stockPagination: pagination,
        stockLoading: false
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      set({
        stock: [],
        stockPagination: null,
        stockLoading: false,
        stockError: 'Failed to fetch stock'
      });
    }
  },

  fetchAllStock: async () => {
    set({ stockLoading: true, stockError: null });
    try {
      const res = await stockApi.fetchAllStock();
      const payload = res.data?.data;
      const stocks = payload?.stocks ?? payload ?? [];

      set({
        stock: payload ?? { stocks },
        stockLoading: false
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      set({
        stock: [],
        stockPagination: null,
        stockLoading: false,
        stockError: 'Failed to fetch stock'
      });
    }
  },

  resetStockOutSuccess: (value = false) => {
    set({ stockOutSucess: value });
  },

  fetchAllTransaction: async (params) => {
    set({ allTransactionsLoading: true, allTransactionError: null });
    try {
      const res = await stockApi.fetchAllTransactions(params);
      const payload = res.data?.data;
      const tx = payload?.transactions ?? payload ?? [];
      const p = payload?.pagination;

      const pagination: Pagination | null = p
        ? {
            page: p.page ?? params?.page ?? 1,
            limit: p.limit ?? params?.limit ?? tx.length,
            total: p.total ?? tx.length
          }
        : tx
          ? {
              page: params?.page ?? 1,
              limit: params?.limit ?? tx.length,
              total: tx.length
            }
          : null;

      set({
        transactions: payload ?? { transactions: tx },
        transactionsPagination: pagination,
        allTransactionsLoading: false
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      set({
        transactions: [],
        transactionsPagination: null,
        allTransactionsLoading: false,
        allTransactionError: 'Failed to fetch transactions'
      });
    }
  },

  fetchStockOutByType: async (type) => {
    set({ stockOutLoading: true, stockOutError: null });
    try {
      const res = await stockApi.fetchStockOutByType(type);
      set({ stockOut: res.data.data, stockOutLoading: false });
    } catch (e) {
      console.error(e);
      set({
        stockOut: dummyStockOut.filter((i) => i.type === type),
        stockOutLoading: false,
        stockOutError: 'Failed to fetch stock out'
      });
    }
  },

  fetchInventory: async () => {
    set({ inventoryLoading: true, inventoryError: null });
    try {
      const res = await stockApi.fetchInventory();
      set({ inventory: res.data.data, inventoryLoading: false });
    } catch (e) {
      console.error(e);
      set({
        inventory: dummyInventory,
        inventoryLoading: false,
        inventoryError: 'Failed to fetch inventory'
      });
    }
  },

  recordStockOut: async (payload) => {
    set({ stockOutLoading: true, stockOutError: null });
    try {
      const res = await stockApi.recordStockOut(payload);
      set({
        stockOut: res.data.data,
        stockOutSucess: true,
        stockOutLoading: false
      });
    } catch (e) {
      console.error(e);
      set({
        stockOutLoading: false,
        stockOutSucess: false,
        stockOutError: 'Failed to record stock out'
      });
      throw e;
    }
  },

  recordStockIn: async (payload) => {
    set({ inventoryLoading: true, inventoryError: null });
    try {
      await stockApi.recordStockIn(payload);
      const res = await stockApi.fetchInventory();
      set({ inventory: res.data.data, inventoryLoading: false });
    } catch (e) {
      console.error(e);
      set({
        inventoryLoading: false,
        inventoryError: 'Failed to record stock in'
      });
      throw e;
    }
  },

  updateStock: async (payload, params) => {
    set({ updateStockLoading: true, updateStockError: null });
    try {
      await stockApi.updateStockIn(payload, params);
      const res = await stockApi.fetchStock();
      const payloadRes = res.data?.data;
      const stocks = payloadRes?.stocks ?? payloadRes ?? [];
      const p = payloadRes?.pagination;
      const pagination: Pagination | null = p
        ? {
            page: p.page ?? 1,
            limit: p.limit ?? stocks.length,
            total: p.total ?? stocks.length
          }
        : {
            page: 1,
            limit: stocks.length,
            total: stocks.length
          };

      set({
        stock: payloadRes ?? { stocks },
        stockPagination: pagination,
        updateStockLoading: false,
        updateStockSucess: true
      });
    } catch (e) {
      console.error(e);
      set({
        updateStockLoading: false,
        updateStockSucess: false,
        updateStockError: 'Failed to update stock'
      });
      throw e;
    }
  },

  markAsReturned: async (payload, params) => {
    set({ markAsReturnedLoading: true, markAsReturnedError: null });
    try {
      await stockApi.markAsReturned(payload, params);
      const res = await stockApi.fetchAllTransactions();
      const payloadRes = res.data?.data;
      const tx = payloadRes?.transactions ?? payloadRes ?? [];
      const p = payloadRes?.pagination;
      const pagination: Pagination | null = p
        ? {
            page: p.page ?? 1,
            limit: p.limit ?? tx.length,
            total: p.total ?? tx.length
          }
        : {
            page: 1,
            limit: tx.length,
            total: tx.length
          };

      set({
        transactions: payloadRes ?? { transactions: tx },
        transactionsPagination: pagination,
        markAsReturnedLoading: false,
        markAsReturnedSuccess: true
      });
    } catch (e) {
      console.error(e);
      set({
        markAsReturnedLoading: false,
        markAsReturnedSuccess: false,
        markAsReturnedError: 'Failed to return item in stock'
      });
      throw e;
    }
  }
}));
