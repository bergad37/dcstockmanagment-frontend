// src/store/productStore.ts
import { create } from 'zustand';
import productApi from '../api/productApi';

interface Product {
  id: string;
  name: string;
}

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  listProducts: () => Promise<void>;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

  listProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await productApi.fetchProducts();
      set({ products: res.data.data, loading: false });
    } catch (e: any) {
      console.log(e);
      set({
        loading: false,
        error: `Failed to load products`
      });
    }
  }
}));
