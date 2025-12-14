export enum AdminRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
}

export const AdminRoleLabels: Record<AdminRole, string> = {
    [AdminRole.SUPER_ADMIN]: 'Super Admin',
    [AdminRole.ADMIN]: 'Admin',
};
