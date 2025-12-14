import apiClient from '../client';
import { Campaign, CreateCampaignDTO, UpdateCampaignDTO, CampaignAnalytics } from '@/types/entities/campaign.types';
import { ApiResponse } from '@/types/api/response.types';

export const campaignService = {
    // Get all campaigns for a client
    getAll: async (clientId: string): Promise<Campaign[]> => {
        const { data } = await apiClient.get<ApiResponse<Campaign[]>>('/campaigns', {
            params: { clientId },
        });
        return data.data;
    },

    // Get campaign by ID
    getById: async (id: string, clientId: string): Promise<Campaign> => {
        const { data } = await apiClient.get<ApiResponse<Campaign>>(`/campaigns/${id}`, {
            params: { clientId },
        });
        return data.data;
    },

    // Create campaign
    create: async (campaignData: CreateCampaignDTO, clientId: string): Promise<Campaign> => {
        const { data } = await apiClient.post<ApiResponse<Campaign>>('/campaigns', {
            ...campaignData,
            clientId,
        });
        return data.data;
    },

    // Update campaign
    update: async (id: string, campaignData: UpdateCampaignDTO, clientId: string): Promise<Campaign> => {
        const { data } = await apiClient.put<ApiResponse<Campaign>>(`/campaigns/${id}`, {
            ...campaignData,
            clientId,
        });
        return data.data;
    },

    // Delete campaign
    delete: async (id: string, clientId: string): Promise<void> => {
        await apiClient.delete(`/campaigns/${id}`, {
            params: { clientId },
        });
    },

    // Send campaign
    send: async (id: string, clientId: string): Promise<Campaign> => {
        const { data } = await apiClient.post<ApiResponse<Campaign>>(`/campaigns/${id}/send`, {
            clientId,
        });
        return data.data;
    },

    // Get campaign analytics
    getAnalytics: async (id: string, clientId: string): Promise<CampaignAnalytics> => {
        const { data } = await apiClient.get<ApiResponse<CampaignAnalytics>>(`/campaigns/${id}/analytics`, {
            params: { clientId },
        });
        return data.data;
    },
};
