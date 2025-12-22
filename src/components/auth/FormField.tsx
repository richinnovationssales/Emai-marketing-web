'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  required,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={htmlFor}
        className={cn(
          'text-sm font-medium text-gray-700 dark:text-gray-300',
          error && 'text-red-500 dark:text-red-400'
        )}
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500 dark:text-red-400">*</span>
        )}
      </Label>
      {children}
    </div>
  );
}
