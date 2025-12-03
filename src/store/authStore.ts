import { create } from 'zustand';
import userApi, { type LoginPayload } from '../api/userApi';

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
      const res = await userApi.login(data);
      localStorage.setItem('token', res.data.token);
      set({ user: res.data.user, loading: false });
      return true;
    } catch {
      set({ loading: false });
      return false;
    }
  },

  fetchProfile: async () => {
    try {
      const res = await userApi.profile();
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
