/**
 * CalendarSync.tsx
 * iCal Calendar Sync management page for hosts.
 *
 * Sections:
 *  1. Platform quick-connect cards (Airbnb, Booking.com, VRBO, …)
 *  2. Imported (subscribed) calendars — table with live actions
 *  3. Export iCal URLs — one per property
 *  4. Sync log — collapsible recent-events list
 *  5. Info banner
 */

import React, { useState, useCallback } from "react";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Copy,
  Download,
  ExternalLink,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type SyncStatus = "ok" | "error" | "syncing" | "disabled";

interface ImportedCalendar {
  id: string;
  platformId: string;
  platformName: string;
  platformColor: string;
  url: string;
  status: SyncStatus;
  lastSync: string | null;
  nextSync: string;
  eventsImported: number;
  enabled: boolean;
}

interface ExportProperty {
  id: string;
  name: string;
  icalUrl: string;
}

interface SyncLogEntry {
  id: string;
  timestamp: string;
  platform: string;
  eventsAdded: number;
  eventsRemoved: number;
  status: "success" | "error" | "warning";
}

// ─── Static data ──────────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: "airbnb",      name: "Airbnb",        color: "#FF5A5F" },
  { id: "booking",     name: "Booking.com",   color: "#003580" },
  { id: "vrbo",        name: "VRBO",          color: "#3D8B37" },
  { id: "homeaway",    name: "HomeAway",      color: "#F77D00" },
  { id: "tripadvisor", name: "TripAdvisor",   color: "#34E0A1" },
  { id: "expedia",     name: "Expedia",       color: "#FFC72C" },
] as const;

type PlatformId = (typeof PLATFORMS)[number]["id"];

const INITIAL_IMPORTS: ImportedCalendar[] = [
  {
    id: "imp-1",
    platformId: "airbnb",
    platformName: "Airbnb",
    platformColor: "#FF5A5F",
    url: "https://www.airbnb.com/calendar/ical/9187234.ics?s=b3b3b3b3token",
    status: "ok",
    lastSync: "2026-05-29 08:02",
    nextSync: "2026-05-29 08:32",
    eventsImported: 14,
    enabled: true,
  },
  {
    id: "imp-2",
    platformId: "booking",
    platformName: "Booking.com",
    platformColor: "#003580",
    url: "https://ical.booking.com/v1/export?t=5f9f1b2a-property",
    status: "error",
    lastSync: "2026-05-28 22:00",
    nextSync: "2026-05-29 08:32",
    eventsImported: 0,
    enabled: true,
  },
  {
    id: "imp-3",
    platformId: "vrbo",
    platformName: "VRBO",
    platformColor: "#3D8B37",
    url: "https://www.vrbo.com/icalendar/yourproperty.ics",
    status: "disabled",
    lastSync: "2026-05-27 10:00",
    nextSync: "—",
    eventsImported: 6,
    enabled: false,
  },
];

const EXPORT_PROPERTIES: ExportProperty[] = [
  {
    id: "lst-a1b2",
    name: "Sunset Villa — Algarve",
    icalUrl: "https://bnb-circle.com/api/ical/lst-a1b2.ics",
  },
  {
    id: "lst-c3d4",
    name: "Cosy Studio — Lisbon Centre",
    icalUrl: "https://bnb-circle.com/api/ical/lst-c3d4.ics",
  },
];

