import axios from 'axios';
import { isTokenExpired } from '../utils/auth';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_DCSURVEY_APP
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const url = String(config?.url ?? '').toLowerCase();
  const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh');

  if (!isAuthEndpoint && token && isTokenExpired(token)) {
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('sessionExpired'));
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(new Error('Token expired'));
  }

  if (token) {
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      try {
        localStorage.removeItem('token');
      } catch (e) {
      }
      if (typeof window !== 'undefined') {
        try {
          window.dispatchEvent(new CustomEvent('sessionExpired'));
        } catch (e) {
          window.location.href = '/';
        }
      }
    }

    return Promise.reject(err);
  }
);

export default axiosClient;
