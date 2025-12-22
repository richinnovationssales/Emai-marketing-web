'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ className, children, loading, variant = 'primary', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base styles
          'relative flex h-12 w-full items-center justify-center rounded-xl',
          'px-6 text-base font-semibold',
          'transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          // Disabled
          'disabled:cursor-not-allowed disabled:opacity-60',
          // Variant styles
          variant === 'primary' && [
            // Gradient background
            'bg-gradient-to-r from-blue-600 to-indigo-600',
            'dark:from-blue-500 dark:to-indigo-500',
            'text-white',
            // Hover effect
            'hover:from-blue-700 hover:to-indigo-700',
            'dark:hover:from-blue-600 dark:hover:to-indigo-600',
            // Shadow
            'shadow-lg shadow-blue-500/30 dark:shadow-indigo-500/30',
            'hover:shadow-xl hover:shadow-blue-500/40 dark:hover:shadow-indigo-500/40',
            // Focus ring
            'focus:ring-blue-500/50 dark:focus:ring-indigo-500/50',
            // Active state
            'active:scale-[0.98]',
          ],
          variant === 'secondary' && [
            'bg-gray-100 dark:bg-slate-800',
            'text-gray-900 dark:text-white',
            'hover:bg-gray-200 dark:hover:bg-slate-700',
            'focus:ring-gray-500/50',
          ],
          variant === 'outline' && [
            'border-2 border-blue-500/50 dark:border-indigo-500/50',
            'bg-transparent',
            'text-blue-600 dark:text-indigo-400',
            'hover:bg-blue-50 dark:hover:bg-indigo-500/10',
            'focus:ring-blue-500/50 dark:focus:ring-indigo-500/50',
          ],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Please wait...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

AuthButton.displayName = 'AuthButton';
