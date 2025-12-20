import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Plan, CreatePlanData, UpdatePlanData } from '@/types/entities/plan.types';
import { Client } from '@/types/entities/client.types';
import { ApiResponse } from '@/types/api/response.types';

export const planService = {
  getAll: async (): Promise<Plan[]> => {
    const response = await apiClient.get<ApiResponse<Plan[]>>(API_ENDPOINTS.PLANS.BASE);
    return response.data.data;
  },

  getById: async (id: string): Promise<Plan> => {
    const response = await apiClient.get<ApiResponse<Plan>>(API_ENDPOINTS.PLANS.BY_ID(id));
    return response.data.data;
  },

  getClientsByPlan: async (planId: string): Promise<Client[]> => {
    const response = await apiClient.get<ApiResponse<Client[]>>(API_ENDPOINTS.PLANS.CLIENTS(planId));
    return response.data.data;
  },

  create: async (data: CreatePlanData): Promise<Plan> => {
    const response = await apiClient.post<ApiResponse<Plan>>(API_ENDPOINTS.PLANS.BASE, data);
    return response.data.data;
  },

  update: async (id: string, data: UpdatePlanData): Promise<Plan> => {
    const response = await apiClient.put<ApiResponse<Plan>>(API_ENDPOINTS.PLANS.BY_ID(id), data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PLANS.BY_ID(id));
  },
};

