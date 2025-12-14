'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Link, Loader2, Mail, Lock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ModeToggle } from '@/components/layout/ModeToggle';
import { useAuth } from '@/lib/api/hooks/useAuth';
import { loginAdminSchema, LoginAdminInput } from '@/lib/validations/auth.schemas';
import { ROUTES } from '@/lib/constants/routes';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginAdminInput>({
    resolver: zodResolver(loginAdminSchema),
    defaultValues: {
      email: '',
      password: '',
      isSuperAdmin: false,
    },
  });

  async function onSubmit(data: LoginAdminInput) {
    setIsLoading(true);
    try {
      await loginAdmin(data);
      toast.success('Logged in successfully');
      
      // Route based on role (Super Admin vs Admin)
      // Since useAuth redirects are handled in component usually, but here we can force it
      // actually useAuth hook implementation shows router.push('/login') on logout
      // but login function returns response. We should redirect here.
      if (data.isSuperAdmin) {
        router.push(ROUTES.ADMIN.DASHBOARD); // Unified route
      } else {
        router.push(ROUTES.ADMIN.DASHBOARD);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ModeToggle />
      </div>
      
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <ShieldCheck className="mr-2 h-6 w-6" />
          EmailCRM Admin
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Powerful email marketing automation and CRM management for modern businesses.&rdquo;
            </p>
            <footer className="text-sm">Admin Control Panel</footer>
          </blockquote>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Admin Login
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="name@example.com" 
                          className="pl-9" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-9" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isSuperAdmin"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Sign in as Super Admin
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
            </form>
          </Form>
          
          <div className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}