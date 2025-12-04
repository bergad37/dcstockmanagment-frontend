import axiosClient from './axiosClient';

export interface LoginPayload {
  email: string;
  password: string;
}

const userApi = {
  login: (payload: LoginPayload) => axiosClient.post('/auth/login', payload),

  profile: () => axiosClient.get('/auth/profile')
};

export default userApi;
