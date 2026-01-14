import { UserRole } from '../enums/user-role.enum';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    clientId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserDTO {
    email: string;
    password: string;
    role: UserRole;
    clientId: string;
}

export interface UpdateUserDTO {
    email?: string;
    role?: UserRole;
    isActive?: boolean;
}

export interface UserLoginDTO {
    email: string;
    password: string;
}

export interface UserAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
export type CreateUserData = CreateUserDTO;
export type UpdateUserData = UpdateUserDTO;
