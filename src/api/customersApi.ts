import axiosClient from './axiosClient';

export interface CustomerPayload {
  id?: string | null;
  name: string;
  email: string;
  address: string;
  phone: string;
}

const customerApi = {
  createCustomer: (payload: CustomerPayload) =>
    axiosClient.post('/customers', payload),

  fetchCustomer: (params?: Record<string, any>) => axiosClient.get('/customers', { params }),

  updateCustomer: (id: string, payload: CustomerPayload) =>
    axiosClient.put(`/customers/${id}`, payload),

  deleteCustomer: (id: string) => axiosClient.delete(`/customers/${id}`)
};

export default customerApi;
