import React from "react";
import { Link } from "react-router-dom";
import { Building2, BookOpen, Star, DollarSign, Plus, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { formatEUR } from "@/lib/utils";

const DEMO_STATS = [
  { label: "Active Properties", value: "3", icon: <Building2 className="w-6 h-6" />, color: "text-blue-600 bg-blue-50", change: "+1 this month" },
  { label: "Active Bookings", value: "8", icon: <BookOpen className="w-6 h-6" />, color: "text-emerald-600 bg-emerald-50", change: "+3 this week" },
  { label: "Total Revenue", value: "€4,280", icon: <DollarSign className="w-6 h-6" />, color: "text-accent bg-orange-50", change: "+€820 this month" },
  { label: "Average Rating", value: "4.8", icon: <Star className="w-6 h-6" />, color: "text-yellow-600 bg-yellow-50", change: "23 reviews total" },
];

const DEMO_BOOKINGS = [
  { id: "b1", guest: "Emma van den Berg", listing: "Canal House Amsterdam", checkIn: "2026-06-01", checkOut: "2026-06-05", total: 780, status: "confirmed" },
  { id: "b2", guest: "Lars Petersen", listing: "Modern Apartment", checkIn: "2026-06-08", checkOut: "2026-06-10", total: 220, status: "pending" },
  { id: "b3", guest: "Sarah Johnson", listing: "Zeeland Villa", checkIn: "2026-06-15", checkOut: "2026-06-22", total: 3080, status: "confirmed" },
];

const STATUS_STYLES: Record<string, string> = {
  confirmed: "badge-green",
  pending: "badge-yellow",
  cancelled: "badge-red",
  completed: "badge-navy",
};

export default function HostDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Host Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back — here's your hosting overview</p>
        </div>
        <Link to="/host/properties/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Add property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_STATS.map((stat) => (
          <div key={stat.label} className="card-base p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs font-medium text-foreground mt-0.5">{stat.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-primary">Recent Bookings</h2>
            <Link to="/host/bookings" className="text-sm text-accent font-semibold hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {DEMO_BOOKINGS.map((b) => (
              <div key={b.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  {b.guest[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{b.guest}</p>
                  <p className="text-xs text-muted-foreground truncate">{b.listing}</p>
                  <p className="text-xs text-muted-foreground">{b.checkIn} → {b.checkOut}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-sm text-primary">{formatEUR(b.total)}</p>
                  <span className={STATUS_STYLES[b.status]}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-base p-6">
          <h2 className="font-bold text-primary mb-5">Quick actions</h2>
          <div className="space-y-2">
            {[
              { to: "/host/bookings", icon: <Clock className="w-4 h-4" />, label: "Review pending bookings", count: 2, urgent: true },
              { to: "/host/reviews", icon: <Star className="w-4 h-4" />, label: "Respond to reviews", count: 1, urgent: false },
              { to: "/host/calendar", icon: <CheckCircle className="w-4 h-4" />, label: "Update availability", count: null, urgent: false },
              { to: "/host/calendar-sync", icon: <Building2 className="w-4 h-4" />, label: "Sync calendars", count: null, urgent: false },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.urgent ? "bg-red-50 text-red-600" : "bg-muted text-muted-foreground"}`}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-foreground flex-1 group-hover:text-accent transition-colors">{item.label}</span>
                {item.count && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
