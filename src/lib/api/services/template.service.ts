import apiClient  from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Template, CreateTemplateData, UpdateTemplateData } from '@/types/entities/template.types';
import { ApiResponse, PaginatedResponse } from '@/types/api/response.types';

export const templateService = {
  getAll: async (params?: any): Promise<PaginatedResponse<Template>> => {
    const response = await apiClient.get(API_ENDPOINTS.TEMPLATES, { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Template>> => {
    const response = await apiClient.get(`${API_ENDPOINTS.TEMPLATES}/${id}`);
    return response.data;
  },

  create: async (data: CreateTemplateData): Promise<ApiResponse<Template>> => {
    const response = await apiClient.post(API_ENDPOINTS.TEMPLATES, data);
    return response.data;
  },

  update: async (id: string, data: UpdateTemplateData): Promise<ApiResponse<Template>> => {
    const response = await apiClient.put(`${API_ENDPOINTS.TEMPLATES}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`${API_ENDPOINTS.TEMPLATES}/${id}`);
    return response.data;
  },
};
