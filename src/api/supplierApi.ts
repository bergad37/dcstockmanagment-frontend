import axiosClient from './axiosClient';

export interface SupplierPayload {
  id?: string | null;
  name: string;
  phone?: string;
  email?: string;
}

const supplierApi = {
  create: (payload: SupplierPayload) => axiosClient.post('/suppliers', payload),
    list: (params?: Record<string, any>) => axiosClient.get('/suppliers', { params }),
  update: (id: string, payload: SupplierPayload) =>
    axiosClient.put(`/suppliers/${id}`, payload),
  delete: (id: string) => axiosClient.delete(`/suppliers/${id}`)
};

export default supplierApi;
