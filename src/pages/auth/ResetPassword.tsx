import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Home,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

/* ─────────────────────────── schema ─────────────────────────── */

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirm_password: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

/* ─────────────────────── password strength ──────────────────── */

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
  textColor: string;
} {
  if (!password)
    return { score: 0, label: "", color: "", textColor: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1)
    return { score, label: "Weak", color: "bg-red-500", textColor: "text-red-500" };
  if (score <= 2)
    return { score, label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-600" };
  if (score <= 3)
    return { score, label: "Good", color: "bg-blue-500", textColor: "text-blue-600" };
  return { score, label: "Strong", color: "bg-green-500", textColor: "text-green-600" };
}

/* ─────────────────── password requirements list ─────────────── */

function PasswordRequirements({ password }: { password: string }) {
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
  ];

  return (
    <ul className="mt-2 space-y-1">
      {requirements.map(({ label, met }) => (
        <li
          key={label}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors",
            met ? "text-green-600" : "text-muted-foreground"
          )}
        >
          <CheckCircle2
            className={cn(
              "w-3.5 h-3.5 flex-shrink-0 transition-colors",
              met ? "text-green-500" : "text-gray-300"
            )}
          />
          {label}
        </li>
      ))}
    </ul>
  );
}

/* ──────────────────────────── page ──────────────────────────── */

export default function ResetPassword() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(false);

  /* Supabase sets a session from the URL hash fragment automatically
     when detectSessionInUrl: true is set in the client. We wait for
     the auth state to settle before rendering the form. */
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setSessionReady(true);
      } else if (event === "SIGNED_IN" && session) {
        // Sometimes fires instead of PASSWORD_RECOVERY
        setSessionReady(true);
      }
    });

    // Also check if there's already an active session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSessionReady(true);
      } else {
        // Give the hash-based flow 2 s to settle
        const timeout = setTimeout(() => {
          supabase.auth.getSession().then(({ data: d }) => {
            if (!d.session) setSessionError(true);
          });
        }, 2000);
        return () => clearTimeout(timeout);
      }
    });
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const passwordValue = watch("password") || "";
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: FormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      // Redirect to login after 3 s
      setTimeout(() => navigate("/login", { replace: true }), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── success screen ─── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Password updated!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your password has been changed successfully. You'll be redirected to
            the sign-in page in a moment.
          </p>
          <Link
            to="/login"
            replace
            className="btn-primary inline-flex justify-center py-3 px-8"
          >
            Sign in now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  /* ─── session error / expired link ─── */
  if (sessionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          <div className="card-base p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">
              Link expired or invalid
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              This password reset link is no longer valid. Reset links expire
              after 60 minutes. Please request a new one.
            </p>
            <Link
              to="/forgot-password"
              className="btn-primary w-full justify-center py-3"
            >
              Request new reset link
            </Link>
            <Link
              to="/login"
              className="btn-outline w-full justify-center py-3 mt-3"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ─── loading / waiting for session ─── */
  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <div className="w-8 h-8 rounded-full border-2 border-[#E8743C] border-t-transparent animate-spin" />
          <p className="text-sm">Verifying your reset link…</p>
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
              <KeyRound className="w-6 h-6 text-[#0B1F3A]" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-1.5">
              Set new password
            </h1>
            <p className="text-muted-foreground text-sm">
              Choose a strong password you haven't used before.
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
            {/* New password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  autoFocus
                  placeholder="Min. 8 characters"
                  className={cn(
                    "input-base pr-11",
                    errors.password && "border-red-400 focus:ring-red-400/60"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Strength bar */}
              {passwordValue && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-all duration-300",
                          i <= strength.score ? strength.color : "bg-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Strength:{" "}
                    <span className={cn("font-medium", strength.textColor)}>
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}

              {/* Requirements checklist */}
              {passwordValue && (
                <PasswordRequirements password={passwordValue} />
              )}

              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  {...register("confirm_password")}
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  className={cn(
                    "input-base pr-11",
                    errors.confirm_password &&
                      "border-red-400 focus:ring-red-400/60"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3.5 text-base mt-1"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Update password
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-[#E8743C] font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
