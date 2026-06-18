import { create } from 'zustand';
import auditApi, { type AuditListParams } from '../api/auditApi';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId?: string;
  description: string;
  createdAt: string;
  ipAddress?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AuditState {
  logs: AuditLog[];
  loading: boolean;
  pagination: Pagination;
  listAuditLogs: (params?: AuditListParams) => Promise<void>;
}

export const useAuditStore = create<AuditState>((set) => ({
  logs: [],
  loading: false,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },

  listAuditLogs: async (params = {}) => {
    try {
      set({ loading: true });
      const res = await auditApi.listAuditLogs({ page: 1, limit: 10, ...params });
      const data = res.data?.data;
      set({
        logs: data?.logs ?? data?.auditLogs ?? [],
        pagination: data?.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
}));
