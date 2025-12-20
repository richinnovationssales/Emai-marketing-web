/**
 * Converts an error to a user-friendly string message
 * Handles Error objects, strings, and other types
 */
export function getErrorMessage(error: unknown, fallback = 'An error occurred'): string {
    if (typeof error === 'string') {
        return error;
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (error && typeof error === 'object' && 'message' in error) {
        return String(error.message);
    }

    return fallback;
}
