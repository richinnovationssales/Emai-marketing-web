"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Loader2, ShieldCheck, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import apiClient from "@/lib/api/client";
import { getErrorMessage } from "@/lib/utils/error-handler";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string({ required_error: "Password is required" })
      .min(8, "Must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string({ required_error: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Password strength indicator
function PasswordRules({ password }: { password: string }) {
  const rules = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One lowercase letter", ok: /[a-z]/.test(password) },
    { label: "One number", ok: /[0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <ul className="mt-2 space-y-1">
      {rules.map((rule) => (
        <li key={rule.label} className="flex items-center gap-1.5 text-[11.5px]">
          {rule.ok ? (
            <CheckCircle2 size={12} style={{ color: "#d4a017" }} />
          ) : (
            <XCircle size={12} style={{ color: "rgba(255,255,255,0.25)" }} />
          )}
          <span style={{ color: rule.ok ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)" }}>
            {rule.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const watchedPassword = form.watch("newPassword");

  // Invalid / missing token guard
  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 px-8 py-10 text-center">
        <XCircle size={40} style={{ color: "rgba(255,80,80,0.8)" }} />
        <div>
          <p className="text-white font-semibold text-[15px]">Invalid reset link</p>
          <p className="text-[13px] mt-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            This link is missing a token. Please request a new one.
          </p>
        </div>
        <Link href="/forgot-password">
          <Button
            className="mt-1 h-9 px-5 text-[13px] font-bold hover:opacity-90"
            style={{ background: "#d4a017", color: "#0d1b2e" }}
          >
            Request new link
          </Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    try {
      await apiClient.post("/auth/reset-password", {
        token,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      toast.success("Password reset!", { description: "You can now log in with your new password." });
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error("Reset failed", { description: message });

      // If token is invalid/expired, surface that clearly
      if (message.toLowerCase().includes("invalid") || message.toLowerCase().includes("expired")) {
        form.setError("root", {
          message: "This reset link is invalid or has expired. Please request a new one.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 px-8 py-10 text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: "rgba(212,160,23,0.12)", border: "1.5px solid rgba(212,160,23,0.35)" }}
        >
          <CheckCircle2 size={28} style={{ color: "#d4a017" }} />
        </div>
        <div>
          <p className="text-white font-semibold text-[15px]">Password updated!</p>
          <p className="text-[13px] mt-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
            Your password has been reset successfully. Please sign in with your new password.
          </p>
        </div>
        <Button
          onClick={() => router.push("/login")}
          className="mt-1 h-10 px-6 font-bold text-[14px] hover:opacity-90 transition-opacity"
          style={{ background: "#d4a017", color: "#0d1b2e" }}
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="px-8 py-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* Root error (expired token etc.) */}
          {form.formState.errors.root && (
            <div
              className="rounded-lg px-4 py-3 text-[12.5px] flex items-start gap-2"
              style={{ background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.25)", color: "rgba(255,150,150,0.9)" }}
            >
              <XCircle size={14} className="mt-0.5 shrink-0" />
              <span>{form.formState.errors.root.message}</span>
            </div>
          )}

          {/* New Password */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                  New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="pl-9 pr-9 h-10 text-sm text-white placeholder:text-white/25 focus-visible:ring-[#d4a017]"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      tabIndex={-1}
                    >
                      {showPassword
                        ? <EyeOff size={15} style={{ color: "rgba(255,255,255,0.3)" }} />
                        : <Eye size={15} style={{ color: "rgba(255,255,255,0.3)" }} />
                      }
                    </button>
                  </div>
                </FormControl>
                <PasswordRules password={watchedPassword} />
                <FormMessage className="text-red-400 text-[12px]" />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="pl-9 pr-9 h-10 text-sm text-white placeholder:text-white/25 focus-visible:ring-[#d4a017]"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      tabIndex={-1}
                    >
                      {showConfirm
                        ? <EyeOff size={15} style={{ color: "rgba(255,255,255,0.3)" }} />
                        : <Eye size={15} style={{ color: "rgba(255,255,255,0.3)" }} />
                      }
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-400 text-[12px]" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 font-bold text-[14px] hover:opacity-90 transition-opacity mt-1"
            style={{ background: "#d4a017", color: "#0d1b2e" }}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default function ResetPasswordPage() {
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
            <ShieldCheck size={18} style={{ color: "#d4a017" }} />
          </div>
          <h1 className="text-xl font-bold text-white">Reset Password</h1>
        </div>
        <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          Choose a new password for your account
        </p>
      </div>

      {/* Suspense needed for useSearchParams */}
      <Suspense
        fallback={
          <div className="flex justify-center py-10">
            <Loader2 className="h-7 w-7 animate-spin" style={{ color: "#d4a017" }} />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>

      {/* Footer */}
      <div
        className="px-8 pb-6 pt-2 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <Link
          href="/login"
          className="flex items-center justify-center gap-1.5 text-[12.5px] transition-colors hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          ← Back to login
        </Link>
      </div>
    </div>
  );
}