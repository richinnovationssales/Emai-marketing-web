'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            // Base styles
            'flex h-12 w-full rounded-xl border bg-white/80 dark:bg-slate-800/80',
            'px-4 py-3 text-base',
            // Padding for icon
            icon && 'pl-10',
            // Text colors
            'text-gray-900 dark:text-white',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            // Border
            'border-gray-200 dark:border-slate-700',
            // Focus ring with gradient-like effect
            'focus:outline-none focus:ring-2',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30'
              : 'focus:border-blue-500 dark:focus:border-indigo-500 focus:ring-blue-500/30 dark:focus:ring-indigo-500/30',
            // Transition
            'transition-all duration-200',
            // Hover
            'hover:border-gray-300 dark:hover:border-slate-600',
            // Disabled
            'disabled:cursor-not-allowed disabled:opacity-50',
            // Error shake animation
            error && 'animate-shake',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
