import axiosClient from './axiosClient';

export interface CustomerPayload {
  id?: string | null;
  names: string;
  email: string;
  address: string;
  phoneNumber: string;
}

const customerApi = {
  createCustomer: (payload: CustomerPayload) =>
    axiosClient.post('/customers', payload),

  fetchCustomer: () => axiosClient.get('/customers')
};

export default customerApi;
