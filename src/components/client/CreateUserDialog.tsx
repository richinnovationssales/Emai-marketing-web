'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Lock } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { FormField } from '@/components/auth/FormField';
import { userService } from '@/lib/api/services/user.service';
import { UserRole } from '@/types/enums/user-role.enum';

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

type CreateUserInput = z.infer<typeof createUserSchema>;

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: UserRole.CLIENT_ADMIN | UserRole.CLIENT_USER;
  onSuccess?: () => void;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
}: CreateUserDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: CreateUserInput) => {
    setIsLoading(true);

    try {
      if (role === UserRole.CLIENT_ADMIN) {
        await userService.createClientAdmin(data);
        toast.success('Admin created successfully', {
          description: `${data.email} has been added as a CLIENT_ADMIN`,
        });
      } else {
        await userService.createClientUser(data);
        toast.success('Employee created successfully', {
          description: `${data.email} has been added as a CLIENT_USER`,
        });
      }

      reset();
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create user. Please try again.';

      toast.error('Creation failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      reset();
    }
    onOpenChange(newOpen);
  };

  const roleLabel = role === UserRole.CLIENT_ADMIN ? 'Admin' : 'Employee';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New {roleLabel}</DialogTitle>
          <DialogDescription>
            Add a new {roleLabel.toLowerCase()} to your organization. They will receive an
            email with their login credentials.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            label="Email Address"
            htmlFor="create-user-email"
            required
            error={errors.email?.message}
          >
            <AuthInput
              id="create-user-email"
              type="email"
              placeholder="user@company.com"
              icon={<Mail className="h-5 w-5" />}
              error={errors.email?.message}
              autoComplete="email"
              disabled={isLoading}
              {...register('email')}
            />
          </FormField>

          <FormField
            label="Password"
            htmlFor="create-user-password"
            required
            error={errors.password?.message}
          >
            <PasswordInput
              id="create-user-password"
              placeholder="Enter a secure password"
              icon={<Lock className="h-5 w-5" />}
              error={errors.password?.message}
              autoComplete="new-password"
              disabled={isLoading}
              showStrength
              {...register('password')}
            />
          </FormField>

          <div className="flex gap-3 pt-4">
            <AuthButton
              type="button"
              variant="secondary"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </AuthButton>
            <AuthButton type="submit" loading={isLoading} className="flex-1">
              Create {roleLabel}
            </AuthButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
