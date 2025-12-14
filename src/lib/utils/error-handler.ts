import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
    statusCode?: number;
}

/**
 * Handle API errors and show toast notifications
 */
export const handleApiError = (error: unknown, defaultMessage: string = 'An error occurred'): void => {
    if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiError;

        if (apiError?.message) {
            toast.error(apiError.message);
        } else if (apiError?.errors) {
            // Show first validation error
            const firstError = Object.values(apiError.errors)[0]?.[0];
            if (firstError) {
                toast.error(firstError);
            } else {
                toast.error(defaultMessage);
            }
        } else {
            toast.error(defaultMessage);
        }
    } else if (error instanceof Error) {
        toast.error(error.message);
    } else {
        toast.error(defaultMessage);
    }
};

/**
 * Get error message from unknown error
 */
export const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiError;
        return apiError?.message || 'An error occurred';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unknown error occurred';
};
