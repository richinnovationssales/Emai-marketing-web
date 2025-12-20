import {
    BarChart,
    Users,
    Settings,
    Mail,
    LayoutDashboard,
    Target,
    FileText,
    Layers,
    UserCog,
    LucideIcon
} from 'lucide-react';
import { ROUTES } from './routes';
import { AdminRole } from '@/types/enums/admin-role.enum';
import { UserRole } from '@/types/enums/user-role.enum';

export interface NavigationItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

// Super Admin Navigation
export const SUPER_ADMIN_NAV_ITEMS: NavigationItem[] = [
    {
        title: 'Dashboard',
        href: ROUTES.ADMIN.DASHBOARD,
        icon: LayoutDashboard,
    },
    {
        title: 'Clients',
        href: ROUTES.ADMIN.CLIENTS,
        icon: Users,
    },
    {
        title: 'Plans',
        href: ROUTES.ADMIN.PLANS,
        icon: Target,
    },
    {
        title: 'Admins',
        href: ROUTES.ADMIN.ADMINS,
        icon: UserCog,
    },
    {
        title: 'Activity Logs',
        href: ROUTES.ADMIN.ACTIVITY_LOGS,
        icon: FileText,
    },
];

// Regular Admin Navigation
export const ADMIN_NAV_ITEMS: NavigationItem[] = [
    {
        title: 'Dashboard',
        href: ROUTES.ADMIN.DASHBOARD,
        icon: LayoutDashboard,
    },
    {
        title: 'Clients',
        href: ROUTES.ADMIN.CLIENTS,
        icon: Users,
    },
    {
        title: 'Plans',
        href: ROUTES.ADMIN.PLANS,
        icon: Target,
    },
];

// Client Navigation
export const CLIENT_NAV_ITEMS: NavigationItem[] = [
    {
        title: 'Dashboard',
        href: ROUTES.CLIENT.DASHBOARD,
        icon: LayoutDashboard,
    },
    {
        title: 'Contacts',
        href: ROUTES.CLIENT.CONTACTS,
        icon: Users,
    },
    {
        title: 'Campaigns',
        href: ROUTES.CLIENT.CAMPAIGNS,
        icon: Mail,
    },
    {
        title: 'Templates',
        href: ROUTES.CLIENT.TEMPLATES,
        icon: FileText,
    },
    {
        title: 'Groups',
        href: ROUTES.CLIENT.GROUPS,
        icon: Layers,
    },
    {
        title: 'Analytics',
        href: ROUTES.CLIENT.ANALYTICS,
        icon: BarChart,
    },
    {
        title: 'Team',
        href: ROUTES.CLIENT.USERS,
        icon: UserCog,
    },
    {
        title: 'Settings',
        href: ROUTES.CLIENT.SETTINGS,
        icon: Settings,
    },
];

/**
 * Get navigation items based on user role
 */
export function getNavigationByRole(role: AdminRole | UserRole | string): NavigationItem[] {
    switch (role) {
        case AdminRole.SUPER_ADMIN:
        case 'SUPER_ADMIN':
            return SUPER_ADMIN_NAV_ITEMS;

        case AdminRole.ADMIN:
        case 'ADMIN':
            return ADMIN_NAV_ITEMS;

        case UserRole.CLIENT_SUPER_ADMIN:
        case UserRole.CLIENT_ADMIN:
        case UserRole.CLIENT_USER:
        case 'CLIENT_SUPER_ADMIN':
        case 'CLIENT_ADMIN':
        case 'CLIENT_USER':
            return CLIENT_NAV_ITEMS;

        default:
            return [];
    }
}
