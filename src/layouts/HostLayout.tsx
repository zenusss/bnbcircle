import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Building2, Calendar, CalendarCog,
  BookOpen, MessageSquare, Star, CreditCard, X, Menu, Home
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/host", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", exact: true },
  { to: "/host/properties", icon: <Building2 className="w-5 h-5" />, label: "Properties" },
  { to: "/host/bookings", icon: <BookOpen className="w-5 h-5" />, label: "Bookings" },
  { to: "/host/calendar", icon: <Calendar className="w-5 h-5" />, label: "Availability" },
  { to: "/host/calendar-sync", icon: <CalendarCog className="w-5 h-5" />, label: "Calendar Sync" },
  { to: "/host/messages", icon: <MessageSquare className="w-5 h-5" />, label: "Messages" },
  { to: "/host/reviews", icon: <Star className="w-5 h-5" />, label: "Reviews" },
  { to: "/host/payouts", icon: <CreditCard className="w-5 h-5" />, label: "Payouts" },
];

export function HostLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <SiteHeader />
      <div className="flex pt-16">
        <aside className="hidden md:flex flex-col w-60 fixed left-0 top-16 bottom-0 bg-white border-r border-border z-40">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-bold text-primary">Host Dashboard</h2>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);
              return (
                <Link key={item.to} to={item.to} className={cn("sidebar-link", isActive && "active")}>
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <Link to="/" className="sidebar-link">
              <Home className="w-5 h-5" />
              Back to site
            </Link>
          </div>
        </aside>

        <main className="flex-1 md:ml-60">
          <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-border">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-muted">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-sm">Host Dashboard</span>
            <div className="w-9" />
          </div>
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-card-hover flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-bold text-primary">Host Menu</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);
                return (
                  <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)} className={cn("sidebar-link", isActive && "active")}>
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
