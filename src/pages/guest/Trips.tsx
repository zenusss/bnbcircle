import React, { useState } from "react";
import { MapPin, Calendar } from "lucide-react";
import { cn, formatEUR, BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from "@/lib/utils";

const DEMO_TRIPS = [
  { id: "b1", listing: "Canal House Amsterdam", city: "Amsterdam", checkIn: "2026-06-15", checkOut: "2026-06-19", nights: 4, total: 820, status: "confirmed", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200&h=120&fit=crop" },
  { id: "b2", listing: "Zeeland Beach Villa", city: "Middelburg", checkIn: "2026-07-10", checkOut: "2026-07-17", nights: 7, total: 3150, status: "pending", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&h=120&fit=crop" },
  { id: "b3", listing: "Cosy Utrecht House", city: "Utrecht", checkIn: "2026-04-01", checkOut: "2026-04-05", nights: 4, total: 820, status: "completed", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&h=120&fit=crop" },
];

const TABS = ["All", "Upcoming", "Past"];

export default function Trips() {
  const [tab, setTab] = useState("All");

  const filtered = DEMO_TRIPS.filter((t) => {
    if (tab === "Upcoming") return ["confirmed", "pending"].includes(t.status);
    if (tab === "Past") return ["completed", "cancelled"].includes(t.status);
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">My Trips</h1>

      <div className="flex gap-2 border-b border-border">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors", tab === t ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground")}>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card-base p-16 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-medium text-foreground mb-2">No trips here</p>
          <p className="text-sm text-muted-foreground">Start exploring properties to plan your next stay.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((t) => (
            <div key={t.id} className="card-base p-4 flex items-center gap-4">
              <img src={t.image} alt={t.listing} className="w-24 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground truncate">{t.listing}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <MapPin className="w-3 h-3" />{t.city}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t.checkIn} → {t.checkOut} · {t.nights} nights</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-primary text-sm">{formatEUR(t.total)}</p>
                <span className={cn(BOOKING_STATUS_COLORS[t.status], "mt-1")}>{BOOKING_STATUS_LABELS[t.status]}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
