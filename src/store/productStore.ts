// src/store/productStore.ts
import { create } from 'zustand';
import productApi, { type ProductPayload } from '../api/productApi';

interface Product {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  listProducts: (params?: Record<string, any>) => Promise<void>;
  createProduct: (data: ProductPayload) => Promise<void>;
  updateProduct: (id: string, data: ProductPayload) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,
  pagination: null,

  listProducts: async (params?: Record<string, any>) => {
    set({ loading: true, error: null });
    try {
      const res = await productApi.fetchProducts(params);
      // backend returns { data: { products: [...], pagination: {...} } }
      const payload = res.data?.data;
      const list = payload?.products ?? payload ?? [];
      const p = payload?.pagination;

      const pagination: Pagination | null = p
        ? {
            page: p.page ?? params?.page ?? 1,
            limit: p.limit ?? params?.limit ?? list.length,
            total: p.total ?? list.length
          }
        : list
          ? {
              page: params?.page ?? 1,
              limit: params?.limit ?? list.length,
              total: list.length
            }
          : null;

      set({ products: list, pagination, loading: false });
    } catch (e: any) {
      // eslint-disable-next-line no-console
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
        set((state) => ({
          products: [...state.products, res.data.data],
          loading: false
        }));
      } else {
        set((state) => ({
          products: list,
          loading: false,
          pagination: state.pagination
        }));
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
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? updated : p)),
          loading: false
        }));
      } else {
        // fallback: reload list
        const listRes = await productApi.fetchProducts();
        const payload = listRes.data?.data;
        const list = payload?.products ?? payload ?? [];
        const p = payload?.pagination;
        const pagination: Pagination | null = p
          ? {
              page: p.page ?? 1,
              limit: p.limit ?? list.length,
              total: p.total ?? list.length
            }
          : {
              page: 1,
              limit: list.length,
              total: list.length
            };
        set({ products: list, pagination, loading: false });
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
        // if backend returns fresh list (and optionally pagination)
        const p = payload?.pagination;
        const pagination: Pagination | null = p
          ? {
              page: p.page ?? 1,
              limit: p.limit ?? list.length,
              total: p.total ?? list.length
            }
          : {
              page: 1,
              limit: list.length,
              total: list.length
            };
        set({ products: list, pagination, loading: false });
      } else {
        // otherwise, just remove locally
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          loading: false
        }));
      }
    } catch (e) {
      set({ loading: false, error: 'Failed to delete product' });
    }
  }
}));
