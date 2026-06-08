import React from "react";
import { formatEUR, cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, MessageSquare } from "lucide-react";

const DEMO = [
  { id: "b1", guest: "Emma van den Berg", listing: "Canal House Amsterdam", checkIn: "2026-06-01", checkOut: "2026-06-05", nights: 4, total: 780, status: "pending" },
  { id: "b2", guest: "Lars Petersen", listing: "Modern Apartment", checkIn: "2026-06-08", checkOut: "2026-06-10", nights: 2, total: 220, status: "confirmed" },
  { id: "b3", guest: "Sarah Johnson", listing: "Zeeland Villa", checkIn: "2026-06-15", checkOut: "2026-06-22", nights: 7, total: 3080, status: "confirmed" },
  { id: "b4", guest: "Jan Smit", listing: "Canal House Amsterdam", checkIn: "2026-05-10", checkOut: "2026-05-15", nights: 5, total: 975, status: "completed" },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "badge-yellow" },
  confirmed: { label: "Confirmed", cls: "badge-green" },
  confirmed_by_host: { label: "Awaiting guest", cls: "badge-yellow" },
  declined: { label: "Declined", cls: "badge-red" },
  cancelled: { label: "Cancelled", cls: "badge-red" },
  completed: { label: "Completed", cls: "badge-navy" },
};

export default function HostBookings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your incoming and past bookings</p>
      </div>

      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {["Guest", "Property", "Dates", "Nights", "Total", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DEMO.map((b) => {
                const s = STATUS_MAP[b.status];
                return (
                  <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{b.guest[0]}</div>
                        <span className="font-medium text-foreground">{b.guest}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.listing}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{b.checkIn} → {b.checkOut}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.nights}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{formatEUR(b.total)}</td>
                    <td className="px-4 py-3"><span className={s.cls}>{s.label}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {b.status === "pending" && (
                          <>
                            <button title="Confirm" className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                            <button title="Decline" className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                        <button title="Message" className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><MessageSquare className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
