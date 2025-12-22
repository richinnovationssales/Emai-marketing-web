'use client';

import * as React from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { AuthInput } from './AuthInput';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  icon?: React.ReactNode;
  error?: string;
  showStrength?: boolean;
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (score <= 4) return { score: 2, label: 'Medium', color: 'bg-yellow-500' };
  return { score: 3, label: 'Strong', color: 'bg-green-500' };
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ icon, error, showStrength = false, className, value, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const passwordValue = typeof value === 'string' ? value : '';
    const strength = showStrength && passwordValue ? getPasswordStrength(passwordValue) : null;

    return (
      <div className="relative">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10">
              {icon}
            </div>
          )}
          <input
            type={showPassword ? 'text' : 'password'}
            className={cn(
              // Base styles
              'flex h-12 w-full rounded-xl border bg-white/80 dark:bg-slate-800/80',
              'px-4 py-3 pr-12 text-base',
              // Padding for icon
              icon && 'pl-10',
              // Text colors
              'text-gray-900 dark:text-white',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              // Border
              'border-gray-200 dark:border-slate-700',
              // Focus ring
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
              className
            )}
            ref={ref}
            value={value}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {error && (
          <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        {showStrength && strength && passwordValue && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    level <= strength.score ? strength.color : 'bg-gray-200 dark:bg-slate-700'
                  )}
                />
              ))}
            </div>
            <p className={cn(
              'text-xs',
              strength.score === 1 && 'text-red-500',
              strength.score === 2 && 'text-yellow-500',
              strength.score === 3 && 'text-green-500'
            )}>
              {strength.label}
            </p>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
