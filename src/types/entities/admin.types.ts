import { AdminRole } from '../enums/admin-role.enum';

export interface Admin {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | string;
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

// export interface AuthResponse {
//     user: Admin;
//     token: string;
// }


export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  admin: Admin;
}