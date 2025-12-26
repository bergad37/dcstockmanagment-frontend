import { create } from 'zustand';
import categoryApi, { type CategoryPayload } from '../api/categoryApi';

interface Category {
  id?: string;
  name: string;
}

interface CategoryState {
  categories: Category[] | null;
  loading: boolean;
  success: boolean;
  errorCategory: string | null;
  fetchCategories: (query?: string, page?: number, limit?: number) => Promise<void>;
  createCategory: (data: CategoryPayload) => Promise<any>;
  deleteCategory: (id: string) => Promise<any>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: null,
  loading: false,
  success: false,
  errorCategory: null,

  createCategory: async (data) => {
    try {
      set({ loading: true, errorCategory: null });
      const res = await categoryApi.create(data);
      const success = res.data?.success ?? res.data?.sucess ?? false;
      if (success) {
        set({ categories: res.data.data, loading: false, success });
      } else {
        set({ loading: false, success: false, errorCategory: res.data?.message || 'Failed to create category' });
      }
      return res;
    } catch (err: any) {
      set({ categories: null, success: false, loading: false, errorCategory: err?.response?.data?.message || err.message });
      return Promise.reject(err);
    }
  },

  fetchCategories: async (query?: string, page?: number, limit?: number) => {
    try {
      set({ loading: true, errorCategory: null });
      const params: Record<string, any> = {};
      if (query) params.searchKey = query;
      if (page) params.page = page;
      if (limit) params.limit = limit;

      const res = await categoryApi.list(Object.keys(params).length ? params : undefined);
      // backend may return { data: { categories: [...] } } or data directly
      const payload = res.data?.data;
      const list = payload?.categories ?? payload ?? [];
      set({ categories: list, loading: false });
    } catch (err: any) {
      set({ categories: null, loading: false, errorCategory: err?.message || 'Failed to fetch categories' });
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ loading: true, errorCategory: null });
      const res = await categoryApi.delete(id);
      const success = res.data?.success ?? res.data?.sucess ?? false;
      if (success) {
        set({ categories: res.data.data, loading: false, success });
      } else {
        set({ loading: false, success: false, errorCategory: res.data?.message || 'Cannot delete category' });
      }
      return res;
    } catch (err: any) {
      set({ categories: null, success: false, loading: false, errorCategory: err?.response?.data?.message || err.message });
      return Promise.reject(err);
    }
  }
}));
