"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Loader2, User, X } from "lucide-react";
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

export function LoginPopover() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: { email: "", password: "" },
  });

  // Close on click outside
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

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
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-[13px] font-semibold text-foreground hover:text-[#d4a017] transition-colors cursor-pointer"
      >
        Sign in
      </button>

      {/* Floating Panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-6 right-6 z-[100] w-[380px] rounded-2xl overflow-hidden shadow-2xl
                     animate-in slide-in-from-bottom-4 fade-in duration-300"
          style={{
            background: "#0d1b2e",
            border: "1px solid rgba(212,160,23,0.25)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,160,23,0.1)",
          }}
        >
          {/* Header */}
          <div
            className="px-6 pt-5 pb-4 border-b flex items-center justify-between"
            style={{ borderColor: "rgba(212,160,23,0.15)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(212,160,23,0.15)", border: "1.5px solid rgba(212,160,23,0.4)" }}
              >
                <User size={18} style={{ color: "#d4a017" }} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Welcome Back</h3>
                <p className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Sign in to your account
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <div className="px-6 py-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
                          <Input
                            type="email"
                            placeholder="you@company.com"
                            autoComplete="email"
                            className="pl-9 h-9 text-[13px] text-white placeholder:text-white/25 focus-visible:ring-[#d4a017]"
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.12)",
                            }}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-[11px]" />
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
                        <FormLabel className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
                          Password
                        </FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-[11px] transition-colors hover:opacity-80"
                          style={{ color: "#d4a017" }}
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="pl-9 h-9 text-[13px] text-white placeholder:text-white/25 focus-visible:ring-[#d4a017]"
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.12)",
                            }}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-[11px]" />
                    </FormItem>
                  )}
                />

                {/* Remember me */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="popover-remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="border-white/20 data-[state=checked]:bg-[#d4a017] data-[state=checked]:border-[#d4a017] h-3.5 w-3.5"
                  />
                  <Label
                    htmlFor="popover-remember"
                    className="text-[12px] cursor-pointer"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Remember me
                  </Label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-9 font-bold text-[13px] hover:opacity-90 transition-opacity"
                  style={{ background: "#d4a017", color: "#0d1b2e" }}
                >
                  {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </Form>
          </div>

          {/* Footer */}
          <div
            className="px-6 pb-4 pt-1 text-center border-t"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <Link
              href="/login"
              className="text-[11.5px] transition-colors hover:opacity-80"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              More login options
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
