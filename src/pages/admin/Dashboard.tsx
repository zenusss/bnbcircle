import React from "react";
import { Users, Building2, BookOpen, DollarSign, Star, MessageSquare } from "lucide-react";
import { formatEUR } from "@/lib/utils";

const KPI_CARDS = [
  { label: "Total users", value: "1,284", icon: <Users className="w-6 h-6" />, change: "+48 this week", color: "text-blue-600 bg-blue-50" },
  { label: "Active listings", value: "312", icon: <Building2 className="w-6 h-6" />, change: "+12 this month", color: "text-emerald-600 bg-emerald-50" },
  { label: "Total bookings", value: "2,847", icon: <BookOpen className="w-6 h-6" />, change: "+134 this month", color: "text-purple-600 bg-purple-50" },
  { label: "Total revenue", value: "€284,320", icon: <DollarSign className="w-6 h-6" />, change: "+€24k this month", color: "text-accent bg-orange-50" },
  { label: "Pending reviews", value: "8", icon: <Star className="w-6 h-6" />, change: "Needs moderation", color: "text-yellow-600 bg-yellow-50" },
  { label: "Open conversations", value: "5", icon: <MessageSquare className="w-6 h-6" />, change: "2 escalated", color: "text-red-500 bg-red-50" },
];

const RECENT_BOOKINGS = [
  { id: "b1", guest: "Emma van den Berg", listing: "Canal House Amsterdam", amount: 780, status: "confirmed", date: "2026-05-29" },
  { id: "b2", guest: "Lars Petersen", listing: "Modern Apartment", amount: 220, status: "pending", date: "2026-05-28" },
  { id: "b3", guest: "Sarah Johnson", listing: "Zeeland Villa", amount: 3080, status: "confirmed", date: "2026-05-27" },
];

const STATUS_MAP: Record<string, string> = { confirmed: "badge-green", pending: "badge-yellow", cancelled: "badge-red", completed: "badge-navy" };

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform overview — Bnb Circle Netherlands</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {KPI_CARDS.map((kpi) => (
          <div key={kpi.label} className="card-base p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${kpi.color}`}>{kpi.icon}</div>
            <p className="text-xl font-bold text-primary">{kpi.value}</p>
            <p className="text-xs font-medium text-foreground mt-0.5">{kpi.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="card-base overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-primary">Recent bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>{["Guest", "Listing", "Amount", "Status", "Date"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {RECENT_BOOKINGS.map((b) => (
                <tr key={b.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{b.guest}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.listing}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{formatEUR(b.amount)}</td>
                  <td className="px-4 py-3"><span className={STATUS_MAP[b.status]}>{b.status}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{b.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
