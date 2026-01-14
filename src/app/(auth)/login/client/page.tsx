'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { FormField } from '@/components/auth/FormField';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import { loginUserSchema, LoginUserInput } from '@/lib/validations/auth.schemas';
import { authService } from '@/lib/api/services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials, setError } from '@/store/slices/auth.slice';
import { UserRole } from '@/types/enums/user-role.enum';

export default function ClientLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginUserInput) => {
    setIsLoading(true);
    
    try {
      const response = await authService.loginUser({
        email: data.email,
        password: data.password,
      });

      // Store credentials in Redux and localStorage
      dispatch(setCredentials({
        user: response.user,
        token: response.accessToken,
      }));

      toast.success('Welcome back!', {
        description: 'You have successfully logged in.',
      });

      // Route based on user role
      const role = response.user.role;
      if (role === UserRole.CLIENT_SUPER_ADMIN || role === UserRole.CLIENT_ADMIN) {
        router.push('/client/dashboard');
      } else if (role === UserRole.CLIENT_USER) {
        router.push('/client/dashboard');
      } else {
        // Fallback for any other role
        router.push('/');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Invalid email or password. Please try again.';
      
      dispatch(setError(errorMessage));
      toast.error('Login failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <FormField
          label="Email Address"
          htmlFor="email"
          required
          error={errors.email?.message}
        >
          <AuthInput
            id="email"
            type="email"
            placeholder="you@company.com"
            icon={<Mail className="h-5 w-5" />}
            error={errors.email?.message}
            autoComplete="email"
            {...register('email')}
          />
        </FormField>

        {/* Password Field */}
        <FormField
          label="Password"
          htmlFor="password"
          required
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            icon={<Lock className="h-5 w-5" />}
            error={errors.password?.message}
            autoComplete="current-password"
            {...register('password')}
          />
        </FormField>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label
              htmlFor="remember"
              className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              Remember me
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <AuthButton type="submit" loading={isLoading}>
          Sign In
        </AuthButton>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">
              or
            </span>
          </div>
        </div>

        {/* Back to Login Selection */}
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login options
        </Link>
      </form>

      {/* Register Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:text-blue-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            Register your company
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}