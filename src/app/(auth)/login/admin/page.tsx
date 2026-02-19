"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/lib/api/hooks/useAuth";
import { loginAdminSchema, LoginAdminInput } from "@/lib/validations/auth.schemas";
import { ROUTES } from "@/lib/constants/routes";
import { getErrorMessage } from "@/lib/utils/error-handler";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const redirectUrl = searchParams.get("redirect") || ROUTES.ADMIN.DASHBOARD;

  const form = useForm<LoginAdminInput>({
    resolver: zodResolver(loginAdminSchema),
    defaultValues: { email: "", password: "", isSuperAdmin: false },
  });

  async function onSubmit(data: LoginAdminInput) {
    setIsLoading(true);
    try {
      await loginAdmin(data);
      toast.success("Logged in successfully");
      router.push(redirectUrl);
    } catch (error: unknown) {
      toast.error("Login failed", { description: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  }

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
            style={{ background: "#d4a017" }}
          >
            <ShieldCheck size={18} color="#0d1b2e" />
          </div>
          <h1 className="text-xl font-bold" style={{ color: "#f0c040" }}>
            Admin Login
          </h1>
        </div>
        <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          Enter your credentials to access the dashboard
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
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                      <Input
                        placeholder="name@example.com"
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

            {/* Super Admin toggle */}
            <FormField
              control={form.control}
              name="isSuperAdmin"
              render={({ field }) => (
                <FormItem
                  className="flex flex-row items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(212,160,23,0.06)",
                    border: "1px solid rgba(212,160,23,0.2)",
                  }}
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-[#d4a017] data-[state=checked]:bg-[#d4a017] data-[state=checked]:border-[#d4a017]"
                    />
                  </FormControl>
                  <FormLabel className="text-[13px] font-medium cursor-pointer !mt-0" style={{ color: "rgba(255,255,255,0.75)" }}>
                    Sign in as Super Admin
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 font-bold text-[14px] hover:opacity-90 transition-opacity mt-2"
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
        <Link
          href="/login"
          className="text-[12.5px] text-center transition-colors hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          ← Back to login options
        </Link>
        <p className="text-center text-[11.5px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginClient() {
  return (
    <Suspense
      fallback={
        <div
          className="rounded-2xl p-10 flex justify-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,160,23,0.2)" }}
        >
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#d4a017" }} />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
// "use client";

// import { useState, Suspense } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Loader2, Mail, Lock } from "lucide-react";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { useAuth } from "@/lib/api/hooks/useAuth";
// import {
//   loginAdminSchema,
//   LoginAdminInput,
// } from "@/lib/validations/auth.schemas";
// import { ROUTES } from "@/lib/constants/routes";
// import { getErrorMessage } from "@/lib/utils/error-handler";

// // Separate component that uses useSearchParams
// function AdminLoginForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { loginAdmin } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);

//   const redirectUrl = searchParams.get("redirect") || ROUTES.ADMIN.DASHBOARD;

//   const form = useForm<LoginAdminInput>({
//     resolver: zodResolver(loginAdminSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       isSuperAdmin: false,
//     },
//   });

// // ============================================
// // ADMIN LOGIN — onSubmit fix
// // ============================================

// async function onSubmit(data: LoginAdminInput) {
//   setIsLoading(true);
//   try {
//     await loginAdmin(data);
//     toast.success('Logged in successfully');
//     // ✅ router.push stays inside try — only runs on success
//     router.push(redirectUrl);
//   } catch (error: unknown) {
//     // ✅ Extract real backend message, not the generic Axios one
//     toast.error('Login failed', { description: getErrorMessage(error) });
//   } finally {
//     // ✅ Always resets — was missing on success path before
//     setIsLoading(false);
//   }
// }



//   return (
//     <Card>
//       <CardHeader className="space-y-1">
//         <CardTitle className="text-2xl">Admin Login</CardTitle>
//         <CardDescription>
//           Enter your credentials to access the dashboard
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-3 sm:space-y-4"
//           >
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         placeholder="name@example.com"
//                         className="pl-9"
//                         {...field}
//                       />
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         type="password"
//                         placeholder="••••••••"
//                         className="pl-9"
//                         {...field}
//                       />
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="isSuperAdmin"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//                   <FormControl>
//                     <Checkbox
//                       checked={field.value}
//                       onCheckedChange={field.onChange}
//                     />
//                   </FormControl>
//                   <div className="space-y-1 leading-none">
//                     <FormLabel>Sign in as Super Admin</FormLabel>
//                   </div>
//                 </FormItem>
//               )}
//             />

//             <Button className="w-full" type="submit" disabled={isLoading}>
//               {isLoading && (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               )}
//               Sign In
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//       <CardFooter className="px-8 pt-0">
//         <div className="text-center text-sm text-muted-foreground">
//           By clicking continue, you agree to our Terms of Service and
//           Privacy Policy.
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

// // Main component with Suspense boundary
// export default function AdminLoginClient() {
//   return (
//     <div className="min-h-dvh w-full flex items-center justify-center px-4">
//       {/* <div className="mx-auto w-full max-w-sm space-y-6"> */}
//       <div className="mx-auto w-full max-w-sm space-y-4">
//         <Suspense fallback={
//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex justify-center">
//                 <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//               </div>
//             </CardContent>
//           </Card>
//         }>
//           <AdminLoginForm />
//         </Suspense>
//       </div>
//     </div>
//   );
// }

