import axiosClient from './axiosClient';

export interface ProductPayload {
  name: string;
}

const productApi = {
  create: (payload: ProductPayload) => axiosClient.post('/products', payload),

  fetchProducts: () => axiosClient.get('/products')
};

export default productApi;
