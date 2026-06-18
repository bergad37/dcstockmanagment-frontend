import axiosClient from './axiosClient';

export interface LoginPayload {
  email: string;
  password: string;
}

const authApi = {
  login: (payload: LoginPayload) => axiosClient.post('/auth/login', payload),

  profile: () => axiosClient.get('/auth/profile'),

  forgotPassword: (email: string) =>
    axiosClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    axiosClient.post('/auth/reset-password', { token, newPassword }),

  changePassword: (currentPassword: string, newPassword: string) =>
    axiosClient.post('/auth/change-password', { currentPassword, newPassword }),
};

export default authApi;
