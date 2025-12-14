import apiClient  from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { User, CreateUserData, UpdateUserData } from '@/types/entities/user.types';
import { ApiResponse, PaginatedResponse } from '@/types/api/response.types';

export const employeeService = {
  getAll: async (params?: any): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES, { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
    return response.data;
  },

  create: async (data: CreateUserData): Promise<ApiResponse<User>> => {
    const response = await apiClient.post(API_ENDPOINTS.EMPLOYEES, data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserData): Promise<ApiResponse<User>> => {
    const response = await apiClient.put(`${API_ENDPOINTS.EMPLOYEES}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
    return response.data;
  },

  invite: async (email: string, role: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post(`${API_ENDPOINTS.EMPLOYEES}/invite`, { email, role });
    return response.data;
  }
};
