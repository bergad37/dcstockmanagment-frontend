import { create } from 'zustand';
import type { UserPayload } from '../api/userApi';
import userApi from '../api/userApi';

interface ActionResult {
  success: boolean;
  message?: string;
}
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UserState {
  users: UserPayload[] | null;
  loading: boolean;
  pagination: Pagination;
  listUsers: (page?: number, limit?: number, search?: string) => Promise<void>;
  createUser: (userData: UserPayload) => Promise<ActionResult>;
  deleteUser: (userId: string) => Promise<ActionResult>;
  updateUser: (userId: string, userData: UserPayload) => Promise<ActionResult>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: null,
  loading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },

  listUsers: async (page = 1, limit = 10, search = '') => {
    try {
      set({ loading: true });
      const res = await userApi.listUsers({ page, limit, search });
      const users = res.data?.data?.users ?? [];
      const pagination = res.data?.data?.pagination ?? { page, limit, total: users.length, totalPages: 1 };
      set({ users, loading: false, pagination });
    } catch (error: any) {
      set({ loading: false });
      // leave users unchanged on error
    }
  },

  createUser: async (userData: UserPayload) : Promise<ActionResult> => {
    try {
      set({ loading: true });
      const res = await userApi.createUser(userData);
      // refresh current page
      const { pagination } = get();
      const listRes = await userApi.listUsers({ page: pagination.page, limit: pagination.limit });
      set({ users: listRes.data.data.users, loading: false });
      return { success: true, message: res.data?.message || 'User created' };
    } catch (error: any) {
      set({ loading: false });
      return { success: false, message: error?.response?.data?.message || error?.message || 'Failed to create user' };
    }
  },

  deleteUser: async (userId: string) : Promise<ActionResult> => {
    try {
      set({ loading: true });
      const res = await userApi.deleteUser(userId);
      const { pagination } = get();
      const listRes = await userApi.listUsers({ page: pagination.page, limit: pagination.limit });
      set({ users: listRes.data.data.users, loading: false });
      return { success: true, message: res.data?.message || 'User deleted' };
    } catch (error: any) {
      set({ loading: false });
      return { success: false, message: error?.response?.data?.message || error?.message || 'Failed to delete user' };
    }
  } ,

  updateUser: async (userId: string, userData: UserPayload) : Promise<ActionResult> => {
    try {
      set({ loading: true });
      const res = await userApi.updateUser(userId, userData);
      const { pagination } = get();
      const listRes = await userApi.listUsers({ page: pagination.page, limit: pagination.limit });
      set({ users: listRes.data.data.users, loading: false });
      return { success: true, message: res.data?.message || 'User updated' };
    } catch (error: any) {
      set({ loading: false });
      return { success: false, message: error?.response?.data?.message || error?.message || 'Failed to update user' };
    }
  }

}));
