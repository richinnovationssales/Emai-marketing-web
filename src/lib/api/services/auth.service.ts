import apiClient from '../client';
import { Admin, AdminLoginDTO, AuthResponse, CreateAdminDTO } from '@/types/entities/admin.types';
import { UserLoginDTO, UserAuthResponse } from '@/types/entities/user.types';
import { CreateClientDTO } from '@/types/entities/client.types';
import { ApiResponse } from '@/types/api/response.types';

import { API_ENDPOINTS } from '../endpoints';

export const authService = {
    // Admin login
    loginAdmin: async (credentials: AdminLoginDTO): Promise<AuthResponse> => {
        const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
            API_ENDPOINTS.AUTH.LOGIN_ADMIN,
            credentials
        );
        return data.data;
    },

    // Client user login
    loginUser: async (credentials: UserLoginDTO): Promise<UserAuthResponse> => {
        const { data } = await apiClient.post<ApiResponse<UserAuthResponse>>(
            API_ENDPOINTS.AUTH.LOGIN_USER,
            credentials
        );
        return data.data;
    },

    // Client registration
    registerClient: async (clientData: CreateClientDTO): Promise<{ clientId: string; message: string }> => {
        const { data } = await apiClient.post<ApiResponse<{ clientId: string; message: string }>>(
            API_ENDPOINTS.AUTH.REGISTER,
            clientData
        );
        return data.data;
    },

    // Logout (client-side only)
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token');
        }
    },
};
