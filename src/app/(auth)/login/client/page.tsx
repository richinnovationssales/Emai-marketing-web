"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Loader2, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { loginUserSchema, LoginUserInput } from "@/lib/validations/auth.schemas";
import { authService } from "@/lib/api/services/auth.service";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, setError } from "@/store/slices/auth.slice";
import { getErrorMessage } from "@/lib/utils/error-handler";

export default function ClientLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  const form = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginUserInput) => {
    setIsLoading(true);
    try {
      const response = await authService.loginUser({
        email: data.email,
        password: data.password,
      });

      dispatch(setCredentials({ user: response.user, token: response.accessToken }));
      toast.success("Welcome back!", { description: "You have successfully logged in." });
      router.push("/client/dashboard");
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      dispatch(setError(message));
      toast.error("Login failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,160,23,0.2)" }}
    >
      {/* Card header */}
      <div
        className="px-8 pt-8 pb-6 border-b"
        style={{ borderColor: "rgba(212,160,23,0.15)" }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(212,160,23,0.15)", border: "1.5px solid rgba(212,160,23,0.4)" }}
          >
            <User size={18} style={{ color: "#d4a017" }} />
          </div>
          <h1 className="text-xl font-bold text-white">Welcome Back</h1>
        </div>
        <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          Sign in to your account to continue
        </p>
      </div>

      {/* Form */}
      <div className="px-8 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        autoComplete="email"
                        className="pl-9 h-10 text-sm text-white placeholder:text-white/25 focus-visible:ring-[#d4a017]"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-[12px]" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                      Password
                    </FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-[12px] transition-colors hover:opacity-80"
                      style={{ color: "#d4a017" }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="pl-9 h-10 text-sm text-white placeholder:text-white/25 focus-visible:ring-[#d4a017]"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-[12px]" />
                </FormItem>
              )}
            />

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-white/20 data-[state=checked]:bg-[#d4a017] data-[state=checked]:border-[#d4a017]"
              />
              <Label
                htmlFor="remember"
                className="text-[13px] cursor-pointer"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Remember me
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 font-bold text-[14px] hover:opacity-90 transition-opacity mt-1"
              style={{ background: "#d4a017", color: "#0d1b2e" }}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </Form>
      </div>

      {/* Footer */}
      <div
        className="px-8 pb-6 pt-2 flex flex-col gap-3 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        {/* Divider */}
        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 text-[11.5px]" style={{ background: "#0d1b2e", color: "rgba(255,255,255,0.3)" }}>
              or
            </span>
          </div>
        </div>

        <Link
          href="/login"
          className="text-[12.5px] text-center transition-colors hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          ← Back to login options
        </Link>
      </div>
    </div>
  );
}

// 'use client';

// import * as React from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Mail, Lock, ArrowLeft } from 'lucide-react';
// import { toast } from 'sonner';

// import { AuthCard } from '@/components/auth/AuthCard';
// import { AuthInput } from '@/components/auth/AuthInput';
// import { PasswordInput } from '@/components/auth/PasswordInput';
// import { AuthButton } from '@/components/auth/AuthButton';
// import { FormField } from '@/components/auth/FormField';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';

// import { loginUserSchema, LoginUserInput } from '@/lib/validations/auth.schemas';
// import { authService } from '@/lib/api/services/auth.service';
// import { useAppDispatch } from '@/store/hooks';
// import { setCredentials, setError } from '@/store/slices/auth.slice';
// import { UserRole } from '@/types/enums/user-role.enum';

// export default function ClientLoginPage() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [rememberMe, setRememberMe] = React.useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginUserInput>({
//     resolver: zodResolver(loginUserSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//   });

//   // ============================================
// // SHARED UTILITY — put this in a shared file or
// // copy it into both login files
// // ============================================

// function getErrorMessage(error: unknown): string {
//   // ✅ Axios errors: real backend message is at error.response.data.message
//   if (typeof error === 'object' && error !== null && 'response' in error) {
//     const msg = (error as any).response?.data?.message;
//     if (msg) return Array.isArray(msg) ? msg.join(', ') : String(msg);
//   }
//   if (error instanceof Error) return error.message;
//   if (typeof error === 'string') return error;
//   return 'Something went wrong. Please try again.';
// }



