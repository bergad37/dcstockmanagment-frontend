import { create } from 'zustand';
import authApi, { type LoginPayload } from '../api/authApi';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER' | string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (data: LoginPayload) => Promise<boolean>;
  fetchProfile: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })(),
  loading: false,

  login: async (data) => {
    try {
      set({ loading: true });
      const res = await authApi.login(data);
      const token = res?.data?.data?.token ?? res?.data?.token ?? null;
      const user = res?.data?.data?.user ?? res?.data?.user ?? null;

      if (token) {
        localStorage.setItem('token', token);
      }

      set({ user: user ?? null, loading: false });
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return true;
    } catch {
      set({ loading: false });
      return false;
    }
  },

  fetchProfile: async () => {
    try {
      const res = await authApi.profile();
      set({ user: res.data });
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch {
      // If profile fetch fails (e.g., token expired), logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null });
  }
}));
