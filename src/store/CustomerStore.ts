// src/store/productStore.ts
import { create } from 'zustand';
import customerApi from '../api/customersApi';

interface Customer {
  id?: string | null;
  names: string;
  email: string;
  address: string;
  phoneNumber: string;
}

type CustomerState = {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomer: () => Promise<void>;
};

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  loading: false,
  error: null,

  fetchCustomer: async () => {
    set({ loading: true, error: null });
    try {
      const res = await customerApi.fetchCustomer();
      set({ customers: res.data.data, loading: false });
    } catch (e: any) {
      console.log(e);
      set({
        loading: false,
        error: `Failed to load products`
      });
    }
  }
}));
