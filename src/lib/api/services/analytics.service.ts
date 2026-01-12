import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  AnalyticsOverviewResponse,
  AnalyticsOverviewParams,
  CampaignsAnalyticsResponse,
  CampaignAnalyticsDetailResponse,
  CampaignTimelineResponse,
  RecentEventsResponse,
  AnalyticsEventsParams,
} from '@/types/entities/analytics.types';

export const analyticsService = {
  /**
   * Get analytics overview with optional date filtering
   */
  getOverview: async (params?: AnalyticsOverviewParams): Promise<AnalyticsOverviewResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.OVERVIEW, { params });
    return response.data;
  },

  /**
   * Get analytics for all campaigns
   */
  getAllCampaignsAnalytics: async (): Promise<CampaignsAnalyticsResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.CAMPAIGNS);
    return response.data;
  },

  /**
   * Get detailed analytics for a specific campaign
   */
  getCampaignAnalytics: async (campaignId: string): Promise<CampaignAnalyticsDetailResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.CAMPAIGN_DETAIL(campaignId));
    return response.data;
  },

  /**
   * Get chronological event timeline for a campaign
   */
  getCampaignTimeline: async (campaignId: string): Promise<CampaignTimelineResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.CAMPAIGN_TIMELINE(campaignId));
    return response.data;
  },

  /**
   * Get recent email events
   */
  getRecentEvents: async (params?: AnalyticsEventsParams): Promise<RecentEventsResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.EVENTS, { params });
    return response.data;
  },
};

