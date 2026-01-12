import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Campaign, CreateCampaignDTO, UpdateCampaignDTO } from '@/types/entities/campaign.types';
import { ApiResponse } from '@/types/api/response.types';

export const campaignService = {
  /**
   * Get all campaigns for the authenticated client
   */
  getAll: async (): Promise<Campaign[]> => {
    const { data } = await apiClient.get<Campaign[]>(API_ENDPOINTS.CAMPAIGNS.BASE);
    return data;
  },

  /**
   * Get a single campaign by ID
   */
  getById: async (id: string): Promise<Campaign> => {
    const { data } = await apiClient.get<Campaign>(API_ENDPOINTS.CAMPAIGNS.BY_ID(id));
    return data;
  },

  /**
   * Create a new campaign
   */
  create: async (campaignData: CreateCampaignDTO): Promise<Campaign> => {
    const { data } = await apiClient.post<Campaign>(
      API_ENDPOINTS.CAMPAIGNS.BASE,
      campaignData
    );
    return data;
  },

  /**
   * Update an existing campaign
   */
  update: async (id: string, campaignData: UpdateCampaignDTO): Promise<Campaign> => {
    const { data } = await apiClient.put<Campaign>(
      API_ENDPOINTS.CAMPAIGNS.BY_ID(id),
      campaignData
    );
    return data;
  },

  /**
   * Delete a campaign
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CAMPAIGNS.BY_ID(id));
  },

  /**
   * Submit a DRAFT campaign for approval
   * Changes status from DRAFT to PENDING_APPROVAL
   */
  submit: async (id: string): Promise<Campaign> => {
    const { data } = await apiClient.patch<Campaign>(API_ENDPOINTS.CAMPAIGNS.SUBMIT(id));
    return data;
  },

  /**
   * Get all pending campaigns awaiting approval
   * Requires CLIENT_ADMIN role
   */
  getPending: async (): Promise<Campaign[]> => {
    const { data } = await apiClient.get<Campaign[]>(API_ENDPOINTS.CAMPAIGNS.PENDING);
    return data;
  },

  /**
   * Approve a pending campaign
   * Requires CLIENT_ADMIN role
   * Changes status from PENDING_APPROVAL to APPROVED
   */
  approve: async (id: string): Promise<Campaign> => {
    const { data } = await apiClient.patch<Campaign>(API_ENDPOINTS.CAMPAIGNS.APPROVE(id));
    return data;
  },

  /**
   * Reject a pending campaign
   * Requires CLIENT_ADMIN role
   * Changes status from PENDING_APPROVAL to REJECTED
   */
  reject: async (id: string): Promise<Campaign> => {
    const { data } = await apiClient.patch<Campaign>(API_ENDPOINTS.CAMPAIGNS.REJECT(id));
    return data;
  },

  /**
   * Send an approved campaign to all recipients
   * Requires CLIENT_ADMIN role
   * Campaign must have status APPROVED
   */
  send: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.CAMPAIGNS.SEND(id)
    );
    return data;
  },
};

