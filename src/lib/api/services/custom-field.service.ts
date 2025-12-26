import apiClient from '../client';
import { CustomField, CreateCustomFieldData, UpdateCustomFieldData } from '@/types/entities/custom-field.types';
import { ApiResponse } from '@/types/api/response.types';

const BASE_URL = '/custom-fields';

export const customFieldService = {
  getAll: async (params?: { includeInactive?: boolean }): Promise<ApiResponse<CustomField[]>> => {
    // API doc says GET /api/custom-fields
    const response = await apiClient.get<ApiResponse<CustomField[]>>(BASE_URL, { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<CustomField>> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateCustomFieldData): Promise<ApiResponse<CustomField>> => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateCustomFieldData): Promise<ApiResponse<CustomField>> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
