import apiClient from '../client';
import { User, CreateUserDTO, UpdateUserDTO } from '@/types/entities/user.types';
import { ApiResponse } from '@/types/api/response.types';
import { API_ENDPOINTS } from '../endpoints';
import { UserRole } from '@/types/enums/user-role.enum';

export interface CreateClientAdminDTO {
  email: string;
  password: string;
}

export interface CreateClientUserDTO {
  email: string;
  password: string;
}

export interface GetUsersParams {
  role?: UserRole;
}

export const userService = {

  createClientAdmin: async (data: CreateClientAdminDTO): Promise<User> => {
    const { data: response } = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.USERS.CLIENT_ADMINS,
      data
    );
    return response.data;
  },

  createClientUser: async (data: CreateClientUserDTO): Promise<User> => {
    const { data: response } = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.USERS.CLIENT_USERS,
      data
    );
    return response.data;
  },

  getUsers: async (params?: GetUsersParams): Promise<User[]> => {
    const { data: response } = await apiClient.get<ApiResponse<User[]>>(
      API_ENDPOINTS.USERS.BASE,
      { params }
    );
    return response.data;
  },


  getUserById: async (id: string): Promise<User> => {
    const { data: response } = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USERS.BY_ID(id)
    );
    return response.data;
  },


  updateUser: async (id: string, data: UpdateUserDTO): Promise<User> => {
    const { data: response } = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USERS.BY_ID(id),
      data
    );
    return response.data;
  },


  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id));
  },

  getCurrentUserProfile: async (): Promise<User> => {
    const { data: response } = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USERS.ME
    );
    return response.data;
  },
};
