import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  MessageSquare,
  CalendarCheck,
  Star,
  Settings,
  Send,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotificationType = "message" | "booking" | "review" | "system" | "request";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  link?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns a human-readable relative timestamp string. */
function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffDay === 1) return "Yesterday";
  return `${diffDay} days ago`;
}

/** Per-type icon and colour config. */
const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ElementType; bg: string; text: string }
> = {
  message: { icon: MessageSquare, bg: "bg-blue-100", text: "text-blue-600" },
  booking: { icon: CalendarCheck, bg: "bg-green-100", text: "text-green-600" },
  request: { icon: Send, bg: "bg-orange-100", text: "text-orange-600" },
  review: { icon: Star, bg: "bg-yellow-100", text: "text-yellow-600" },
  system: { icon: Settings, bg: "bg-slate-100", text: "text-slate-500" },
};

// ─── Demo data ────────────────────────────────────────────────────────────────

const now = Date.now();

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "message",
    title: "New message from Sarah",
    body: "Your Canal House booking has a new message",
    timestamp: new Date(now - 2 * 60 * 1000),          // 2 min ago
    isRead: false,
    link: "/app/messages",
  },
  {
    id: "n2",
    type: "booking",
    title: "Booking confirmed!",
    body: "Your Amsterdam stay Jun 15–20 is confirmed",
    timestamp: new Date(now - 60 * 60 * 1000),          // 1 hour ago
    isRead: false,
    link: "/app",
  },
  {
    id: "n3",
    type: "request",
    title: "Request received",
    body: "Mark replied to your availability request",
    timestamp: new Date(now - 3 * 60 * 60 * 1000),      // 3 hours ago
    isRead: false,
    link: "/app/messages",
  },
  {
    id: "n4",
    type: "review",
    title: "New review",
    body: "Emma left a 5-star review for Canal House",
    timestamp: new Date(now - 26 * 60 * 60 * 1000),     // Yesterday
    isRead: true,
    link: "/app",
  },
  {
    id: "n5",
    type: "system",
    title: "Welcome to BnbCircle",
    body: "Your account has been verified",
    timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
    link: "/app/profile",
  },
];

// ─── NotificationItem ─────────────────────────────────────────────────────────

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onClose: () => void;
}

function NotificationItem({ notification, onRead, onClose }: NotificationItemProps) {
  const { icon: Icon, bg, text } = TYPE_CONFIG[notification.type];

  function handleClick() {
    onRead(notification.id);
    onClose();
  }

  return (
    <Link
      to={notification.link ?? "#"}
      onClick={handleClick}
      className={cn(
        "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 relative",
        !notification.isRead && "bg-blue-50/50 hover:bg-blue-50"
      )}
    >
      {/* Unread dot */}
      {!notification.isRead && (
        <span className="absolute right-4 top-3.5 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
      )}

      {/* Type icon */}
      <span
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5",
          bg
        )}
      >
        <Icon className={cn("w-4 h-4", text)} />
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0 pr-4">
        <p
          className={cn(
            "text-sm leading-snug",
            notification.isRead ? "font-medium text-slate-700" : "font-semibold text-slate-900"
          )}
        >
          {notification.title}
        </p>
        <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">
          {notification.body}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          {formatRelativeTime(notification.timestamp)}
        </p>
      </div>
    </Link>
  );
}

// ─── NotificationBell ─────────────────────────────────────────────────────────

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* ── Bell button ── */}
      <button
        type="button"
        aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ""}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
      >
        <Bell className="h-4 w-4" />

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5",
              "inline-flex items-center justify-center",
              "rounded-full bg-red-500 text-white text-[9px] font-bold leading-none",
              // Pulse animation for urgent (first message < 5 min)
              "animate-pulse"
            )}
            aria-hidden="true"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className={cn(
            "absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50",
            "animate-in fade-in-0 slide-in-from-top-2 duration-150"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
            <h2 className="text-sm font-semibold text-slate-800">Notifications</h2>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="overflow-y-auto max-h-[360px] divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Bell className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onRead={markAsRead}
                  onClose={() => setOpen(false)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50/60">
            <Link
              to="/app/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center py-3 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              See all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
