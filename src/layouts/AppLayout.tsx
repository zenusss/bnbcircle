import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home, Calendar, Heart, MessageSquare, User,
  ChevronLeft, Menu, X, Map, FileText
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/app", icon: <Home className="w-5 h-5" />, label: "Dashboard", exact: true },
  { to: "/app/trips", icon: <Calendar className="w-5 h-5" />, label: "My Trips" },
  { to: "/app/requests", icon: <FileText className="w-5 h-5" />, label: "Requests" },
  { to: "/app/favorites", icon: <Heart className="w-5 h-5" />, label: "Favorites" },
  { to: "/app/messages", icon: <MessageSquare className="w-5 h-5" />, label: "Messages" },
  { to: "/app/profile", icon: <User className="w-5 h-5" />, label: "Profile" },
];

export function AppLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <SiteHeader />

      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-60 fixed left-0 top-16 bottom-0 bg-white border-r border-border z-40">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Guest</h2>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn("sidebar-link", isActive && "active")}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <Link to="/search" className="sidebar-link">
              <Map className="w-5 h-5" />
              Find Properties
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-60">
          {/* Mobile top bar */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-border">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-muted">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-sm text-foreground">
              {NAV_ITEMS.find((n) => location.pathname.startsWith(n.to))?.label || "Dashboard"}
            </span>
            <div className="w-9" />
          </div>

          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-card-hover flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-bold text-primary">My Account</h2>
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
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={cn("sidebar-link", isActive && "active")}
                  >
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
