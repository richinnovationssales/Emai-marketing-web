import { AdminRole } from '@/types/enums/admin-role.enum';
import { UserRole } from '@/types/enums/user-role.enum';

export const ADMIN_ROLES = {
    SUPER_ADMIN: AdminRole.SUPER_ADMIN,
    ADMIN: AdminRole.ADMIN,
} as const;

export const USER_ROLES = {
    CLIENT_SUPER_ADMIN: UserRole.CLIENT_SUPER_ADMIN,
    CLIENT_ADMIN: UserRole.CLIENT_ADMIN,
    CLIENT_USER: UserRole.CLIENT_USER,
} as const;

export const ALL_ROLES = {
    ...ADMIN_ROLES,
    ...USER_ROLES,
} as const;
