'use client';

import { format } from 'date-fns';
import { useHydrated } from '@/hooks/useHydrated';
import { Skeleton } from '@/components/ui/skeleton';

interface FormattedDateProps {
  date: string | Date;
  formatStr?: string;
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * A hydration-safe date formatting component.
 * Prevents hydration mismatches by only rendering formatted dates on the client.
 * 
 * @param date - The date to format (string or Date object)
 * @param formatStr - The date-fns format string (default: 'MMM d, yyyy')
 * @param fallback - Optional fallback to show during SSR (default: skeleton loader)
 * @param className - Optional CSS classes to apply
 * 
 * @example
 * ```tsx
 * <FormattedDate date={user.createdAt} formatStr="PPP" />
 * <FormattedDate date={new Date()} formatStr="MMM d, yyyy 'at' h:mm a" />
 * ```
 */
export function FormattedDate({ 
  date, 
  formatStr = 'MMM d, yyyy',
  fallback,
  className 
}: FormattedDateProps) {
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return fallback || <Skeleton className={`h-4 w-24 ${className || ''}`} />;
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return <span className={className}>{format(dateObj, formatStr)}</span>;
  } catch (error) {
    console.error('Error formatting date:', error);
    return <span className={className}>Invalid date</span>;
  }
}
