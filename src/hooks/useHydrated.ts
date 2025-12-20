'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if the component has hydrated on the client.
 * Useful for preventing hydration mismatches when rendering client-specific content.
 * 
 * @returns boolean - true if the component has mounted on the client, false otherwise
 * 
 * @example
 * ```tsx
 * const isHydrated = useHydrated();
 * 
 * return (
 *   <div>
 *     {isHydrated ? (
 *       <span>{format(new Date(), 'PPP')}</span>
 *     ) : (
 *       <span>Loading...</span>
 *     )}
 *   </div>
 * );
 * ```
 */
export function useHydrated(): boolean {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    return hydrated;
}
