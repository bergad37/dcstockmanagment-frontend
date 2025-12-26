import { create } from 'zustand';
import authApi, { type LoginPayload } from '../api/authApi';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (data: LoginPayload) => Promise<boolean>;
  fetchProfile: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
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
    } catch {
      set({ user: null });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  }
}));
