/**
 * Utility functions to prevent hydration mismatches in Next.js applications.
 * 
 * Common causes of hydration mismatches:
 * - Date formatting (timezone/locale differences)
 * - Random values (Math.random(), Date.now())
 * - Browser-specific APIs (window, localStorage)
 * - Third-party scripts that modify DOM
 */

/**
 * Checks if code is running on the client side.
 * Use this for conditional logic that should only run in the browser.
 */
export const isClient = typeof window !== 'undefined';

/**
 * Safely access localStorage with SSR support.
 * Returns null during SSR to prevent hydration mismatches.
 */
export function safeLocalStorage() {
    if (!isClient) return null;
    return window.localStorage;
}

/**
 * Safely access sessionStorage with SSR support.
 * Returns null during SSR to prevent hydration mismatches.
 */
export function safeSessionStorage() {
    if (!isClient) return null;
    return window.sessionStorage;
}

/**
 * Get a consistent value between server and client renders.
 * Useful for values that should be the same on both sides.
 * 
 * @example
 * ```tsx
 * // Instead of: const id = Math.random();
 * const id = useConsistentValue(() => Math.random());
 * ```
 */
export function getConsistentValue<T>(serverValue: T, clientValue: T, isHydrated: boolean): T {
    return isHydrated ? clientValue : serverValue;
}
