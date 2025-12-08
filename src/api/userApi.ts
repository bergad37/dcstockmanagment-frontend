import axiosClient from './axiosClient';

export interface UserPayload {
  id: string | null;
  name: string;
  email: string;
  role: string;
}

const userApi = {
  createUser: (payload: UserPayload) => axiosClient.post('/users', payload),

  listUsers: () => axiosClient.get('/users')
};

export default userApi;
