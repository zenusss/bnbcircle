import React from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO = [
  { id: "r1", listing: "Canal House Amsterdam", checkIn: "2026-07-01", checkOut: "2026-07-05", guests: 2, status: "pending", submitted: "2026-05-20" },
  { id: "r2", listing: "Zeeland Villa", checkIn: "2026-08-10", checkOut: "2026-08-17", guests: 6, status: "answered", submitted: "2026-05-15" },
];

const STATUS: Record<string, string> = {
  pending: "badge-yellow",
  answered: "badge-green",
  suggested: "badge-navy",
  declined: "badge-red",
  converted: "badge-green",
};

export default function GuestRequests() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">My Requests</h1>

      {DEMO.length === 0 ? (
        <div className="card-base p-16 text-center">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">No availability requests yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {DEMO.map((r) => (
            <div key={r.id} className="card-base p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground">{r.listing}</h3>
                <p className="text-xs text-muted-foreground">{r.checkIn} → {r.checkOut} · {r.guests} guests</p>
                <p className="text-xs text-muted-foreground">Submitted {r.submitted}</p>
              </div>
              <span className={STATUS[r.status]}>{r.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
