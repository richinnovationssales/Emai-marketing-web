'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Mail, Lock } from 'lucide-react';
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
import { useAuth } from '@/lib/api/hooks/useAuth';
import { loginAdminSchema, LoginAdminInput } from '@/lib/validations/auth.schemas';
import { ROUTES } from '@/lib/constants/routes';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Get redirect URL from query params (set by middleware)
  const redirectUrl = searchParams.get('redirect') || ROUTES.ADMIN.DASHBOARD;

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
      console.log('🔐 Attempting login...');
      await loginAdmin(data);
      
      toast.success('Logged in successfully');
      console.log('✅ Login successful, navigating to:', redirectUrl);
      
      // Small delay to ensure cookies are set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to dashboard or intended page
      window.location.href = redirectUrl; // Hard navigation to ensure middleware runs
      
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      toast.error(error.message || 'Failed to login. Please check your credentials.');
      setIsLoading(false);
    }
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
            <CardFooter className="px-8 pt-0">
              <div className="text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our Terms of Service and Privacy Policy.
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
