import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Building2, Users, BookOpen, MessageSquare,
  Star, Settings, Image, Palette, Layers, Mail, CalendarCog,
  FileText, X, Menu, Home, Shield, Monitor
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { to: "/admin", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", exact: true },
    ],
  },
  {
    label: "Marketplace",
    items: [
      { to: "/admin/listings", icon: <Building2 className="w-4 h-4" />, label: "Listings" },
      { to: "/admin/users", icon: <Users className="w-4 h-4" />, label: "Users" },
      { to: "/admin/bookings", icon: <BookOpen className="w-4 h-4" />, label: "Bookings" },
      { to: "/admin/requests", icon: <FileText className="w-4 h-4" />, label: "Requests" },
      { to: "/admin/conversations", icon: <MessageSquare className="w-4 h-4" />, label: "Conversations" },
      { to: "/admin/reviews", icon: <Star className="w-4 h-4" />, label: "Reviews" },
      { to: "/admin/calendar-sync", icon: <CalendarCog className="w-4 h-4" />, label: "Calendar Sync" },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/settings", icon: <Settings className="w-4 h-4" />, label: "Site Settings" },
      { to: "/admin/slider", icon: <Image className="w-4 h-4" />, label: "Hero Slider" },
      { to: "/admin/design", icon: <Monitor className="w-4 h-4" />, label: "Design & Theme" },
      { to: "/admin/branding", icon: <Palette className="w-4 h-4" />, label: "Branding" },
      { to: "/admin/amenities", icon: <Layers className="w-4 h-4" />, label: "Amenities" },
      { to: "/admin/email-templates", icon: <Mail className="w-4 h-4" />, label: "Email Templates" },
    ],
  },
];

export function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-border flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-sm font-bold text-primary">Admin Panel</h2>
      </div>
      <nav className="flex-1 p-3 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = ('exact' in item && item.exact)
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={cn("sidebar-link text-xs", isActive && "active")}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <Link to="/" className="sidebar-link text-xs">
          <Home className="w-4 h-4" />
          Back to site
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <SiteHeader />
      <div className="flex pt-16">
        <aside className="hidden md:flex flex-col w-56 fixed left-0 top-16 bottom-0 bg-white border-r border-border z-40">
          <SidebarContent />
        </aside>

        <main className="flex-1 md:ml-56">
          <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-border">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-muted">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-sm">Admin Panel</span>
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
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-card-hover flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-bold text-primary">Admin Panel</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}
    </div>
  );
}
