import axiosClient from './axiosClient';

export interface StatisticsParams {
  range?: string;
}

export async function getStatistics(params?: StatisticsParams) {
  const res = await axiosClient.get('/statistics', { params });
  return res.data;
}

export default {
  getStatistics,
};
