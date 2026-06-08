import React from "react";
import { formatEUR, cn, BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from "@/lib/utils";
const BOOKINGS = [
  { id: "b1", guest: "Emma van den Berg", host: "Sarah V.", listing: "Canal House Amsterdam", checkIn: "2026-06-01", checkOut: "2026-06-05", total: 780, status: "confirmed" },
  { id: "b2", guest: "Lars Petersen", host: "John D.", listing: "Modern Apartment", checkIn: "2026-06-08", checkOut: "2026-06-10", total: 220, status: "pending" },
  { id: "b3", guest: "Sarah Johnson", host: "Maria B.", listing: "Zeeland Villa", checkIn: "2026-06-15", checkOut: "2026-06-22", total: 3080, status: "confirmed" },
  { id: "b4", guest: "Jan Smit", host: "Sarah V.", listing: "Canal House Amsterdam", checkIn: "2026-05-10", checkOut: "2026-05-15", total: 975, status: "completed" },
];
export default function AdminBookings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Bookings</h1>
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border"><tr>
              {["Guest", "Host", "Listing", "Dates", "Total", "Status"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {BOOKINGS.map((b) => (
                <tr key={b.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{b.guest}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.host}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.listing}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{b.checkIn} → {b.checkOut}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{formatEUR(b.total)}</td>
                  <td className="px-4 py-3"><span className={cn(BOOKING_STATUS_COLORS[b.status])}>{BOOKING_STATUS_LABELS[b.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
