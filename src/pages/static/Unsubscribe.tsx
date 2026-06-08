import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, MailX, Loader2, ArrowRight, Bell, BellOff } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = "loading" | "success" | "already" | "error" | "invalid";

// ─── Component ────────────────────────────────────────────────────────────────
export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>(token ? "loading" : "invalid");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const simulate = async () => {
      await new Promise((r) => setTimeout(r, 1800));
      if (token.startsWith("already")) {
        setEmail("guest@example.nl");
        setStatus("already");
      } else if (token.startsWith("bad") || token.length < 8) {
        setStatus("error");
      } else {
        setEmail("guest@example.nl");
        setStatus("success");
      }
    };

    simulate();
  }, [token]);

  return (
    <div className="pt-16 md:pt-20 min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {status === "loading" && <LoadingState />}
          {status === "success" && <SuccessState email={email} />}
          {status === "already" && <AlreadyState email={email} />}
          {status === "error" && <ErrorState />}
          {status === "invalid" && <InvalidState />}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="card-base p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-[#0B1F3A]/5 flex items-center justify-center mx-auto mb-6">
        <Loader2 className="w-8 h-8 text-[#0B1F3A] animate-spin" />
      </div>
      <h1 className="text-xl font-bold text-[#0B1F3A] mb-2">Processing your request…</h1>
      <p className="text-sm text-muted-foreground">
        We're updating your email preferences. This takes just a moment.
      </p>
    </div>
  );
}

function SuccessState({ email }: { email: string }) {
  return (
    <div className="card-base p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-emerald-600" />
      </div>
      <h1 className="text-2xl font-bold text-[#0B1F3A] mb-3">You've been unsubscribed</h1>
      {email && (
        <p className="text-sm font-medium text-muted-foreground mb-2">
          <span className="text-[#0B1F3A]">{email}</span> has been removed from our marketing list.
        </p>
      )}
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        You will no longer receive promotional emails from Bnb Circle. You may still receive
        transactional emails about your bookings, payments, and account security.
      </p>

      <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left">
        <h3 className="font-semibold text-[#0B1F3A] text-sm mb-2 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#E8743C]" />
          You'll still receive:
        </h3>
        <ul className="space-y-1.5">
          {[
            "Booking confirmations and receipts",
            "Check-in instructions from hosts",
            "Payout notifications (hosts only)",
            "Account security alerts",
          ].map((item) => (
            <li key={item} className="text-xs text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E8743C] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <Link to="/app/profile" className="btn-navy w-full justify-center">
          Manage All Notifications <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/" className="btn-ghost w-full justify-center text-sm">
          Back to Bnb Circle
        </Link>
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        Changed your mind?{" "}
        <Link to="/app/profile" className="text-[#E8743C] underline">
          Resubscribe to marketing emails
        </Link>
      </p>
    </div>
  );
}

function AlreadyState({ email }: { email: string }) {
  return (
    <div className="card-base p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
        <BellOff className="w-8 h-8 text-slate-500" />
      </div>
      <h1 className="text-2xl font-bold text-[#0B1F3A] mb-3">Already unsubscribed</h1>
      {email && (
        <p className="text-sm text-muted-foreground mb-6">
          <span className="font-medium text-[#0B1F3A]">{email}</span> is already removed from our
          marketing list.
        </p>
      )}
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        No action needed—you won't receive any promotional emails from us. You can manage all email
        preferences from your account settings.
      </p>
      <div className="space-y-3">
        <Link to="/app/profile" className="btn-navy w-full justify-center">
          Manage Notifications <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/" className="btn-ghost w-full justify-center text-sm">
          Back to Bnb Circle
        </Link>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="card-base p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
        <MailX className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-[#0B1F3A] mb-3">Something went wrong</h1>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        We couldn't process your unsubscribe request. The link may have expired or already been
        used. Please try again using the link in your most recent email, or contact support.
      </p>
      <div className="space-y-3">
        <Link to="/contact" className="btn-primary w-full justify-center">
          Contact Support <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/" className="btn-ghost w-full justify-center text-sm">
          Back to Bnb Circle
        </Link>
      </div>
    </div>
  );
}

function InvalidState() {
  return (
    <div className="card-base p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
        <MailX className="w-8 h-8 text-amber-500" />
      </div>
      <h1 className="text-2xl font-bold text-[#0B1F3A] mb-3">Invalid link</h1>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        This unsubscribe link is missing a required token. Please use the unsubscribe link from
        a Bnb Circle email, or manage your preferences directly from your account.
      </p>
      <div className="space-y-3">
        <Link to="/app/profile" className="btn-navy w-full justify-center">
          Manage Notifications <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/" className="btn-ghost w-full justify-center text-sm">
          Back to Bnb Circle
        </Link>
      </div>
    </div>
  );
}
