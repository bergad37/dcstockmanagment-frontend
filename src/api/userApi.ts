import axiosClient from './axiosClient';

export interface UserPayload {
  id: string | null;
  name: string;
  email: string;
  role: string;
}

const userApi = {
  createUser: (payload: UserPayload) => axiosClient.post('/users', payload),
  listUsers: (params?: Record<string, any>) => axiosClient.get('/users', { params }),
  deleteUser: (userId: string) => axiosClient.delete(`/users/${userId}`),
  updateUser: (userId: string, payload: UserPayload) => axiosClient.put(`/users/${userId}`, payload)
};

export default userApi;
