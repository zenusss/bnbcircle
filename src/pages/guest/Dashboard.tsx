import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Heart, MessageSquare, FileText, ArrowRight, MapPin } from "lucide-react";
import { formatEUR } from "@/lib/utils";

const UPCOMING_BOOKINGS = [
  { id: "b1", listing: "Canal House Amsterdam", city: "Amsterdam", checkIn: "2026-06-15", checkOut: "2026-06-19", total: 820, status: "confirmed", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200&h=120&fit=crop" },
];

export default function GuestDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your trips</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Upcoming trips", value: "1", icon: <Calendar className="w-5 h-5" />, to: "/app/trips", color: "text-blue-600 bg-blue-50" },
          { label: "Pending requests", value: "2", icon: <FileText className="w-5 h-5" />, to: "/app/requests", color: "text-yellow-600 bg-yellow-50" },
          { label: "Saved properties", value: "5", icon: <Heart className="w-5 h-5" />, to: "/app/favorites", color: "text-red-500 bg-red-50" },
          { label: "Unread messages", value: "3", icon: <MessageSquare className="w-5 h-5" />, to: "/app/messages", color: "text-accent bg-orange-50" },
        ].map((s) => (
          <Link key={s.label} to={s.to} className="card-hover p-5 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming trip */}
      <div className="card-base p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-primary">Upcoming trip</h2>
          <Link to="/app/trips" className="text-sm text-accent font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            All trips <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {UPCOMING_BOOKINGS.map((b) => (
          <div key={b.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
            <img src={b.image} alt={b.listing} className="w-20 h-14 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate">{b.listing}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3 h-3" />{b.city}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{b.checkIn} → {b.checkOut}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-primary text-sm">{formatEUR(b.total)}</p>
              <span className="badge-green text-xs">{b.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card-base p-6">
        <h2 className="font-bold text-primary mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/search" className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-accent/5 hover:text-accent transition-all group">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium">Find a property</span>
          </Link>
          <Link to="/app/messages" className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-accent/5 hover:text-accent transition-all">
            <MessageSquare className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium">View messages</span>
          </Link>
          <Link to="/app/favorites" className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-accent/5 hover:text-accent transition-all">
            <Heart className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium">Saved properties</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
