import axiosClient from './axiosClient';

export interface CategoryPayload {
  name: string;
}

const categoryApi = {
  create: (payload: CategoryPayload) =>
    axiosClient.post('/categories', payload),
  list: () => axiosClient.get('/categories')
};

export default categoryApi;
