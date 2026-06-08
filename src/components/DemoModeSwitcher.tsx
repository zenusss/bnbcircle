import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type DemoRole } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const ROLES: { role: DemoRole; label: string; emoji: string; color: string; path: string; desc: string }[] = [
  {
    role: "visitor",
    label: "Visitor",
    emoji: "👤",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    path: "/",
    desc: "Not logged in — public pages only",
  },
  {
    role: "guest",
    label: "Guest",
    emoji: "🧳",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    path: "/app",
    desc: "Logged in as a guest — trips, favorites, messages",
  },
  {
    role: "host",
    label: "Host",
    emoji: "🏠",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    path: "/host",
    desc: "Property owner — dashboard, calendar, bookings",
  },
  {
    role: "admin",
    label: "Admin",
    emoji: "🛡️",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    path: "/admin",
    desc: "Full access — all users, listings, settings",
  },
];

export function DemoModeSwitcher() {
  const { isDemo, demoRole, setDemoRole } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Vizibil DOAR când ești în modul Admin — guest/host nu văd switcher-ul
  if (!isDemo || demoRole !== "admin") return null;

  const current = ROLES.find(r => r.role === demoRole) ?? ROLES[0];

  const handleSwitch = (r: typeof ROLES[0]) => {
    setDemoRole(r.role);
    navigate(r.path);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2">
      {/* Expanded panel */}
      {open && (
        <div className="bg-white border border-border rounded-2xl shadow-2xl p-4 w-72 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Demo Mode — Switch Role</span>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground text-lg leading-none"
            >×</button>
          </div>

          <div className="space-y-2">
            {ROLES.map(r => (
              <button
                key={r.role}
                onClick={() => handleSwitch(r)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all hover:scale-[1.02]",
                  r.role === demoRole
                    ? cn(r.color, "border-current shadow-sm font-semibold")
                    : "bg-muted/30 border-border hover:bg-muted/50 text-foreground"
                )}
              >
                <span className="text-xl shrink-0">{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{r.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{r.desc}</p>
                </div>
                {r.role === demoRole && (
                  <span className="text-xs font-bold text-primary shrink-0">ACTIVE</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground text-center">
            Connect Supabase to use real auth
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-full border-2 shadow-xl font-semibold text-sm transition-all hover:scale-105 hover:shadow-2xl",
          current.color,
          "border-current"
        )}
        title="Demo Mode — click to switch role"
      >
        <span className="text-base">{current.emoji}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <span className="text-xs opacity-60">DEMO</span>
        <svg className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
