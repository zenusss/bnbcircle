import React from "react";
import { Lock, CheckCircle2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SecurityBadgeProps {
  /** full: 3 columns with icon + text; compact: 3 small inline icons */
  variant?: "full" | "compact";
  className?: string;
}

// ─── Badge items config ───────────────────────────────────────────────────────

const BADGES = [
  {
    icon: Lock,
    label: "Secure booking",
    detail: "End-to-end encrypted",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: CheckCircle2,
    label: "Verified host",
    detail: "Identity confirmed",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Shield,
    label: "Buyer protection",
    detail: "Full refund policy",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
] as const;

// ─── SecurityBadge ────────────────────────────────────────────────────────────

export function SecurityBadge({ variant = "full", className }: SecurityBadgeProps) {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100",
          className
        )}
        aria-label="Security badges"
      >
        {BADGES.map(({ icon: Icon, label, color }) => (
          <span
            key={label}
            title={label}
            className={cn("flex items-center gap-1 text-[11px] font-medium text-slate-500")}
          >
            <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", color)} aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </span>
        ))}
        <span className="text-[11px] text-slate-400 font-medium">Protected</span>
      </div>
    );
  }

  // Full variant — 3-column grid
  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-3",
        className
      )}
      aria-label="Trust & security badges"
    >
      {BADGES.map(({ icon: Icon, label, detail, color, bg }) => (
        <div
          key={label}
          className={cn(
            "flex flex-col items-center text-center gap-2 p-3 rounded-xl border border-slate-100",
            bg
          )}
        >
          <Icon className={cn("w-5 h-5 flex-shrink-0", color)} aria-hidden="true" />
          <div>
            <p className="text-xs font-semibold text-slate-700 leading-tight">{label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
