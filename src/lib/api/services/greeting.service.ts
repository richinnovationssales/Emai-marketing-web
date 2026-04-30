import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '@/types/api/response.types';
import {
  CreateGreetingDTO,
  Greeting,
  UpdateGreetingDTO,
} from '@/types/entities/greeting.types';

export const greetingService = {
  // Client-facing: only active greetings
  getActive: async (): Promise<Greeting[]> => {
    const response = await apiClient.get<ApiResponse<Greeting[]>>(
      API_ENDPOINTS.GREETINGS.BASE
    );
    return response.data.data;
  },

  // Super-admin CRUD
  getAll: async (includeInactive: boolean = true): Promise<Greeting[]> => {
    const response = await apiClient.get<ApiResponse<Greeting[]>>(
      `${API_ENDPOINTS.ADMIN_GREETINGS.BASE}?includeInactive=${includeInactive}`
    );
    return response.data.data;
  },

  getById: async (id: string): Promise<Greeting> => {
    const response = await apiClient.get<Greeting>(
      API_ENDPOINTS.ADMIN_GREETINGS.BY_ID(id)
    );
    return response.data;
  },

  create: async (data: CreateGreetingDTO): Promise<Greeting> => {
    const response = await apiClient.post<Greeting>(
      API_ENDPOINTS.ADMIN_GREETINGS.BASE,
      data
    );
    return response.data;
  },

  update: async (id: string, data: UpdateGreetingDTO): Promise<Greeting> => {
    const response = await apiClient.put<Greeting>(
      API_ENDPOINTS.ADMIN_GREETINGS.BY_ID(id),
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ADMIN_GREETINGS.BY_ID(id));
  },
};