// // ============================================
// // CLIENT LOGIN — onSubmit fix
// // ============================================

// const onSubmit = async (data: LoginUserInput) => {
//   setIsLoading(true);
//   try {
//     const response = await authService.loginUser({
//       email: data.email,
//       password: data.password,
//     });

//     dispatch(setCredentials({
//       user: response.user,
//       token: response.accessToken,
//     }));

//     toast.success('Welcome back!', {
//       description: 'You have successfully logged in.',
//     });

//     // ✅ Navigation inside try — only runs on success
//     router.push('/client/dashboard');
//   } catch (error: unknown) {
//     // ✅ Extract real backend message, not the generic Axios one
//     const message = getErrorMessage(error);
//     dispatch(setError(message));
//     toast.error('Login failed', { description: message });
//   } finally {
//     setIsLoading(false);
//   }
// };

//   // const onSubmit = async (data: LoginUserInput) => {
//   //   setIsLoading(true);
    
//   //   try {
//   //     const response = await authService.loginUser({
//   //       email: data.email,
//   //       password: data.password,
//   //     });

//   //     // Store credentials in Redux and localStorage
//   //     dispatch(setCredentials({
//   //       user: response.user,
//   //       token: response.accessToken,
//   //     }));

//   //     toast.success('Welcome back!', {
//   //       description: 'You have successfully logged in.',
//   //     });

//   //     // Route based on user role
//   //     const role = response.user.role;
//   //     if (role === UserRole.CLIENT_SUPER_ADMIN || role === UserRole.CLIENT_ADMIN) {
//   //       router.push('/client/dashboard');
//   //     } else if (role === UserRole.CLIENT_USER) {
//   //       router.push('/client/dashboard');
//   //     } else {
//   //       // Fallback for any other role
//   //       // router.push('/');
//   //     }
//   //   } catch (error: unknown) {
//   //     const errorMessage = error instanceof Error 
//   //       ? error.message 
//   //       : 'Invalid email or password. Please try again.';
      
//   //     dispatch(setError(errorMessage));
//   //     toast.error('Login failed', {
//   //       description: errorMessage,
//   //     });
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   return (
//     <AuthCard
//       title="Welcome Back"
//       description="Sign in to your account to continue"
//     >
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//         {/* Email Field */}
//         <FormField
//           label="Email Address"
//           htmlFor="email"
//           required
//           error={errors.email?.message}
//         >
//           <AuthInput
//             id="email"
//             type="email"
//             placeholder="you@company.com"
//             icon={<Mail className="h-5 w-5" />}
//             error={errors.email?.message}
//             autoComplete="email"
//             {...register('email')}
//           />
//         </FormField>

//         {/* Password Field */}
//         <FormField
//           label="Password"
//           htmlFor="password"
//           required
//           error={errors.password?.message}
//         >
//           <PasswordInput
//             id="password"
//             placeholder="Enter your password"
//             icon={<Lock className="h-5 w-5" />}
//             error={errors.password?.message}
//             autoComplete="current-password"
//             {...register('password')}
//           />
//         </FormField>

//         {/* Remember Me & Forgot Password */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Checkbox
//               id="remember"
//               checked={rememberMe}
//               onCheckedChange={(checked) => setRememberMe(checked === true)}
//             />
//             <Label
//               htmlFor="remember"
//               className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
//             >
//               Remember me
//             </Label>
//           </div>
//           <Link
//             href="/forgot-password"
//             className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
//           >
//             Forgot password?
//           </Link>
//         </div>

//         {/* Submit Button */}
//         <AuthButton type="submit" loading={isLoading}>
//           Sign In
//         </AuthButton>

//         {/* Divider */}
//         <div className="relative my-6">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-200 dark:border-slate-700" />
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">
//               or
//             </span>
//           </div>
//         </div>

//         {/* Back to Login Selection */}
//         <Link
//           href="/login"
//           className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to login options
//         </Link>
//       </form>

//       {/* Register Link */}
//       <div className="mt-8 text-center">
//         {/* <p className="text-sm text-gray-600 dark:text-gray-400">
//           Don&apos;t have an account?{' '}
//           <Link
//             href="/register"
//             className="font-semibold text-blue-600 hover:text-blue-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
//           >
//             Register your company
//           </Link>
//         </p> */}
//       </div>
//     </AuthCard>
//   );
// }