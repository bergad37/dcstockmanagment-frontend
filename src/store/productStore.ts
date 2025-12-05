// src/store/productStore.ts
import { create } from 'zustand';
import productApi from '../api/productApi';

interface Product {
  id: string;
  name: string;
}

type ProductState = {
  items: Product[];
  loading: boolean;
  error: string | null;
  loadProducts: () => Promise<void>;
};

export const useProductStore = create<ProductState>((set) => ({
  items: [],
  loading: false,
  error: null,

  loadProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await productApi.fetchProducts();
      set({ items: res.data.data, loading: false });
    } catch (e) {
      console.log('@@@@@@@@', e);
      set({ loading: false, error: 'Failed to load products' });
    }
  }
}));
