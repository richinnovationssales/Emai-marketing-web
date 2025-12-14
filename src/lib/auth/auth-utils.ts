import { Admin } from '@/types/entities/admin.types';
import { User } from '@/types/entities/user.types';

// Token management
export const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth-token');
};

export const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', token);
    }
};

export const removeToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
    }
};

// Decode JWT token (simple implementation)
export const decodeToken = (token: string): Admin | User | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Check if user has specific role
export const hasRole = (user: Admin | User | null, roles: string[]): boolean => {
    if (!user || !('role' in user)) return false;
    return roles.includes(user.role);
};

// Check if user is admin
export const isAdmin = (user: Admin | User | null): boolean => {
    if (!user || !('role' in user)) return false;
    return user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
};

// Check if user is client user
export const isClientUser = (user: Admin | User | null): boolean => {
    if (!user || !('role' in user)) return false;
    return user.role.startsWith('CLIENT_');
};
