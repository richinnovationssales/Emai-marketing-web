import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Admin, CreateAdminDTO, UpdateAdminDTO } from '@/types/entities/admin.types';
import { ApiResponse, PaginatedResponse } from '@/types/api/response.types';

export const adminService = {
  getAdmins: async (params?: any): Promise<PaginatedResponse<Admin>> => {
    const { data } = await apiClient.get(API_ENDPOINTS.ADMINS.BASE, { params });
    return data;
  },

  getAdmin: async (id: string): Promise<ApiResponse<Admin>> => {
    const { data } = await apiClient.get(API_ENDPOINTS.ADMINS.BY_ID(id));
    return data;
  },

  createAdmin: async (adminData: CreateAdminDTO): Promise<ApiResponse<Admin>> => {
    const { data } = await apiClient.post(API_ENDPOINTS.ADMINS.BASE, adminData);
    return data;
  },

  updateAdmin: async (id: string, adminData: UpdateAdminDTO): Promise<ApiResponse<Admin>> => {
    const { data } = await apiClient.patch(API_ENDPOINTS.ADMINS.TOGGLE_STATUS(id), adminData);
    return data;
  },

  deleteAdmin: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete(API_ENDPOINTS.ADMINS.BY_ID(id));
    return data;
  },

  // Specific method for super admin to block/unblock or other specific actions if needed
  toggleAdminStatus: async (id: string, isActive: boolean): Promise<ApiResponse<Admin>> => {
    // Assuming patch can handle this, or if there's a specific endpoint
    return adminService.updateAdmin(id, { isActive });
  }
};
