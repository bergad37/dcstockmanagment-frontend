import axiosClient from './axiosClient';

export interface LoginPayload {
  email: string;
  password: string;
}

const authApi = {
  login: (payload: LoginPayload) => axiosClient.post('/auth/login', payload),

  profile: () => axiosClient.get('/auth/profile'),
};

export default authApi;
