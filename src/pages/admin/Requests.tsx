import React from "react";
import { FileText } from "lucide-react";
const REQS = [
  { id: "r1", guest: "Emma Johnson", email: "emma@example.com", listing: "Canal House Amsterdam", checkIn: "2026-07-01", checkOut: "2026-07-05", guests: 2, status: "pending", submitted: "2026-05-20" },
  { id: "r2", guest: "Lars Petersen", email: "lars@example.com", listing: "Zeeland Villa", checkIn: "2026-08-10", checkOut: "2026-08-17", guests: 6, status: "answered", submitted: "2026-05-15" },
  { id: "r3", guest: "Anonymous Guest", email: "guest123@example.com", listing: "Modern Apartment", checkIn: "2026-06-20", checkOut: "2026-06-25", guests: 2, status: "declined", submitted: "2026-05-10" },
];
const STATUS: Record<string,string> = { pending: "badge-yellow", answered: "badge-green", declined: "badge-red", suggested: "badge-navy", converted: "badge-green" };
export default function AdminRequests() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Availability Requests</h1>
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border"><tr>
              {["Guest", "Email", "Listing", "Dates", "Guests", "Status", "Submitted"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase text-muted-foreground">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {REQS.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{r.guest}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.listing}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.checkIn} → {r.checkOut}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.guests}</td>
                  <td className="px-4 py-3"><span className={STATUS[r.status]}>{r.status}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{r.submitted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
