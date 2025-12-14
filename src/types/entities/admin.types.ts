import { AdminRole } from '../enums/admin-role.enum';

export interface Admin {
    id: string;
    email: string;
    role: AdminRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAdminDTO {
    email: string;
    password: string;
    role: AdminRole;
}

export interface UpdateAdminDTO {
    email?: string;
    isActive?: boolean;
}

export interface AdminLoginDTO {
    email: string;
    password: string;
    isSuperAdmin: boolean;
}

export interface AuthResponse {
    user: Admin;
    token: string;
}
