import { create } from 'zustand';
import type { UserPayload } from '../api/userApi';
import userApi from '../api/userApi';

interface UserState {
  users: UserPayload[] | null;
  loading: boolean;
  listUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: null,
  loading: false,

  listUsers: async () => {
    try {
      set({ loading: true });
      const res = await userApi.listUsers();
      set({ users: res.data.data.users, loading: false });
    } catch {
      set({ loading: false });
    }
  }
}));
