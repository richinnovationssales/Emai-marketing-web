import apiClient from '../client';
import {  AdminLoginDTO, AuthResponse } from '@/types/entities/admin.types';
import { UserLoginDTO, UserAuthResponse } from '@/types/entities/user.types';
import { CreateClientDTO } from '@/types/entities/client.types';
import { ApiResponse } from '@/types/api/response.types';
import { API_ENDPOINTS } from '../endpoints';
import { VerifyResponse, RefreshResponse } from '@/types/auth/auth.types';
import Cookies from 'js-cookie';

const TOKEN_COOKIE = 'auth-token';
const ROLE_COOKIE = 'user-role';
const REFRESH_TOKEN_COOKIE = 'refresh-token';
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
};

export const authService = {
    // Admin login
    async loginAdmin(credentials: AdminLoginDTO): Promise<AuthResponse> {
        const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
            '/auth/login/admin', 
            credentials
        );
        
        const { token, user, refreshToken } = data.data;
        
        // Set cookies
        Cookies.set(TOKEN_COOKIE, token, COOKIE_OPTIONS);
        Cookies.set(ROLE_COOKIE, user.role, COOKIE_OPTIONS);
        if (refreshToken) {
            Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_OPTIONS);
        }
        
        // Also store in localStorage for Redux hydration
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', token);
            localStorage.setItem('auth-user', JSON.stringify(user));
            if (refreshToken) {
                localStorage.setItem('refresh-token', refreshToken);
            }
        }
        
        console.log('✅ Login successful - Cookies set:', {
            token: Cookies.get(TOKEN_COOKIE),
            role: Cookies.get(ROLE_COOKIE),
            refreshToken: !!Cookies.get(REFRESH_TOKEN_COOKIE)
        });
        
        return data.data;
    },

    // Client user login
    async loginUser(credentials: UserLoginDTO): Promise<UserAuthResponse> {

        const { data } = await apiClient.post<ApiResponse<UserAuthResponse>>(
            '/auth/login', 
            credentials
        );
        
        const { token, user, refreshToken } = data.data;
        
        // Set cookies
        Cookies.set(TOKEN_COOKIE, token, COOKIE_OPTIONS);
        Cookies.set(ROLE_COOKIE, user.role, COOKIE_OPTIONS);
        if (refreshToken) {
            Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_OPTIONS);
        }
        
        // Also store in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', token);
            localStorage.setItem('auth-user', JSON.stringify(user));
            if (refreshToken) {
                localStorage.setItem('refresh-token', refreshToken);
            }
        }
        
        console.log('✅ Login successful - Cookies set:', {
            token: Cookies.get(TOKEN_COOKIE),
            role: Cookies.get(ROLE_COOKIE),
            refreshToken: !!Cookies.get(REFRESH_TOKEN_COOKIE)
        });
        
        return data.data;
    },

    // Client registration
    async registerClient(clientData: CreateClientDTO): Promise<{ clientId: string; message: string }> {
        const { data } = await apiClient.post<ApiResponse<{ clientId: string; message: string }>>(
            API_ENDPOINTS.AUTH.REGISTER,
            clientData
        );
        return data.data;
    },

    // Logout - CRITICAL: Must clear everything
    async logout(): Promise<void> {
        console.log('🚪 Logging out - Clearing cookies and storage');
        
        // Call logout API to revoke refresh token
        try {
            const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
            if (refreshToken) {
                await apiClient.post('/auth/logout', { refreshToken });
            }
        } catch (error) {
            console.error('❌ Logout API call failed:', error);
            // Continue with local cleanup even if API call fails
        }
        
        // Remove cookies with explicit options
        Cookies.remove(TOKEN_COOKIE, { path: '/', domain: undefined });
        Cookies.remove(ROLE_COOKIE, { path: '/', domain: undefined });
        Cookies.remove(REFRESH_TOKEN_COOKIE, { path: '/', domain: undefined });
        
        // Double-check removal (fallback)
        if (typeof document !== 'undefined') {
            document.cookie = `${TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${ROLE_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${REFRESH_TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
        
        // Remove from localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('auth-user');
            localStorage.removeItem('refresh-token');
        }
        
        console.log('✅ Logout complete - Cookies after clear:', {
            token: Cookies.get(TOKEN_COOKIE),
            role: Cookies.get(ROLE_COOKIE),
            refreshToken: Cookies.get(REFRESH_TOKEN_COOKIE)
        });
    },

    // Verify current access token with backend
    async verifyToken(): Promise<VerifyResponse> {
        const token = this.getToken();
        if (!token) {
            throw new Error('No token found');
        }
        
        const { data } = await apiClient.get<VerifyResponse>('/auth/verify');
        return data;
    },

    // Refresh access token using refresh token
    async refreshAccessToken(): Promise<string> {
        const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE) || localStorage.getItem('refresh-token');
        
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }
        
        const { data } = await apiClient.post<RefreshResponse>('/auth/refresh', { refreshToken });
        const newAccessToken = data.data.accessToken;
        
        // Update access token in cookies and localStorage
        Cookies.set(TOKEN_COOKIE, newAccessToken, COOKIE_OPTIONS);
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', newAccessToken);
        }
        
        console.log('✅ Access token refreshed successfully');
        return newAccessToken;
    },

    // Helper: Get auth token
    getToken(): string | undefined {
        return Cookies.get(TOKEN_COOKIE);
    },

    // Helper: Get user role
    getRole(): string | undefined {
        return Cookies.get(ROLE_COOKIE);
    },

    // Helper: Check if authenticated
    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};
