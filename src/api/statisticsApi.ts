import axiosClient from './axiosClient';

export interface StatsParams {
  startDate?: string; // ISO date string YYYY-MM-DD
  endDate?: string;
}

export interface CategorySummaryRow {
  name: string;
  productCount: number;
  totalUnitsInStock: number;
  totalSold: number;
  totalRented: number;
}

export interface MainStockStats {
  productCount: number;
  totalUnits: number;
  supplierCount: number;
  stockInCount: number;
  recentStockIns: any[];
}

export async function getStatistics(params?: StatsParams) {
  const res = await axiosClient.get('/statistics', { params });
  return res.data;
}

export async function getCategorySummary(params?: StatsParams & { scope?: 'MINI_STOCK' | 'MAIN_STOCK' }) {
  const res = await axiosClient.get('/statistics/category-summary', { params });
  return res.data?.data as CategorySummaryRow[];
}

export async function getMainStockStats(params?: StatsParams) {
  const res = await axiosClient.get('/statistics/main-stock', { params });
  return res.data?.data as MainStockStats;
}

export async function downloadExcelReport(params?: StatsParams) {
  const res = await axiosClient.get('/statistics/report', {
    params: params ?? {},
    responseType: 'blob',
  });

  const url = URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `stock-report-${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default { getStatistics, getCategorySummary, getMainStockStats, downloadExcelReport };