const SYNC_LOG: SyncLogEntry[] = [
  { id: "log-10", timestamp: "2026-05-29 08:02", platform: "Airbnb",      eventsAdded: 2, eventsRemoved: 0, status: "success" },
  { id: "log-9",  timestamp: "2026-05-29 07:32", platform: "Airbnb",      eventsAdded: 0, eventsRemoved: 0, status: "success" },
  { id: "log-8",  timestamp: "2026-05-29 07:02", platform: "Airbnb",      eventsAdded: 1, eventsRemoved: 0, status: "success" },
  { id: "log-7",  timestamp: "2026-05-29 06:32", platform: "VRBO",         eventsAdded: 0, eventsRemoved: 1, status: "success" },
  { id: "log-6",  timestamp: "2026-05-29 06:02", platform: "Airbnb",      eventsAdded: 0, eventsRemoved: 0, status: "success" },
  { id: "log-5",  timestamp: "2026-05-28 22:00", platform: "Booking.com", eventsAdded: 0, eventsRemoved: 0, status: "error"   },
  { id: "log-4",  timestamp: "2026-05-28 21:30", platform: "Booking.com", eventsAdded: 0, eventsRemoved: 0, status: "error"   },
  { id: "log-3",  timestamp: "2026-05-28 20:00", platform: "VRBO",         eventsAdded: 3, eventsRemoved: 0, status: "success" },
  { id: "log-2",  timestamp: "2026-05-28 18:00", platform: "Airbnb",      eventsAdded: 0, eventsRemoved: 2, status: "warning" },
  { id: "log-1",  timestamp: "2026-05-28 17:30", platform: "Airbnb",      eventsAdded: 4, eventsRemoved: 0, status: "success" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Coloured square logo for platforms (replaces real images) */
function PlatformLogo({
  color,
  name,
  size = 32,
}: {
  color: string;
  name: string;
  size?: number;
}) {
  return (
    <span
      style={{ width: size, height: size, backgroundColor: color, flexShrink: 0 }}
      className="rounded-lg flex items-center justify-center text-white font-bold text-xs select-none"
      aria-label={name}
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

/** Status badge with icon */
function StatusBadge({ status }: { status: SyncStatus }) {
  const map: Record<SyncStatus, { icon: React.ReactNode; label: string; cls: string }> = {
    ok:       { icon: <CheckCircle className="w-3.5 h-3.5" />, label: "Synced",   cls: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    error:    { icon: <XCircle     className="w-3.5 h-3.5" />, label: "Error",    cls: "text-red-600    bg-red-50    border-red-200"    },
    syncing:  { icon: <RefreshCw   className="w-3.5 h-3.5 animate-spin" />, label: "Syncing", cls: "text-blue-600  bg-blue-50  border-blue-200"  },
    disabled: { icon: <Clock       className="w-3.5 h-3.5" />, label: "Disabled", cls: "text-slate-500  bg-slate-50  border-slate-200" },
  };
  const { icon, label, cls } = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border", cls)}>
      {icon}
      {label}
    </span>
  );
}

/** Truncated URL with native title tooltip */
function TruncatedUrl({ url }: { url: string }) {
  const display = url.length > 48 ? url.slice(0, 45) + "…" : url;
  return (
    <span
      title={url}
      className="font-mono text-xs text-slate-500 cursor-help select-all"
    >
      {display}
    </span>
  );
}

/** Copy-to-clipboard button with transient feedback */
function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all duration-150",
        copied
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300",
        className
      )}
      aria-label="Copy URL"
    >
      {copied ? (
        <>
          <CheckCircle className="w-3.5 h-3.5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

/** Modal dialog for entering an iCal URL for a platform */
function ConnectModal({
  platform,
  onClose,
  onAdd,
}: {
  platform: { id: string; name: string; color: string };
  onClose: () => void;
  onAdd: (url: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter an iCal URL.");
      return;
    }
    if (!url.startsWith("http")) {
      setError("URL must start with http:// or https://");
      return;
    }
    onAdd(url.trim());
    onClose();
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card-base w-full max-w-md p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlatformLogo color={platform.color} name={platform.name} size={36} />
            <div>
              <h2 className="font-bold text-primary text-base">Connect {platform.name}</h2>
              <p className="text-xs text-slate-500">Paste your {platform.name} iCal export URL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* How to find the URL hint */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
          <span>
            In your {platform.name} host dashboard, go to{" "}
            <strong>Calendar → Export</strong> and copy the iCal link. It usually
            ends in <code className="bg-amber-100 px-1 rounded">.ics</code>.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700">
              iCal URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              placeholder={`https://${platform.id === "airbnb" ? "www.airbnb.com/calendar/ical/..." : "..."}`}
              className={cn(
                "input-base font-mono text-xs",
                error && "border-red-400 focus:ring-red-300"
              )}
              autoFocus
            />
            {error && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button type="submit" className="btn-primary flex-1">
              <Plus className="w-4 h-4" />
              Add Calendar
            </button>
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Sync Settings Panel ──────────────────────────────────────────────────────
type FrequencyKey = "15min" | "30min" | "1h" | "2h" | "4h" | "12h" | "24h";
type ConflictPolicy = "bnbcircle_wins" | "external_wins" | "manual";

const FREQ_OPTIONS: { value: FrequencyKey; label: string; desc: string }[] = [
  { value: "15min",  label: "Every 15 min",   desc: "Best for high-demand properties" },
  { value: "30min",  label: "Every 30 min",   desc: "Recommended" },
  { value: "1h",     label: "Every hour",     desc: "Good balance" },
  { value: "2h",     label: "Every 2 hours",  desc: "" },
  { value: "4h",     label: "Every 4 hours",  desc: "" },
  { value: "12h",    label: "Every 12 hours", desc: "" },
  { value: "24h",    label: "Once a day",     desc: "Low-traffic properties" },
];

const CONFLICT_OPTIONS: { value: ConflictPolicy; label: string; desc: string; color: string }[] = [
  { value: "bnbcircle_wins", label: "BnbCircle booking wins", desc: "BnbCircle bookings are always kept. Conflicting external blocks are rejected.", color: "blue" },
  { value: "external_wins",  label: "External platform wins", desc: "External blocks take priority. BnbCircle bookings may be flagged for review.", color: "amber" },
  { value: "manual",         label: "Flag for manual review", desc: "Both bookings are paused and you're notified to resolve the conflict manually.", color: "purple" },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none",
        checked ? "bg-primary" : "bg-slate-200",
      )}
    >
      <span className={cn(
        "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
        checked ? "translate-x-5" : "translate-x-1",
      )} />
    </button>
  );
}

function SyncSettingsPanel() {
  const [frequency, setFrequency]       = useState<FrequencyKey>("30min");
  const [conflict, setConflict]         = useState<ConflictPolicy>("bnbcircle_wins");
  const [emailNotify, setEmailNotify]   = useState(true);
  const [pushNotify, setPushNotify]     = useState(false);
  const [notifyThreshold, setNotifyThreshold] = useState(3); // consecutive failures
  const [autoRetry, setAutoRetry]       = useState(true);
  const [retryCount, setRetryCount]     = useState(3);
  const [syncingAll, setSyncingAll]     = useState(false);
  const [saved, setSaved]               = useState(false);

  const handleSaveAll = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSyncAll = () => {
    setSyncingAll(true);
    setTimeout(() => setSyncingAll(false), 2500);
  };

  return (
    <div className="card-base p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-primary flex items-center gap-2 text-base">
            <RefreshCw className="w-4 h-4 text-accent" />
            Sync Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure how and when your calendars are synchronized.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncAll}
            disabled={syncingAll}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all",
              syncingAll
                ? "border-blue-200 bg-blue-50 text-blue-400 cursor-not-allowed"
                : "border-slate-200 text-slate-700 hover:border-primary hover:text-primary",
            )}
          >
            <RefreshCw className={cn("w-4 h-4", syncingAll && "animate-spin")} />
            {syncingAll ? "Syncing…" : "Sync all now"}
          </button>
          <button
            onClick={handleSaveAll}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              saved
                ? "bg-emerald-500 text-white"
                : "bg-primary text-white hover:bg-primary/90",
            )}
          >
            {saved ? (
              <><CheckCircle className="w-4 h-4" /> Saved!</>
            ) : (
              <>Save settings</>
            )}
          </button>
        </div>
      </div>

      {/* ── 1. Sync Frequency ── */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          Sync Frequency
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {FREQ_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFrequency(opt.value)}
              className={cn(
                "relative flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 text-xs font-semibold transition-all",
                frequency === opt.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white",
              )}
            >
              {opt.value === "30min" && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold leading-none">
                  REC
                </span>
              )}
              {opt.label}
              {opt.desc && <span className="text-[10px] font-normal text-slate-400 text-center leading-tight">{opt.desc}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* ── 2. Conflict Resolution ── */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-slate-400" />
          Conflict Resolution
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          What happens when two platforms book the same dates simultaneously?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CONFLICT_OPTIONS.map(opt => {
            const active = conflict === opt.value;
            const colorMap: Record<string, string> = {
              blue:   "border-blue-500 bg-blue-50",
              amber:  "border-amber-500 bg-amber-50",
              purple: "border-purple-500 bg-purple-50",
            };
            const dotMap: Record<string, string> = {
              blue: "bg-blue-500", amber: "bg-amber-500", purple: "bg-purple-500",
            };
            return (
              <button
                key={opt.value}
                onClick={() => setConflict(opt.value)}
                className={cn(
                  "text-left p-4 rounded-xl border-2 transition-all",
                  active ? colorMap[opt.color] : "border-slate-200 bg-white hover:border-slate-300",
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn(
                    "w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all",
                    active ? `${dotMap[opt.color]} border-transparent` : "border-slate-300 bg-white",
                  )}>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span className={cn("text-xs font-bold", active ? "text-slate-800" : "text-slate-600")}>
                    {opt.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* ── 3. Notifications ── */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-slate-400" />
          Failure Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Email alerts</p>
              <p className="text-xs text-slate-500">Receive email when sync fails repeatedly</p>
            </div>
            <Toggle checked={emailNotify} onChange={setEmailNotify} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Push notifications</p>
              <p className="text-xs text-slate-500">Browser push for critical sync failures</p>
            </div>
            <Toggle checked={pushNotify} onChange={setPushNotify} />
          </div>
          {emailNotify && (
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-600 flex-1">Alert after</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setNotifyThreshold(t => Math.max(1, t - 1))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-600 font-bold text-sm">−</button>
                <span className="w-8 text-center text-sm font-semibold text-slate-800">{notifyThreshold}</span>
                <button onClick={() => setNotifyThreshold(t => Math.min(10, t + 1))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-600 font-bold text-sm">+</button>
                <span className="text-xs text-slate-500">consecutive failures</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* ── 4. Auto-Retry ── */}
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-slate-400" />
          Auto-Retry on Failure
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Retry automatically</p>
              <p className="text-xs text-slate-500">Re-attempt sync after a short delay if it fails</p>
            </div>
            <Toggle checked={autoRetry} onChange={setAutoRetry} />
          </div>
          {autoRetry && (
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-600 flex-1">Maximum retries</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setRetryCount(t => Math.max(1, t - 1))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-600 font-bold text-sm">−</button>
                <span className="w-6 text-center text-sm font-semibold text-slate-800">{retryCount}</span>
                <button onClick={() => setRetryCount(t => Math.min(10, t + 1))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-600 font-bold text-sm">+</button>
                <span className="text-xs text-slate-500">attempts (5 min apart)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HostCalendarSync() {
  // ── State ────────────────────────────────────────────────────────────────
  const [imports, setImports] = useState<ImportedCalendar[]>(INITIAL_IMPORTS);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());
  const [connectingPlatform, setConnectingPlatform] = useState<
    (typeof PLATFORMS)[number] | null
  >(null);
  const [logOpen, setLogOpen] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────

  /** Trigger a "Sync now" for a specific imported calendar */
  const handleSyncNow = useCallback((id: string) => {
    setSyncingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setSyncingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setImports((prev) =>
        prev.map((cal) =>
          cal.id === id
            ? {
                ...cal,
                status: "ok",
                lastSync: new Date().toLocaleString("sv-SE").slice(0, 16),
              }
            : cal
        )
      );
    }, 2000);
  }, []);

  /** Toggle enabled/disabled for a calendar */
  const handleToggle = useCallback((id: string) => {
    setImports((prev) =>
      prev.map((cal) =>
        cal.id === id
          ? {
              ...cal,
              enabled: !cal.enabled,
              status: !cal.enabled ? "ok" : "disabled",
              nextSync: !cal.enabled ? "In ~30 min" : "—",
            }
          : cal
      )
    );
  }, []);

  /** Delete an imported calendar */
  const handleDelete = useCallback((id: string) => {
    setImports((prev) => prev.filter((cal) => cal.id !== id));
  }, []);

  /** Add a new imported calendar from the modal */
  const handleAddCalendar = useCallback(
    (platform: (typeof PLATFORMS)[number], url: string) => {
      const newCal: ImportedCalendar = {
        id: `imp-${Date.now()}`,
        platformId: platform.id,
        platformName: platform.name,
        platformColor: platform.color,
        url,
        status: "syncing",
        lastSync: null,
        nextSync: "In ~30 min",
        eventsImported: 0,
        enabled: true,
      };
      setImports((prev) => [...prev, newCal]);
      // Simulate initial sync completing
      setTimeout(() => {
        setImports((prev) =>
          prev.map((c) =>
            c.id === newCal.id
              ? {
                  ...c,
                  status: "ok",
                  lastSync: new Date().toLocaleString("sv-SE").slice(0, 16),
                  eventsImported: Math.floor(Math.random() * 10) + 1,
                }
              : c
          )
        );
      }, 2500);
    },
    []
  );

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Calendar className="w-6 h-6 text-accent" />
          iCal Calendar Sync
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Connect external platforms to keep your availability automatically up to
          date across every channel.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — Platform Quick-Connect                                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="card-base p-6">
        <h2 className="font-bold text-primary mb-1 flex items-center gap-2 text-base">
          <ExternalLink className="w-4 h-4 text-accent" />
          Quick Connect a Platform
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Click a platform to add its iCal feed in seconds.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PLATFORMS.map((platform) => {
            const alreadyConnected = imports.some(
              (cal) => cal.platformId === platform.id
            );
            return (
              <div
                key={platform.id}
                className={cn(
                  "card-base border p-4 flex flex-col items-center gap-3 transition-all",
                  alreadyConnected
                    ? "opacity-60 bg-slate-50"
                    : "card-hover cursor-pointer hover:shadow-md"
                )}
              >
                <PlatformLogo color={platform.color} name={platform.name} size={44} />
                <span className="text-xs font-semibold text-slate-700 text-center leading-tight">
                  {platform.name}
                </span>
                {alreadyConnected ? (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Connected
                  </span>
                ) : (
                  <button
                    onClick={() => setConnectingPlatform(platform)}
                    className="btn-primary text-[11px] px-3 py-1 gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Connect
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2 — Imported Calendars Table                              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="card-base overflow-hidden">
        {/* Table header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-primary flex items-center gap-2 text-base">
              <Download className="w-4 h-4 text-accent" />
              Imported Calendars
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Calendars you subscribe to from other platforms.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {imports.length} calendar{imports.length !== 1 ? "s" : ""}
          </span>
        </div>

        {imports.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">No imported calendars yet</p>
            <p className="text-slate-400 text-xs mt-1">
              Use Quick Connect above to add your first platform.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Platform</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">iCal URL</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Sync</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Next Sync</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">Events</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {imports.map((cal) => {
                  const isSyncing = syncingIds.has(cal.id);
                  const effectiveStatus: SyncStatus = isSyncing
                    ? "syncing"
                    : cal.enabled
                    ? cal.status
                    : "disabled";

                  return (
                    <tr
                      key={cal.id}
                      className={cn(
                        "hover:bg-slate-50/70 transition-colors",
                        !cal.enabled && "opacity-60"
                      )}
                    >
                      {/* Platform */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <PlatformLogo
                            color={cal.platformColor}
                            name={cal.platformName}
                            size={26}
                          />
                          <span className="font-medium text-slate-700 text-xs whitespace-nowrap">
                            {cal.platformName}
                          </span>
                        </div>
                      </td>

                      {/* URL */}
                      <td className="px-4 py-3 max-w-[220px]">
                        <TruncatedUrl url={cal.url} />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={effectiveStatus} />
                      </td>

                      {/* Last sync */}
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {cal.lastSync ?? "Never"}
                      </td>

                      {/* Next sync */}
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {cal.enabled ? cal.nextSync : "—"}
                      </td>

                      {/* Events count */}
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                          {cal.eventsImported}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          {/* Sync now */}
                          <button
                            onClick={() => handleSyncNow(cal.id)}
                            disabled={isSyncing || !cal.enabled}
                            title="Sync now"
                            className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              isSyncing || !cal.enabled
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                            )}
                          >
                            <RefreshCw
                              className={cn("w-4 h-4", isSyncing && "animate-spin")}
                            />
                          </button>

                          {/* Enable / Disable */}
                          <button
                            onClick={() => handleToggle(cal.id)}
                            title={cal.enabled ? "Disable" : "Enable"}
                            className={cn(
                              "p-1.5 rounded-lg text-xs font-medium transition-colors",
                              cal.enabled
                                ? "text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                                : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            )}
                          >
                            {cal.enabled ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(cal.id)}
                            title="Delete calendar"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3 — Export iCal URLs                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="card-base p-6">
        <h2 className="font-bold text-primary mb-1 flex items-center gap-2 text-base">
          <Download className="w-4 h-4 text-accent" />
          Export Your Calendars
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Copy these URLs into Airbnb, Booking.com, or any platform to let them
          subscribe to your availability.
        </p>

        <div className="space-y-3">
          {EXPORT_PROPERTIES.map((prop) => (
            <div
              key={prop.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
            >
              {/* Property info */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {prop.name}
                  </p>
                  <code className="text-[11px] text-slate-500 font-mono break-all leading-tight">
                    {prop.icalUrl}
                  </code>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <CopyButton text={prop.icalUrl} />
                <a
                  href={prop.icalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 4.5 — Sync Settings                                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <SyncSettingsPanel />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 5 — Sync Log (collapsible)                                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="card-base overflow-hidden">
        {/* Collapsible header */}
        <button
          onClick={() => setLogOpen((o) => !o)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <span className="font-bold text-primary text-base">Sync Log</span>
            <span className="text-xs text-slate-400 font-normal ml-1">
              Last 10 events
            </span>
          </div>
          {logOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {logOpen && (
          <div className="border-t border-slate-100 overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Timestamp</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Platform</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide text-center">Added</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide text-center">Removed</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {SYNC_LOG.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-500">
                      {entry.timestamp}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-medium text-slate-700">
                      {entry.platform}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {entry.eventsAdded > 0 ? (
                        <span className="text-xs font-semibold text-emerald-600">
                          +{entry.eventsAdded}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {entry.eventsRemoved > 0 ? (
                        <span className="text-xs font-semibold text-red-500">
                          -{entry.eventsRemoved}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {entry.status === "success" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <CheckCircle className="w-3 h-3" /> OK
                        </span>
                      )}
                      {entry.status === "error" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                          <XCircle className="w-3 h-3" /> Failed
                        </span>
                      )}
                      {entry.status === "warning" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                          <AlertTriangle className="w-3 h-3" /> Warning
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 5 — Info Banner                                           */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <RefreshCw className="w-4 h-4 text-white" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-blue-900">30-minute auto-sync</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Bnb Circle polls every linked iCal feed every{" "}
            <strong>30 minutes</strong>. Blocking dates on Airbnb, Booking.com, or
            any connected platform will automatically mark those dates{" "}
            <strong>unavailable</strong> here, preventing double bookings.
            Likewise, bookings confirmed on Bnb Circle are exported in real-time
            via your per-property iCal URL so other platforms stay in sync.
          </p>
        </div>
      </div>

      {/* ── Connect Modal ──────────────────────────────────────────────── */}
      {connectingPlatform && (
        <ConnectModal
          platform={connectingPlatform}
          onClose={() => setConnectingPlatform(null)}
          onAdd={(url) => {
            handleAddCalendar(connectingPlatform, url);
            setConnectingPlatform(null);
          }}
        />
      )}
    </div>
  );
}
