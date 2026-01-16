'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

import { AuthInput } from './AuthInput';
import { PasswordInput } from './PasswordInput';
import { AuthButton } from './AuthButton';
import { FormField } from './FormField';

import { loginUserSchema, LoginUserInput } from '@/lib/validations/auth.schemas';
import { authService } from '@/lib/api/services/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials, setError } from '@/store/slices/auth.slice';

export interface LoginFormProps {
  /** Callback when login is successful */
  onSuccess?: () => void;
  /** Redirect URL after successful login */
  redirectUrl?: string;
  /** Show loading state externally */
  loading?: boolean;
}

export default function LoginForm({
  onSuccess,
  redirectUrl = '/client/dashboard',
  loading: externalLoading,
}: LoginFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);

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

      dispatch(
        setCredentials({
          user: response.user,
          token: response?.accessToken,
        })
      );

      toast.success('Welcome back!', {
        description: 'You have successfully logged in.',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectUrl);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
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

  const isSubmitting = externalLoading ?? isLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        label="Email Address"
        htmlFor="login-email"
        required
        error={errors.email?.message}
      >
        <AuthInput
          id="login-email"
          type="email"
          placeholder="you@company.com"
          icon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
          autoComplete="email"
          disabled={isSubmitting}
          {...register('email')}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="login-password"
        required
        error={errors.password?.message}
      >
        <PasswordInput
          id="login-password"
          placeholder="Enter your password"
          icon={<Lock className="h-5 w-5" />}
          error={errors.password?.message}
          autoComplete="current-password"
          disabled={isSubmitting}
          {...register('password')}
        />
      </FormField>

      <AuthButton type="submit" loading={isSubmitting}>
        Sign In
      </AuthButton>
    </form>
  );
}
