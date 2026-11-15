import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  AdminDashboardResponse,
  ClientDashboardResponse,
  CampaignPerformanceParams,
  CampaignPerformanceItem,
} from '@/types/entities/dashboard.types';

export const dashboardService = {
  /**
   * Get admin dashboard summary (admin only)
   */
  getAdminDashboard: async (): Promise<AdminDashboardResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.ADMIN);
    return response.data;
  },

  /**
   * Get client dashboard data
   */
  getClientDashboard: async (): Promise<ClientDashboardResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.CLIENT);
    return response.data;
  },

  /**
   * Get employee dashboard data (same as client)
   */
  getEmployeeDashboard: async (): Promise<ClientDashboardResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.EMPLOYEE);
    return response.data;
  },

  /**
   * Get campaign performance report
   */
  getCampaignPerformance: async (
    params?: CampaignPerformanceParams
  ): Promise<CampaignPerformanceItem[]> => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.CAMPAIGN_PERFORMANCE, { params });
    return response.data;
  },

  /**
   * Download campaign performance as Excel
   */
  downloadCampaignPerformance: async (params?: CampaignPerformanceParams): Promise<Blob> => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.CAMPAIGN_PERFORMANCE, {
      params: { ...params, format: 'excel' },
      responseType: 'blob',
    });
    return response.data;
  },
};

