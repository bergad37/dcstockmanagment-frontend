import { create } from 'zustand';
import stockApi, {
  type StockTransaction,
  type StockOutPayload,
  type StockInPayload
} from '../api/stockApi';
import { dummyStockOut, dummyInventory } from '../data/dummyData';

interface StockState {
  stockOut: StockTransaction[];
  stock: StockTransaction[];
  transactions: StockTransaction[];
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
  resetStockOutSuccess: (value?: boolean) => void;
  updateStock: (payload: StockInPayload, params: string) => Promise<void>;
  markAsReturned: (
    payload: Partial<StockInPayload>,
    params: string
  ) => Promise<void>;
}

export const useStockStore = create<StockState>((set) => ({
  stockOut: dummyStockOut,
  stock: [],
  transactions: [],

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
      set({ stock: res.data.data, stockLoading: false });
    } catch (e) {
      console.error(e);
      set({
        stock: [],
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
      set({ transactions: res.data.data, allTransactionsLoading: false });
    } catch (e) {
      console.error(e);
      set({
        transactions: [],
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
      set({
        stock: res.data.data,
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
      const res = await stockApi.fetchStock();
      set({
        stock: res.data.data,
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
  }
}));
