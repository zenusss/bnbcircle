import React from "react";
import { CreditCard, Clock } from "lucide-react";
import { formatEUR } from "@/lib/utils";

const DEMO_PAYOUTS = [
  { id: "p1", listing: "Canal House Amsterdam", dates: "May 1–5, 2026", amount: 740, status: "pending", date: "2026-06-05" },
  { id: "p2", listing: "Modern Apartment", dates: "Apr 20–22, 2026", amount: 190, status: "pending", date: "2026-05-22" },
];

export default function HostPayouts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Payouts</h1>
        <p className="text-sm text-muted-foreground mt-1">Your earnings and payout history</p>
      </div>

      <div className="card-base p-8 text-center border-2 border-dashed border-border">
        <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-5">
          <CreditCard className="w-10 h-10 text-muted-foreground/40" />
        </div>
        <h2 className="text-xl font-bold text-primary mb-3">Stripe payouts coming soon</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
          We're integrating Stripe Connect for seamless automatic payouts. Once enabled, you'll receive your earnings directly to your bank account within 2–5 business days after each completed stay.
        </p>
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Estimated launch: Q3 2026
        </div>
      </div>

      <div className="card-base overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-primary">Pending payouts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {["Property", "Stay dates", "Amount", "Expected date", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DEMO_PAYOUTS.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{p.listing}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.dates}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{formatEUR(p.amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.date}</td>
                  <td className="px-4 py-3"><span className="badge-yellow">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
