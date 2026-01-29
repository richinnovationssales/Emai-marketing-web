import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  AdminDomainConfig,
  UpdateDomainRequest,
  AdminUpdateDomainResponse,
  AdminDomainHistoryResponse,
} from '@/types/entities/domain.types';

export const adminDomainService = {
  /**
   * Get domain configuration for a specific client
   * Requires SUPER_ADMIN role
   */
  get: async (clientId: string): Promise<AdminDomainConfig> => {
    const { data } = await apiClient.get<AdminDomainConfig>(
      API_ENDPOINTS.ADMIN_DOMAIN.BASE(clientId)
    );
    return data;
  },

  /**
   * Update domain configuration for a specific client
   * Requires SUPER_ADMIN role
   */
  update: async (clientId: string, domainData: UpdateDomainRequest): Promise<AdminUpdateDomainResponse> => {
    const { data } = await apiClient.put<AdminUpdateDomainResponse>(
      API_ENDPOINTS.ADMIN_DOMAIN.BASE(clientId),
      domainData
    );
    return data;
  },

  /**
   * Remove domain configuration for a specific client
   * Requires SUPER_ADMIN role
   */
  remove: async (clientId: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      API_ENDPOINTS.ADMIN_DOMAIN.BASE(clientId)
    );
    return data;
  },

  /**
   * Get domain change history for a specific client
   * Requires SUPER_ADMIN role
   */
  getHistory: async (clientId: string): Promise<AdminDomainHistoryResponse> => {
    const { data } = await apiClient.get<AdminDomainHistoryResponse>(
      API_ENDPOINTS.ADMIN_DOMAIN.HISTORY(clientId)
    );
    return data;
  },
};
