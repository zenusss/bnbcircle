import React from "react";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";
const CALS = [
  { id: "cal1", listing: "Canal House Amsterdam", name: "Airbnb", url: "https://airbnb.com/ical/...", status: "ok", lastSync: "2026-05-29 08:00", enabled: true },
  { id: "cal2", listing: "Modern Apartment", name: "Booking.com", url: "https://booking.com/ical/...", status: "error", lastSync: "2026-05-28 12:00", enabled: true },
  { id: "cal3", listing: "Zeeland Villa", name: "Airbnb", url: "https://airbnb.com/ical/...", status: "ok", lastSync: "2026-05-29 07:00", enabled: false },
];
const STATUS_ICON: Record<string, React.ReactElement> = {
  ok: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  error: <XCircle className="w-4 h-4 text-red-500" />,
  syncing: <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />,
};
export default function AdminCalendarSync() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Calendar Sync (All Properties)</h1>
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border"><tr>
              {["Listing", "Calendar", "URL", "Status", "Last sync", "Enabled", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase text-muted-foreground">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {CALS.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{c.listing}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{c.url}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-1.5">{STATUS_ICON[c.status]}<span className="text-xs">{c.status}</span></div></td>
                  <td className="px-4 py-3 text-muted-foreground">{c.lastSync}</td>
                  <td className="px-4 py-3"><span className={c.enabled ? "badge-green" : "status-draft"}>{c.enabled ? "enabled" : "disabled"}</span></td>
                  <td className="px-4 py-3"><button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><RefreshCw className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
