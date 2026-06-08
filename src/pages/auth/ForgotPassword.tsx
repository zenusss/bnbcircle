import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Home,
  Mail,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Send,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

/* ─────────────────────────── schema ─────────────────────────── */

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

/* ──────────────────────────── page ──────────────────────────── */

export default function ForgotPassword() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) throw resetError;

      setSentEmail(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── success state ─── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="card-base p-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-[#E8743C]/10 flex items-center justify-center mx-auto mb-5">
              <Mail className="w-8 h-8 text-[#E8743C]" />
            </div>

            <h2 className="text-xl font-bold text-primary mb-2">
              Check your inbox
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              If an account exists for{" "}
              <span className="font-semibold text-foreground">{sentEmail}</span>
              , you'll receive a password reset link shortly.
            </p>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 text-left mb-8">
              <p className="font-semibold mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                What to do next
              </p>
              <ol className="list-decimal list-inside space-y-1 text-blue-600">
                <li>Open the email from Bnb Circle</li>
                <li>Click the reset link (valid for 60 minutes)</li>
                <li>Set your new password</li>
              </ol>
            </div>

            <div className="space-y-3">
              <Link
                to="/login"
                className="btn-primary w-full justify-center py-3 text-sm"
              >
                Back to Sign In
              </Link>
              <button
                onClick={() => {
                  setSuccess(false);
                  setError(null);
                }}
                className="btn-outline w-full justify-center py-3 text-sm"
              >
                Try a different email
              </button>
            </div>
          </div>

          {/* Spam tip */}
          <p className="text-center text-xs text-muted-foreground mt-5">
            Didn't receive it? Check your spam folder or{" "}
            <button
              onClick={() => {
                setSuccess(false);
                setError(null);
              }}
              className="text-[#E8743C] hover:underline font-medium"
            >
              try again
            </button>
            .
          </p>
        </div>
      </div>
    );
  }

  /* ─── main form ─── */
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-[#E8743C] flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-primary">Bnb Circle</span>
        </Link>

        {/* Card */}
        <div className="card-base p-8">
          {/* Header */}
          <div className="mb-7">
            <div className="w-12 h-12 rounded-xl bg-[#0B1F3A]/5 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-[#0B1F3A]" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-1.5">
              Forgot your password?
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              No worries! Enter the email associated with your account and we'll
              send you a link to reset your password.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email address
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="you@example.com"
                className={cn(
                  "input-base",
                  errors.email && "border-red-400 focus:ring-red-400/60"
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3.5 text-base"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send reset link
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
