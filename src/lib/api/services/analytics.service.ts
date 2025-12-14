import  apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '@/types/api/response.types';

export const analyticsService = {
  getCampaignPerformance: async (campaignId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.CAMPAIGNS}/${campaignId}`);
    return response.data;
  },

  getContactGrowth: async (period: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.CONTACTS, { params: { period } });
    return response.data;
  },

  getOverview: async (period: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.OVERVIEW, { params: { period } });
    return response.data;
  },
};
