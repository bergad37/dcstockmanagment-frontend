import { create } from 'zustand';
import supplierApi, { type SupplierPayload } from '../api/supplierApi';

interface Supplier {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
}

interface SupplierState {
  suppliers: Supplier[] | null;
  loading: boolean;
  success: boolean;
  fetchSuppliers: (query?: string, page?: number, limit?: number) => Promise<void>;
  createSupplier: (data: SupplierPayload) => Promise<void>;
  updateSupplier: (id: string, data: SupplierPayload) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
}

export const useSupplierStore = create<SupplierState>((set) => ({
  suppliers: null,
  loading: false,
  success: false,

  createSupplier: async (data) => {
    try {
      set({ loading: true });
      const res = await supplierApi.create(data);
      set({ suppliers: res.data.data, loading: false, success: res.data.success });
    } catch {
      set({ suppliers: null, success: false });
    }
  },

  fetchSuppliers: async (query?: string, page?: number, limit?: number) => {
    try {
      set({ loading: true });
      const params: Record<string, any> = {};
  if (query) params.searchKey = query;
      if (page) params.page = page;
      if (limit) params.limit = limit;

      const res = await supplierApi.list(Object.keys(params).length ? params : undefined);
      const payload = res.data?.data;
      const list = payload?.suppliers ?? payload ?? [];
      set({ suppliers: list, loading: false });
    } catch {
      set({ suppliers: null });
    }
  },

  updateSupplier: async (id, data) => {
    try {
      set({ loading: true });
      const res = await supplierApi.update(id, data);
      const payload = res.data?.data;
      const list = payload?.suppliers ?? payload ?? [];
      set({ suppliers: list, loading: false, success: res.data?.success ?? true });
    } catch {
      set({ suppliers: null, success: false });
    }
  },

  deleteSupplier: async (id) => {
    try {
      set({ loading: true });
      const res = await supplierApi.delete(id);
      const payload = res.data?.data;
      const list = payload?.suppliers ?? payload ?? [];
      set({ suppliers: list, loading: false, success: res.data?.success ?? true });
    } catch {
      set({ suppliers: null, success: false });
    }
  }
}));

export default useSupplierStore;
