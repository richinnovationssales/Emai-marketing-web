import { format, parseISO, formatDistance, isValid } from 'date-fns';

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date, formatStr: string = 'PPP'): string => {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return 'Invalid date';
        return format(dateObj, formatStr);
    } catch (error) {
        return 'Invalid date';
    }
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return 'Invalid date';
        return formatDistance(dateObj, new Date(), { addSuffix: true });
    } catch (error) {
        return 'Invalid date';
    }
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};
