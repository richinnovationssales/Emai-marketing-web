import  apiClient  from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Group, CreateGroupData, UpdateGroupData } from '@/types/entities/group.types';
import { ApiResponse, PaginatedResponse } from '@/types/api/response.types';

export const groupService = {
  getAll: async (params?: any): Promise<PaginatedResponse<Group>> => {
    const response = await apiClient.get(API_ENDPOINTS.GROUPS, { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Group>> => {
    const response = await apiClient.get(`${API_ENDPOINTS.GROUPS}/${id}`);
    return response.data;
  },

  create: async (data: CreateGroupData): Promise<ApiResponse<Group>> => {
    const response = await apiClient.post(API_ENDPOINTS.GROUPS, data);
    return response.data;
  },

  update: async (id: string, data: UpdateGroupData): Promise<ApiResponse<Group>> => {
    const response = await apiClient.put(`${API_ENDPOINTS.GROUPS}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`${API_ENDPOINTS.GROUPS}/${id}`);
    return response.data;
  },
};
