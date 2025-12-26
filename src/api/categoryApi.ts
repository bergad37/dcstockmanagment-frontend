import axiosClient from './axiosClient';

export interface CategoryPayload {
  name: string;
}

const categoryApi = {
  create: (payload: CategoryPayload) => axiosClient.post('/categories', payload),
  // accept optional params for server-side filtering/pagination
  list: (params?: Record<string, any>) => axiosClient.get('/categories', { params }),
  delete: (id: string) => axiosClient.delete(`/categories/${id}`),
  update: (id: string, payload: CategoryPayload) => axiosClient.put(`/categories/${id}`, payload)
};

export default categoryApi;
