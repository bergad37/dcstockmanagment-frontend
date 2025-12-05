import { create } from 'zustand';
import categoryApi from '../api/categoryApi';

interface Category {
  id: string;
  name: string;
}

interface CategoryState {
  categories: Category[] | null;
  loading: boolean;
  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: null,
  loading: false,

  fetchCategories: async () => {
    try {
      set({ loading: true });
      const res = await categoryApi.list();
      set({ categories: res.data.data, loading: false });
    } catch {
      set({ categories: null });
    }
  }
}));
