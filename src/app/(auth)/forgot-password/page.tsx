"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

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

const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Must be a valid email address"),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email: data.email });
      setSubmitted(true);
    } catch (error: unknown) {
      // Still show success to prevent user enumeration
      setSubmitted(true);
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
            <KeyRound size={18} style={{ color: "#d4a017" }} />
          </div>
          <h1 className="text-xl font-bold text-white">Forgot Password</h1>
        </div>
        <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {/* Body */}
      <div className="px-8 py-6">
        {submitted ? (
          /* Success state */
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(212,160,23,0.12)", border: "1.5px solid rgba(212,160,23,0.35)" }}
            >
              <CheckCircle2 size={28} style={{ color: "#d4a017" }} />
            </div>
            <div>
              <p className="text-white font-semibold text-[15px]">Check your inbox</p>
              <p className="text-[13px] mt-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                If an account exists for{" "}
                <span style={{ color: "#d4a017" }}>{form.getValues("email")}</span>,
                a password reset link has been sent. It expires in 15 minutes.
              </p>
            </div>
            <Button
              variant="ghost"
              className="mt-1 text-[13px] hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.5)" }}
              onClick={() => {
                setSubmitted(false);
                form.reset();
              }}
            >
              Try a different email
            </Button>
          </div>
        ) : (
          /* Form state */
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-[13px] font-medium"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        />
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 font-bold text-[14px] hover:opacity-90 transition-opacity"
                style={{ background: "#d4a017", color: "#0d1b2e" }}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </form>
          </Form>
        )}
      </div>

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
          <ArrowLeft size={13} />
          Back to login
        </Link>
      </div>
    </div>
  );
}