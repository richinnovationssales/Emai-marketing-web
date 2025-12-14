export enum UserRole {
    CLIENT_SUPER_ADMIN = 'CLIENT_SUPER_ADMIN',
    CLIENT_ADMIN = 'CLIENT_ADMIN',
    CLIENT_USER = 'CLIENT_USER',
}

export const UserRoleLabels: Record<UserRole, string> = {
    [UserRole.CLIENT_SUPER_ADMIN]: 'Client Super Admin',
    [UserRole.CLIENT_ADMIN]: 'Client Admin',
    [UserRole.CLIENT_USER]: 'Client User',
};
