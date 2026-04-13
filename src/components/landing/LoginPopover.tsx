"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Loader2, User, X, Eye, EyeOff } from "lucide-react";
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

import {
  loginUserSchema,
  LoginUserInput,
} from "@/lib/validations/auth.schemas";
import { authService } from "@/lib/api/services/auth.service";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, setError } from "@/store/slices/auth.slice";
import { getErrorMessage } from "@/lib/utils/error-handler";

export function LoginPopover() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const firstInputRef = React.useRef<HTMLInputElement>(null);

  // Ensure portal target is available (SSR safety)
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when panel is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstInputRef.current?.focus(), 300);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    form.reset();
    setShowPassword(false);
  };

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
        // rememberMe,
      });
      dispatch(setCredentials({ user: response.user, token: response.accessToken }));
      toast.success("Welcome back!", { description: "You have successfully logged in." });
      handleClose();
      router.push("/client/dashboard");
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      dispatch(setError(message));
      toast.error("Login failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const panel = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Panel
          The key fix: portal renders directly under <body> so `fixed` positioning
          is relative to the viewport — not to the navbar or any other ancestor.

          Mobile  : inset-x-0 bottom-0  → full-width bottom sheet, no left clipping
          sm+     : right-6 bottom-6, constrained width → floating card
      */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        className="
          fixed z-[100]
          bg-background text-foreground border border-border shadow-2xl
          animate-in slide-in-from-bottom-4 fade-in duration-300

          bottom-0 left-0 right-0 w-full
          rounded-t-2xl rounded-bl-none rounded-br-none

          sm:left-auto sm:right-6 sm:bottom-6
          sm:w-[400px] sm:rounded-2xl

          max-h-[92dvh] flex flex-col overflow-hidden
        "
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="px-5 sm:px-6 pt-4 pb-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20 shrink-0">
              <User size={17} className="text-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Welcome Back</h3>
              <p className="text-xs text-muted-foreground mt-0.5 hover:text-foreground">Sign in to your account</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            aria-label="Close sign in panel"
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="overflow-y-auto flex-1 px-5 sm:px-6 py-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          {...field}
                          ref={(el) => {
                            field.ref(el);
                            firstInputRef.current = el;
                          }}
                          type="email"
                          autoComplete="email"
                          placeholder="you@company.com"
                          className="pl-9"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-primary hover:underline focus-visible:underline outline-none"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="pl-9 pr-10"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
                  Remember me
                </Label>
              </div>

              {/* Submit */}
              <Button type="submit" disabled={isLoading} className="w-full" size="default">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-border flex items-center justify-between shrink-0">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
          <Link href="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            More options
          </Link>
        </div>

        {/* iOS safe-area bottom padding */}
        <div className="h-[env(safe-area-inset-bottom)] sm:hidden shrink-0" />
      </div>
    </>
  );

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="text-sm font-semibold text-white transition-colors hover:text-gray-500 cursor-pointer"
      >
        Sign in
      </button>

      {/* Portal: mounts outside the navbar so `fixed` is always viewport-relative */}
      {mounted && open && ReactDOM.createPortal(panel, document.body)}
    </>
  );
}

// "use client";

// import * as React from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Mail, Lock, Loader2, User, X } from "lucide-react";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// import { loginUserSchema, LoginUserInput } from "@/lib/validations/auth.schemas";
// import { authService } from "@/lib/api/services/auth.service";
// import { useAppDispatch } from "@/store/hooks";
// import { setCredentials, setError } from "@/store/slices/auth.slice";
// import { getErrorMessage } from "@/lib/utils/error-handler";

// export function LoginPopover() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const [open, setOpen] = React.useState(false);
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [rememberMe, setRememberMe] = React.useState(false);
//   const panelRef = React.useRef<HTMLDivElement>(null);

//   const form = useForm<LoginUserInput>({
//     resolver: zodResolver(loginUserSchema),
//     defaultValues: { email: "", password: "" },
//   });

//   React.useEffect(() => {
//     if (!open) return;
//     const handler = (e: MouseEvent) => {
//       if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, [open]);

//   React.useEffect(() => {
//     if (!open) return;
//     const handler = (e: KeyboardEvent) => {
//       if (e.key === "Escape") setOpen(false);
//     };
//     document.addEventListener("keydown", handler);
//     return () => document.removeEventListener("keydown", handler);
//   }, [open]);

//   const onSubmit = async (data: LoginUserInput) => {
//     setIsLoading(true);
//     try {
//       const response = await authService.loginUser({
//         email: data.email,
//         password: data.password,
//       });

//       dispatch(setCredentials({ user: response.user, token: response.accessToken }));
//       toast.success("Welcome back!", {
//         description: "You have successfully logged in.",
//       });

//       router.push("/client/dashboard");
//     } catch (error: unknown) {
//       const message = getErrorMessage(error);
//       dispatch(setError(message));
//       toast.error("Login failed", { description: message });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Trigger */}
//       <button
//         onClick={() => setOpen((prev) => !prev)}
//         className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
//       >
//         Sign in
//       </button>

