// src/store/productStore.ts
import { create } from 'zustand';
import productApi, { type ProductPayload } from '../api/productApi';

interface Product {
  id: string;
  name: string;
  [key: string]: any;
}

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  listProducts: (params?: Record<string, any>) => Promise<void>;
  createProduct: (data: ProductPayload) => Promise<void>;
  updateProduct: (id: string, data: ProductPayload) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

  listProducts: async (params?: Record<string, any>) => {
    set({ loading: true, error: null });
    try {
      const res = await productApi.fetchProducts(params);
      // backend returns { data: { products: [...], pagination: {...} } }
      const payload = res.data?.data;
      const list = payload?.products ?? payload ?? [];
      set({ products: list, loading: false });
    } catch (e: any) {
      console.log(e);
      set({
        loading: false,
        error: `Failed to load products`
      });
    }
  },

  createProduct: async (data) => {
    try {
      set({ loading: true });
      const res = await productApi.create(data);
      // If backend returns created product or updated list
      const payload = res.data?.data;
      const list = payload?.products ?? payload ?? [];
      // If backend returns single created product, append
      if (res.data?.data && !Array.isArray(res.data.data)) {
        set((state) => ({ products: [...state.products, res.data.data], loading: false }));
      } else {
        set({ products: list, loading: false });
      }
    } catch (e) {
      set({ loading: false, error: 'Failed to create product' });
    }
  },

  updateProduct: async (id, data) => {
    try {
      set({ loading: true });
      const res = await productApi.update(id, data);
      const updated = res.data?.data ?? null;
      if (updated) {
        set((state) => ({ products: state.products.map((p) => (p.id === id ? updated : p)), loading: false }));
      } else {
        // fallback: reload list
        const listRes = await productApi.fetchProducts();
        set({ products: listRes.data.data ?? [], loading: false });
      }
    } catch (e) {
      set({ loading: false, error: 'Failed to update product' });
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ loading: true });
      const res = await productApi.delete(id);
      const payload = res.data?.data;
      const list = payload?.products ?? payload ?? [];
      if (Array.isArray(list) && list.length) {
        set({ products: list, loading: false });
      } else {
        set((state) => ({ products: state.products.filter((p) => p.id !== id), loading: false }));
      }
    } catch (e) {
      set({ loading: false, error: 'Failed to delete product' });
    }
  }
}));
