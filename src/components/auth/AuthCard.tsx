'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
  className,
  ...props
}: AuthCardProps) {
  return (
    <div
      className={cn(
        // Base card styles
        'relative w-full overflow-hidden rounded-2xl',
        // Glassmorphism effects
        'bg-white/90 dark:bg-slate-900/80',
        'backdrop-blur-xl',
        // Border with gradient effect
        'border border-blue-200/50 dark:border-indigo-500/30',
        // Shadow
        'shadow-xl shadow-blue-500/10 dark:shadow-indigo-500/10',
        // Transition for hover
        'transition-all duration-300',
        'hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-indigo-500/20',
        className
      )}
      {...props}
    >
      {/* Gradient overlay for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30 dark:from-blue-900/20 dark:via-transparent dark:to-indigo-900/20 pointer-events-none" />
      
      {/* Content container */}
      <div className="relative p-8">
        {(title || description) && (
          <div className="mb-8 text-center">
            {title && (
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