//       {/* Panel */}
//       {open && (
//         <div
//           ref={panelRef}
//           className="fixed bottom-6 right-6 z-[100] w-[380px] rounded-2xl overflow-hidden
//                      bg-popover text-popover-foreground border shadow-2xl
//                      animate-in slide-in-from-bottom-4 fade-in duration-300"
//         >
//           {/* Header */}
//           <div className="px-6 pt-5 pb-4 border-b flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 border border-primary/30">
//                 <User size={18} className="text-primary" />
//               </div>
//               <div>
//                 <h3 className="text-base font-bold">
//                   Welcome Back
//                 </h3>
//                 <p className="text-xs text-muted-foreground">
//                   Sign in to your account
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setOpen(false)}
//               className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted transition"
//             >
//               <X size={16} />
//             </button>
//           </div>

//           {/* Form */}
//           <div className="px-6 py-5">
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

//                 {/* Email */}
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email Address</FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                           <Input
//                             type="email"
//                             placeholder="you@company.com"
//                             className="pl-9"
//                             {...field}
//                           />
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Password */}
//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <div className="flex justify-between items-center">
//                         <FormLabel>Password</FormLabel>
//                         <Link
//                           href="/forgot-password"
//                           className="text-xs text-primary hover:underline"
//                         >
//                           Forgot password?
//                         </Link>
//                       </div>
//                       <FormControl>
//                         <div className="relative">
//                           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                           <Input
//                             type="password"
//                             placeholder="••••••••"
//                             className="pl-9"
//                             {...field}
//                           />
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Remember */}
//                 <div className="flex items-center gap-2">
//                   <Checkbox
//                     id="remember"
//                     checked={rememberMe}
//                     onCheckedChange={(checked) =>
//                       setRememberMe(checked === true)
//                     }
//                   />
//                   <Label
//                     htmlFor="remember"
//                     className="text-sm text-muted-foreground"
//                   >
//                     Remember me
//                   </Label>
//                 </div>

//                 {/* Submit */}
//                 <Button type="submit" disabled={isLoading} className="w-full">
//                   {isLoading && (
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   )}
//                   Sign In
//                 </Button>
//               </form>
//             </Form>
//           </div>

//           {/* Footer */}
//           <div className="px-6 pb-4 pt-2 border-t text-center">
//             <Link
//               href="/login"
//               className="text-xs text-muted-foreground hover:text-primary"
//             >
//               More login options
//             </Link>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// // "use client";

// // import * as React from "react";
// // import { useRouter } from "next/navigation";
// // import Link from "next/link";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { Mail, Lock, Loader2, User, X } from "lucide-react";
// // import { toast } from "sonner";

// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form";

// // import { loginUserSchema, LoginUserInput } from "@/lib/validations/auth.schemas";
// // import { authService } from "@/lib/api/services/auth.service";
// // import { useAppDispatch } from "@/store/hooks";
// // import { setCredentials, setError } from "@/store/slices/auth.slice";
// // import { getErrorMessage } from "@/lib/utils/error-handler";

// // export function LoginPopover() {
// //   const router = useRouter();
// //   const dispatch = useAppDispatch();
// //   const [open, setOpen] = React.useState(false);
// //   const [isLoading, setIsLoading] = React.useState(false);
// //   const [rememberMe, setRememberMe] = React.useState(false);
// //   const panelRef = React.useRef<HTMLDivElement>(null);

// //   const form = useForm<LoginUserInput>({
// //     resolver: zodResolver(loginUserSchema),
// //     defaultValues: { email: "", password: "" },
// //   });

// //   // Close on click outside
// //   React.useEffect(() => {
// //     if (!open) return;
// //     const handler = (e: MouseEvent) => {
// //       if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
// //         setOpen(false);
// //       }
// //     };
// //     document.addEventListener("mousedown", handler);
// //     return () => document.removeEventListener("mousedown", handler);
// //   }, [open]);

// //   // Close on Escape
// //   React.useEffect(() => {
// //     if (!open) return;
// //     const handler = (e: KeyboardEvent) => {
// //       if (e.key === "Escape") setOpen(false);
// //     };
// //     document.addEventListener("keydown", handler);
// //     return () => document.removeEventListener("keydown", handler);
// //   }, [open]);

// //   const onSubmit = async (data: LoginUserInput) => {
// //     setIsLoading(true);
// //     try {
// //       const response = await authService.loginUser({
// //         email: data.email,
// //         password: data.password,
// //       });

// //       dispatch(setCredentials({ user: response.user, token: response.accessToken }));
// //       toast.success("Welcome back!", { description: "You have successfully logged in." });
// //       router.push("/client/dashboard");
// //     } catch (error: unknown) {
// //       const message = getErrorMessage(error);
// //       dispatch(setError(message));
// //       toast.error("Login failed", { description: message });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <>
// //       {/* Trigger */}
// //       <button
// //         onClick={() => setOpen((prev) => !prev)}
// //         className="text-[13px] font-semibold text-foreground hover:text-[#d4a017] transition-colors cursor-pointer"
// //       >
// //         Sign in
// //       </button>

