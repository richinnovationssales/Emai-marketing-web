"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/lib/api/hooks/useAuth";
import {
  loginAdminSchema,
  LoginAdminInput,
} from "@/lib/validations/auth.schemas";
import { ROUTES } from "@/lib/constants/routes";
import { getErrorMessage } from "@/lib/utils/error-handler";

// Separate component that uses useSearchParams
function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const redirectUrl = searchParams.get("redirect") || ROUTES.ADMIN.DASHBOARD;

  const form = useForm<LoginAdminInput>({
    resolver: zodResolver(loginAdminSchema),
    defaultValues: {
      email: "",
      password: "",
      isSuperAdmin: false,
    },
  });

// ============================================
// ADMIN LOGIN — onSubmit fix
// ============================================

async function onSubmit(data: LoginAdminInput) {
  setIsLoading(true);
  try {
    await loginAdmin(data);
    toast.success('Logged in successfully');
    // ✅ router.push stays inside try — only runs on success
    router.push(redirectUrl);
  } catch (error: unknown) {
    // ✅ Extract real backend message, not the generic Axios one
    toast.error('Login failed', { description: getErrorMessage(error) });
  } finally {
    // ✅ Always resets — was missing on success path before
    setIsLoading(false);
  }
}



  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Admin Login</CardTitle>
        <CardDescription>
          Enter your credentials to access the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4"
          >
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
                    <FormLabel>Sign in as Super Admin</FormLabel>
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
          By clicking continue, you agree to our Terms of Service and
          Privacy Policy.
        </div>
      </CardFooter>
    </Card>
  );
}

// Main component with Suspense boundary
export default function AdminLoginClient() {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center px-4">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <Suspense fallback={
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        }>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}

