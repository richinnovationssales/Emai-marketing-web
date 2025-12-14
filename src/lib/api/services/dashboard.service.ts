import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '@/types/api/response.types';

export const dashboardService = {
  getSummary: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.SUMMARY);
    return response.data;
  },

  getStats: async (period: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.STATS, { params: { period } });
    return response.data;
  },
};