// //       {/* Floating Panel */}
// //       {open && (
// //         <div
// //           ref={panelRef}
// //           className="fixed bottom-6 right-6 z-[100] w-[380px] rounded-2xl overflow-hidden shadow-2xl
// //                      animate-in slide-in-from-bottom-4 fade-in duration-300"
// //           style={{
// //             background: "#0d1b2e",
// //             border: "1px solid rgba(212,160,23,0.25)",
// //             boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,160,23,0.1)",
// //           }}
// //         >
// //           {/* Header */}
// //           <div
// //             className="px-6 pt-5 pb-4 border-b flex items-center justify-between"
// //             style={{ borderColor: "rgba(212,160,23,0.15)" }}
// //           >
// //             <div className="flex items-center gap-3">
// //               <div
// //                 className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
// //                 style={{ background: "rgba(212,160,23,0.15)", border: "1.5px solid rgba(212,160,23,0.4)" }}
// //               >
// //                 <User size={18} style={{ color: "#d4a017" }} />
// //               </div>
// //               <div>
// //                 <h3 className="text-base font-bold text-white">Welcome Back</h3>
// //                 <p className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.4)" }}>
// //                   Sign in to your account
// //                 </p>
// //               </div>
// //             </div>
// //             <button
// //               onClick={() => setOpen(false)}
// //               className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
// //               style={{ color: "rgba(255,255,255,0.4)" }}
// //             >
// //               <X size={16} />
// //             </button>
// //           </div>

// //           {/* Form */}
// //           <div className="px-6 py-5">
// //             <Form {...form}>
// //               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
// //                 {/* Email */}
// //                 <FormField
// //                   control={form.control}
// //                   name="email"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <FormLabel className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
// //                         Email Address
// //                       </FormLabel>
// //                       <FormControl>
// //                         <div className="relative">
// //                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
// //                           <Input
// //                             type="email"
// //                             placeholder="you@company.com"
// //                             autoComplete="email"
// //                             className="pl-9 h-9 text-[13px] text-white placeholder:text-white/25 focus-visible:ring-[#d4a017]"
// //                             style={{
// //                               background: "rgba(255,255,255,0.06)",
// //                               border: "1px solid rgba(255,255,255,0.12)",
// //                             }}
// //                             {...field}
// //                           />
// //                         </div>
// //                       </FormControl>
// //                       <FormMessage className="text-red-400 text-[11px]" />
// //                     </FormItem>
// //                   )}
// //                 />

// //                 {/* Password */}
// //                 <FormField
// //                   control={form.control}
// //                   name="password"
// //                   render={({ field }) => (
// //                     <FormItem>
// //                       <div className="flex items-center justify-between">
// //                         <FormLabel className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
// //                           Password
// //                         </FormLabel>
// //                         <Link
// //                           href="/forgot-password"
// //                           className="text-[11px] transition-colors hover:opacity-80"
// //                           style={{ color: "#d4a017" }}
// //                         >
// //                           Forgot password?
// //                         </Link>
// //                       </div>
// //                       <FormControl>
// //                         <div className="relative">
// //                           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
// //                           <Input
// //                             type="password"
// //                             placeholder="••••••••"
// //                             autoComplete="current-password"
// //                             className="pl-9 h-9 text-[13px] text-white placeholder:text-white/25 focus-visible:ring-[#d4a017]"
// //                             style={{
// //                               background: "rgba(255,255,255,0.06)",
// //                               border: "1px solid rgba(255,255,255,0.12)",
// //                             }}
// //                             {...field}
// //                           />
// //                         </div>
// //                       </FormControl>
// //                       <FormMessage className="text-red-400 text-[11px]" />
// //                     </FormItem>
// //                   )}
// //                 />

// //                 {/* Remember me */}
// //                 <div className="flex items-center gap-2">
// //                   <Checkbox
// //                     id="popover-remember"
// //                     checked={rememberMe}
// //                     onCheckedChange={(checked) => setRememberMe(checked === true)}
// //                     className="border-white/20 data-[state=checked]:bg-[#d4a017] data-[state=checked]:border-[#d4a017] h-3.5 w-3.5"
// //                   />
// //                   <Label
// //                     htmlFor="popover-remember"
// //                     className="text-[12px] cursor-pointer"
// //                     style={{ color: "rgba(255,255,255,0.5)" }}
// //                   >
// //                     Remember me
// //                   </Label>
// //                 </div>

// //                 {/* Submit */}
// //                 <Button
// //                   type="submit"
// //                   disabled={isLoading}
// //                   className="w-full h-9 font-bold text-[13px] hover:opacity-90 transition-opacity"
// //                   style={{ background: "#d4a017", color: "#0d1b2e" }}
// //                 >
// //                   {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
// //                   Sign In
// //                 </Button>
// //               </form>
// //             </Form>
// //           </div>

// //           {/* Footer */}
// //           <div
// //             className="px-6 pb-4 pt-1 text-center border-t"
// //             style={{ borderColor: "rgba(255,255,255,0.06)" }}
// //           >
// //             <Link
// //               href="/login"
// //               className="text-[11.5px] transition-colors hover:opacity-80"
// //               style={{ color: "rgba(255,255,255,0.35)" }}
// //             >
// //               More login options
// //             </Link>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // }
