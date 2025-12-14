import apiClient  from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Plan, CreatePlanData, UpdatePlanData } from '@/types/entities/plan.types';
import { ApiResponse, PaginatedResponse } from '@/types/api/response.types';

export const planService = {
  getAll: async (params?: any): Promise<PaginatedResponse<Plan>> => {
    const response = await apiClient.get(API_ENDPOINTS.PLANS, { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Plan>> => {
    const response = await apiClient.get(`${API_ENDPOINTS.PLANS}/${id}`);
    return response.data;
  },

  create: async (data: CreatePlanData): Promise<ApiResponse<Plan>> => {
    const response = await apiClient.post(API_ENDPOINTS.PLANS, data);
    return response.data;
  },

  update: async (id: string, data: UpdatePlanData): Promise<ApiResponse<Plan>> => {
    const response = await apiClient.put(`${API_ENDPOINTS.PLANS}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`${API_ENDPOINTS.PLANS}/${id}`);
    return response.data;
  },
};
