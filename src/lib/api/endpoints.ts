export const API_ENDPOINTS = {
  AUTH: {
    LOGIN_ADMIN: '/auth/login/admin',
    LOGIN_USER: '/auth/login',
    REGISTER: '/auth/register-client'
  },
  CONTACTS: '/contacts',
  CAMPAIGNS: {
    BASE: '/campaigns',
    BY_ID: (id: string) => `/campaigns/${id}`,
    SUBMIT: (id: string) => `/campaigns/${id}/submit`,
    PENDING: '/campaigns/pending',
    APPROVE: (id: string) => `/campaigns/${id}/approve`,
    REJECT: (id: string) => `/campaigns/${id}/reject`,
    SEND: (id: string) => `/campaigns/${id}/send`,
  },
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
    ADMIN: '/dashboard/admin',
    CLIENT: '/dashboard/client',
    EMPLOYEE: '/dashboard/employee',
    CAMPAIGN_PERFORMANCE: '/dashboard/campaign-performance',
  },
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    CAMPAIGNS: '/analytics/campaigns',
    CAMPAIGN_DETAIL: (id: string) => `/analytics/campaigns/${id}`,
    CAMPAIGN_TIMELINE: (id: string) => `/analytics/campaigns/${id}/timeline`,
    EVENTS: '/analytics/events',
  },
  ADMINS: {
    BASE: '/admin/users',
    BY_ID: (id: string) => `/admin/users/${id}`,
  },
};

