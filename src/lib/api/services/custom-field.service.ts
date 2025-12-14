import apiClient  from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { CustomField, CreateCustomFieldData, UpdateCustomFieldData } from '@/types/entities/custom-field.types';
import { ApiResponse, PaginatedResponse } from '@/types/api/response.types';

export const customFieldService = {
  getAll: async (params?: any): Promise<PaginatedResponse<CustomField>> => {
    const response = await apiClient.get(API_ENDPOINTS.CUSTOM_FIELDS, { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<CustomField>> => {
    const response = await apiClient.get(`${API_ENDPOINTS.CUSTOM_FIELDS}/${id}`);
    return response.data;
  },

  create: async (data: CreateCustomFieldData): Promise<ApiResponse<CustomField>> => {
    const response = await apiClient.post(API_ENDPOINTS.CUSTOM_FIELDS, data);
    return response.data;
  },

  update: async (id: string, data: UpdateCustomFieldData): Promise<ApiResponse<CustomField>> => {
    const response = await apiClient.put(`${API_ENDPOINTS.CUSTOM_FIELDS}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`${API_ENDPOINTS.CUSTOM_FIELDS}/${id}`);
    return response.data;
  },
};
