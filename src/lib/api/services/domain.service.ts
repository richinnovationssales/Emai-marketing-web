import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { 
  DomainConfig, 
  UpdateDomainRequest, 
  UpdateDomainResponse,
  DomainHistoryResponse 
} from '@/types/entities/domain.types';

export const domainService = {
  /**
   * Get current domain configuration
   * Requires CLIENT_SUPER_ADMIN role
   */
  get: async (): Promise<DomainConfig> => {
    const { data } = await apiClient.get<DomainConfig>(API_ENDPOINTS.DOMAIN.BASE);
    return data;
  },

  /**
   * Update domain configuration
   * Requires CLIENT_SUPER_ADMIN role
   */
  update: async (domainData: UpdateDomainRequest): Promise<UpdateDomainResponse> => {
    const { data } = await apiClient.put<UpdateDomainResponse>(
      API_ENDPOINTS.DOMAIN.BASE,
      domainData
    );
    return data;
  },

  /**
   * Remove custom domain configuration (reverts to defaults)
   * Requires CLIENT_SUPER_ADMIN role
   */
  remove: async (): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(API_ENDPOINTS.DOMAIN.BASE);
    return data;
  },

  /**
   * Get domain change history
   * Requires CLIENT_SUPER_ADMIN role
   */
  getHistory: async (): Promise<DomainHistoryResponse> => {
    const { data } = await apiClient.get<DomainHistoryResponse>(API_ENDPOINTS.DOMAIN.HISTORY);
    return data;
  },
};
