import axiosClient from './axiosClient';

export interface CategoryPayload {
  name: string;
}

const categoryApi = {
  create: (payload: CategoryPayload) =>
    axiosClient.post('/categories', payload),
  list: () => axiosClient.get('/categories'),
  delete: (id: string) => axiosClient.delete(`/categories/${id}`)
};

export default categoryApi;
