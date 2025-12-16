import axiosClient from './axiosClient';

export interface ProductPayload {
  name: string;
  categoryId: string;
  supplierId?: string | null;
  type: 'ITEM' | 'QUANTITY' | 'item' | 'quantity';
  serialNumber?: string | null;
  warranty?: string | null;
  description?: string | null;
  costPrice?: number | null;
  quantity?: number | null;
  entryDate: string;
}

const productApi = {
  create: (payload: ProductPayload) => axiosClient.post('/products', payload),

  fetchProducts: (params?: Record<string, any>) =>
    axiosClient.get('/products', { params }),

  update: (id: string, payload: ProductPayload) =>
    axiosClient.put(`/products/${id}`, payload),

  delete: (id: string) => axiosClient.delete(`/products/${id}`)
};

export default productApi;
