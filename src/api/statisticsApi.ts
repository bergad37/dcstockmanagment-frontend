import axiosClient from './axiosClient';

export interface StatisticsParams {
  range?: string;
}

export async function getStatistics(params?: StatisticsParams) {
  const res = await axiosClient.get('/statistics', { params });
  return res.data;
}

export async function downloadExcelReport(range?: string) {
  const res = await axiosClient.get('/statistics/report', {
    params: range ? { range } : {},
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

export default { getStatistics, downloadExcelReport };
