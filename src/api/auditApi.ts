import axiosClient from './axiosClient';

export interface AuditListParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

const auditApi = {
  listAuditLogs: (params: AuditListParams) =>
    axiosClient.get('/audit-logs', { params }),
};

export default auditApi;
