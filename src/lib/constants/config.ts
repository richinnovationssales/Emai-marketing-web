export const APP_CONFIG = {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'BEE Smart Campaigns',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',

    // Pagination
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],

    // File upload
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['.csv', '.xlsx', '.xls'],

    // API
    apiTimeout: 30000, // 30 seconds

    // Cache
    defaultStaleTime: 60 * 1000, // 1 minute

    // UI
    toastDuration: 3000, // 3 seconds
    debounceDelay: 300, // 300ms
} as const;
