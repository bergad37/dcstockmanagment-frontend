import { create } from 'zustand';
import stockApi, {
  type StockTransaction,
  type StockOutPayload,
  type StockInPayload
} from '../api/stockApi';
import { dummyStockOut, dummyInventory } from '../data/dummyData';

interface StockState {
  // Stock Out data
  stockOut: StockTransaction[];
  stock: [];
  transactions: [];
  stockOutLoading: boolean;
  allTransactionsLoading: boolean;
  allTransactionError: string | null;
  stockOutError: string | null;
  stockOutSucess: boolean;

  stockLoading: boolean;
  stockError: string | null;

  // Inventory data
  inventory: StockTransaction[];
  inventoryLoading: boolean;
  inventoryError: string | null;

  // Actions
  fetchAllTransaction: (params?: Record<string, any>) => Promise<void>;
  fetchStockOutByType: (type: 'SOLD' | 'RENTED') => Promise<void>;
  fetchInventory: () => Promise<void>;
  markAsReturned: (transactionId: string) => Promise<void>;
  recordStockOut: (payload: StockOutPayload) => Promise<void>;
  recordStockIn: (payload: StockInPayload) => Promise<void>;
  fetchStock: (params?: Record<string, any>) => Promise<void>;
  // Utility actions
  resetStockOutSuccess: (value?: boolean) => void;
}

export const useStockStore = create<StockState>((set) => ({
  // Initial states - use dummy data for now
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

  // Fetch all items in stock
  fetchStock: async (params?: Record<string, any>) => {
    set({ stockLoading: true, stockError: null });
    try {
      const res = await stockApi.fetchStock(params);
      set({ stock: res.data.data, stockLoading: false });
    } catch (e: unknown) {
      console.error('Error fetching items in stock:', e);
      set({
        stock: [],
        stockLoading: false,
        stockError: null
      });
    }
  },

  // Reset stock out success flag
  resetStockOutSuccess: (value = false) => {
    set({ stockOutSucess: value });
  },

  // Fetch all transactions
  fetchAllTransaction: async (params?: Record<string, any>) => {
    set({ allTransactionsLoading: true, allTransactionError: null });
    try {
      const res = await stockApi.fetchAllTransactions(params);
      set({ transactions: res.data.data, allTransactionsLoading: false });
    } catch (e: unknown) {
      console.error('Error fetching transactions in stock:', e);
      set({
        transactions: [],
        allTransactionsLoading: false,
        allTransactionError: null
      });
    }
  },

  // Fetch stock out by type
  fetchStockOutByType: async (type: 'SOLD' | 'RENTED') => {
    set({ stockOutLoading: true, stockOutError: null });
    try {
      const res = await stockApi.fetchStockOutByType(type);
      set({ stockOut: res.data.data, stockOutLoading: false });
    } catch (e: unknown) {
      console.error('Error fetching stock out by type, using dummy data:', e);
      // Use filtered dummy data as fallback
      const filtered = dummyStockOut.filter((item) => item.type === type);
      set({
        stockOut: filtered,
        stockOutLoading: false,
        stockOutError: null
      });
    }
  },

  // Fetch inventory
  fetchInventory: async () => {
    set({ inventoryLoading: true, inventoryError: null });
    try {
      const res = await stockApi.fetchInventory();
      set({ inventory: res.data.data, inventoryLoading: false });
    } catch (e: unknown) {
      console.error('Error fetching inventory, using dummy data:', e);
      // Use dummy data as fallback
      set({
        inventory: dummyInventory,
        inventoryLoading: false,
        inventoryError: null
      });
    }
  },

  // Record stock out (sell or rent)
  recordStockOut: async (payload: StockOutPayload) => {
    set({ stockOutLoading: true, stockOutError: null });
    try {
      // Refresh stock out list after recording
      const res = await stockApi.recordStockOut(payload);
      set({
        stockOut: res.data.data,
        stockOutSucess: true,
        stockOutLoading: false
      });
    } catch (e: unknown) {
      console.error('Error recording stock out:', e);
      // Add to dummy data for now
      set(() => ({
        stockOut: [],
        stockOutLoading: false,
        stockOutSucess: false
      }));
      throw e;
    }
  },

  // Record stock in (return to inventory)
  recordStockIn: async (payload: StockInPayload) => {
    set({ inventoryLoading: true, inventoryError: null });
    try {
      await stockApi.recordStockIn(payload);
      // Refresh inventory after recording
      const res = await stockApi.fetchInventory();
      set({ inventory: res.data.data, inventoryLoading: false });
    } catch (e: unknown) {
      console.error('Error recording stock in:', e);
      set({
        inventoryLoading: false,
        inventoryError: 'Failed to record stock in'
      });
      throw e;
    }
  },

  // Mark rented item as returned
  markAsReturned: async (transactionId: string) => {
    set({ stockOutLoading: true, stockOutError: null });
    try {
      await stockApi.markAsReturned(transactionId);
      // Refresh stock out list
      const res = await stockApi.fetchStockOut();
      set({ stockOut: res.data.data, stockOutLoading: false });
    } catch (e: unknown) {
      console.error('Error marking as returned:', e);
      // Update locally for now
      set((state) => ({
        stockOut: state.stockOut.map((item) =>
          item.id === transactionId ? { ...item, status: 'RETURNED' } : item
        ),
        stockOutLoading: false
      }));
      throw e;
    }
  }
}));
