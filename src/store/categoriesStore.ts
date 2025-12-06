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
  fetchCategories: () => Promise<void>;
  createCategory: (data: CategoryPayload) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: null,
  loading: false,
  success: false,

  createCategory: async (data) => {
    try {
      set({ loading: true });
      const res = await categoryApi.create(data);
      set({
        categories: res.data.data,
        loading: false,
        success: res.data.sucess
      });
    } catch {
      set({ categories: null, success: false });
    }
  },

  fetchCategories: async () => {
    try {
      set({ loading: true });
      const res = await categoryApi.list();
      set({ categories: res.data.data, loading: false });

    } catch {
      set({ categories: null });
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ loading: true });
      const res = await categoryApi.delete(id);
      set({
        categories: res.data.data,
        loading: false,
        success: res.data.sucess
      });
    } catch {
      set({ categories: null, success: false });
    }
  }
}));
