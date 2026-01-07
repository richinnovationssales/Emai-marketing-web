export const API_ENDPOINTS = {
  AUTH: {
    LOGIN_ADMIN: '/auth/login/admin',
    LOGIN_USER: '/auth/login',
    REGISTER: '/auth/register-client'
  },
  CONTACTS: '/contacts',
  CAMPAIGNS: '/campaigns',
  CLIENTS: {
    BASE: '/admin/clients',
    PENDING: '/admin/clients/pending',
    BY_ID: (id: string) => `/admin/clients/${id}`,
    APPROVE: (id: string) => `/admin/clients/${id}/approve`,
    REJECT: (id: string) => `/admin/clients/${id}/reject`,
    DEACTIVATE: (id: string) => `/admin/clients/${id}/deactivate`,
    REACTIVATE: (id: string) => `/admin/clients/${id}/reactivate`,
    ANALYTICS: (id: string) => `/admin/clients/${id}/analytics`,
    ONBOARD: '/admin/clients/onboard',
  },
  GROUPS: '/groups',
  CONTACT_GROUPS: '/contact-groups',
  TEMPLATES: '/templates',
  USERS: {
    BASE: '/users',
    CLIENT_ADMINS: '/users/client-admins',
    CLIENT_USERS: '/users/client-users',
    BY_ID: (id: string) => `/users/${id}`,
    ME: '/users/me/profile',
  },
  EMPLOYEES: '/employees',
  PLANS: {
    BASE: '/admin/plans',
    BY_ID: (id: string) => `/admin/plans/${id}`,
    CLIENTS: (id: string) => `/admin/plans/${id}/clients`,
  },
  CUSTOM_FIELDS: '/custom-fields',
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    STATS: '/dashboard/stats',
  },
  ANALYTICS: {
    CAMPAIGNS: '/analytics/campaigns',
    CONTACTS: '/analytics/contacts',
    OVERVIEW: '/analytics/overview',
  },
  ADMINS: {
    BASE: '/admin/users',
    BY_ID: (id: string) => `/admin/users/${id}`,
  },
};

