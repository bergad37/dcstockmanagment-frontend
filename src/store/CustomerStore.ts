// src/store/productStore.ts
import { create } from 'zustand';
import customerApi, { type CustomerPayload } from '../api/customersApi';

interface ActionResult {
  success: boolean;
  message?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Customer {
  id?: string | null;
  name: string;
  email: string;
  address: string;
  phone: string;
}

type CustomerState = {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  fetchCustomer: (page?: number, limit?: number, search?: string) => Promise<void>;
  createCustomer: (payload: CustomerPayload) => Promise<ActionResult>;
  updateCustomer: (id: string, payload: CustomerPayload) => Promise<ActionResult>;
  deleteCustomer: (id: string) => Promise<ActionResult>;
};

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },

  fetchCustomer: async (page = 1, limit = 10, search = '') => {
    set({ loading: true, error: null });
    try {
      const res = await customerApi.fetchCustomer({ page, limit, searchKey: search });
      const customers = res.data?.data?.customers ?? res.data?.data ?? [];
      const pagination = res.data?.data?.pagination ?? { page, limit, total: customers.length, totalPages: 1 };
      set({ customers, loading: false, pagination });
    } catch (e: any) {
      console.log(e);
      set({
        loading: false,
        error: `Failed to load customers`
      });
    }
  },

  createCustomer: async (payload: CustomerPayload) => {
    try {
      set({ loading: true });
      const res = await customerApi.createCustomer(payload);
      const { pagination } = get();
      const listRes = await customerApi.fetchCustomer({ page: pagination.page, limit: pagination.limit });
      const customers = listRes.data?.data?.customers ?? listRes.data?.data ?? [];
      set({ customers, loading: false });
      return { success: true, message: res.data?.message || 'Customer created' };
    } catch (error: any) {
      set({ loading: false });
      return { success: false, message: error?.response?.data?.message || error?.message || 'Failed to create customer' };
    }
  },

  updateCustomer: async (id: string, payload: CustomerPayload) => {
    try {
      set({ loading: true });
      const res = await customerApi.updateCustomer(id, payload);
      const { pagination } = get();
      const listRes = await customerApi.fetchCustomer({ page: pagination.page, limit: pagination.limit });
      const customers = listRes.data?.data?.customers ?? listRes.data?.data ?? [];
      set({ customers, loading: false });
      return { success: true, message: res.data?.message || 'Customer updated' };
    } catch (error: any) {
      set({ loading: false });
      return { success: false, message: error?.response?.data?.message || error?.message || 'Failed to update customer' };
    }
  },

  deleteCustomer: async (id: string) => {
    try {
      set({ loading: true });
      const res = await customerApi.deleteCustomer(id);
      const { pagination } = get();
      const listRes = await customerApi.fetchCustomer({ page: pagination.page, limit: pagination.limit });
      const customers = listRes.data?.data?.customers ?? listRes.data?.data ?? [];
      set({ customers, loading: false });
      return { success: true, message: res.data?.message || 'Customer deleted' };
    } catch (error: any) {
      set({ loading: false });
      return { success: false, message: error?.response?.data?.message || error?.message || 'Failed to delete customer' };
    }
  }
}));
