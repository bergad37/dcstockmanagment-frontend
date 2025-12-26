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
  errorSupplier: string | null;
  fetchSuppliers: (query?: string, page?: number, limit?: number) => Promise<void>;
  createSupplier: (data: SupplierPayload) => Promise<any>;
  updateSupplier: (id: string, data: SupplierPayload) => Promise<any>;
  deleteSupplier: (id: string) => Promise<any>;
}

export const useSupplierStore = create<SupplierState>((set) => ({
  suppliers: null,
  loading: false,
  success: false,
  errorSupplier: null,

  createSupplier: async (data) => {
    try {
      set({ loading: true, errorSupplier: null });
      const res = await supplierApi.create(data);
      const success = res.data?.success ?? res.data?.sucess ?? false;
      if (success) {
        set({ suppliers: res.data.data, loading: false, success });
      } else {
        set({ loading: false, success: false, errorSupplier: res.data?.message || 'Failed to create supplier' });
      }
      return res;
    } catch (err: any) {
      set({ suppliers: null, loading: false, success: false, errorSupplier: err?.response?.data?.message || err.message });
      return Promise.reject(err);
    }
  },

  fetchSuppliers: async (query?: string, page?: number, limit?: number) => {
    try {
      set({ loading: true, errorSupplier: null });
      const params: Record<string, any> = {};
      if (query) params.searchKey = query;
      if (page) params.page = page;
      if (limit) params.limit = limit;

      const res = await supplierApi.list(Object.keys(params).length ? params : undefined);
      const payload = res.data?.data;
      const list = payload?.suppliers ?? payload ?? [];
      set({ suppliers: list, loading: false });
    } catch (err: any) {
      set({ suppliers: null, loading: false, errorSupplier: err?.message || 'Failed to fetch suppliers' });
    }
  },

  updateSupplier: async (id, data) => {
    try {
      set({ loading: true, errorSupplier: null });
      const res = await supplierApi.update(id, data);
      const payload = res.data?.data;
      const list = payload?.suppliers ?? payload ?? [];
      const success = res.data?.success ?? res.data?.sucess ?? false;
      if (success) {
        set({ suppliers: list, loading: false, success });
      } else {
        set({ loading: false, success: false, errorSupplier: res.data?.message || 'Failed to update supplier' });
      }
      return res;
    } catch (err: any) {
      set({ suppliers: null, loading: false, success: false, errorSupplier: err?.response?.data?.message || err.message });
      return Promise.reject(err);
    }
  },

  deleteSupplier: async (id) => {
    try {
      set({ loading: true, errorSupplier: null });
      const res = await supplierApi.delete(id);
      const payload = res.data?.data;
      const list = payload?.suppliers ?? payload ?? [];
      const success = res.data?.success ?? res.data?.sucess ?? false;
      if (success) {
        set({ suppliers: list, loading: false, success });
      } else {
        set({ loading: false, success: false, errorSupplier: res.data?.message || 'Cannot delete supplier' });
      }
      return res;
    } catch (err: any) {
      set({ suppliers: null, loading: false, success: false, errorSupplier: err?.response?.data?.message || err.message });
      return Promise.reject(err);
    }
  }
}));

export default useSupplierStore;
