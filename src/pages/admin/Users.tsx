import React, { useState, useMemo } from "react";
import {
  Search, Plus, X, Pencil, Trash2, Shield, Building2,
  User, Ban, CheckCircle, Clock, BookOpen, Home, StickyNote,
  Eye, ChevronRight, Mail, Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "admin" | "host" | "guest";
type Status = "active" | "banned";

interface DemoUser {
  id: string;
  name: string;
  email: string;
  joined: string;
  lastSeen: string; // ISO date string
  roles: Role[];
  status: Status;
  avatarColor: string;
  adminNotes: string;
  bookings: DemoBooking[];
  listings: DemoListing[];
}

interface DemoBooking {
  id: string;
  property: string;
  checkIn: string;
  checkOut: string;
  total: number;
  status: "confirmed" | "pending" | "cancelled";
}

interface DemoListing {
  id: string;
  title: string;
  city: string;
  pricePerNight: number;
  status: "active" | "pending" | "inactive";
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-orange-500", "bg-blue-500", "bg-emerald-500", "bg-purple-500",
  "bg-rose-500", "bg-amber-500", "bg-teal-500", "bg-indigo-500",
  "bg-cyan-500", "bg-fuchsia-500",
];

const DEMO_USERS: DemoUser[] = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@bnbcircle.com",
    joined: "2025-01-01",
    lastSeen: "2026-06-02T12:00:00Z",
    roles: ["admin", "host", "guest"],
    status: "active",
    avatarColor: AVATAR_COLORS[0],
    adminNotes: "Platform founder. Full access.",
    bookings: [],
    listings: [
      { id: "l1", title: "Modern Canal House", city: "Amsterdam", pricePerNight: 145, status: "active" },
    ],
  },
  {
    id: "u2",
    name: "Sarah van der Berg",
    email: "sarah@example.com",
    joined: "2025-03-15",
    lastSeen: "2026-06-01T09:30:00Z",
    roles: ["host", "guest"],
    status: "active",
    avatarColor: AVATAR_COLORS[1],
    adminNotes: "Top rated host, 4.9 average.",
    bookings: [
      { id: "b1", property: "Seaside Villa Zandvoort", checkIn: "2026-05-01", checkOut: "2026-05-07", total: 870, status: "confirmed" },
    ],
    listings: [
      { id: "l2", title: "Cozy Studio Jordaan", city: "Amsterdam", pricePerNight: 75, status: "active" },
      { id: "l3", title: "Loft near Vondelpark", city: "Amsterdam", pricePerNight: 110, status: "active" },
    ],
  },
  {
    id: "u3",
    name: "Emma Johnson",
    email: "emma@example.com",
    joined: "2025-06-20",
    lastSeen: "2026-05-28T16:45:00Z",
    roles: ["guest"],
    status: "active",
    avatarColor: AVATAR_COLORS[2],
    adminNotes: "",
    bookings: [
      { id: "b2", property: "Modern Canal House", checkIn: "2026-07-10", checkOut: "2026-07-14", total: 580, status: "confirmed" },
      { id: "b3", property: "Beach Retreat Scheveningen", checkIn: "2026-08-01", checkOut: "2026-08-05", total: 420, status: "pending" },
    ],
    listings: [],
  },
  {
    id: "u4",
    name: "Lars Petersen",
    email: "lars@example.com",
    joined: "2026-01-10",
    lastSeen: "2026-06-02T08:00:00Z",
    roles: ["guest"],
    status: "active",
    avatarColor: AVATAR_COLORS[3],
    adminNotes: "",
    bookings: [
      { id: "b4", property: "Cozy Studio Jordaan", checkIn: "2026-06-15", checkOut: "2026-06-18", total: 225, status: "confirmed" },
    ],
    listings: [],
  },
  {
    id: "u5",
    name: "Maria García",
    email: "maria@example.com",
    joined: "2025-08-05",
    lastSeen: "2026-05-10T14:20:00Z",
    roles: ["host", "guest"],
    status: "active",
    avatarColor: AVATAR_COLORS[4],
    adminNotes: "Requested VAT invoice. Sent on 2026-04-01.",
    bookings: [],
    listings: [
      { id: "l4", title: "Villa with Private Pool", city: "Almería", pricePerNight: 280, status: "active" },
      { id: "l5", title: "City Apartment", city: "Barcelona", pricePerNight: 95, status: "pending" },
    ],
  },
  {
    id: "u6",
    name: "Tom Müller",
    email: "tom@example.com",
    joined: "2025-11-20",
    lastSeen: "2026-04-01T10:00:00Z",
    roles: ["guest"],
    status: "banned",
    avatarColor: AVATAR_COLORS[5],
    adminNotes: "Banned 2026-03-28: repeated policy violations — left properties damaged.",
    bookings: [
      { id: "b5", property: "Modern Canal House", checkIn: "2026-03-01", checkOut: "2026-03-05", total: 580, status: "cancelled" },
    ],
    listings: [],
  },
  {
    id: "u7",
    name: "Aiko Tanaka",
    email: "aiko@example.com",
    joined: "2025-09-12",
    lastSeen: "2026-05-30T11:15:00Z",
    roles: ["host", "guest"],
    status: "active",
    avatarColor: AVATAR_COLORS[6],
    adminNotes: "",
    bookings: [
      { id: "b6", property: "Loft near Vondelpark", checkIn: "2026-06-20", checkOut: "2026-06-25", total: 550, status: "confirmed" },
    ],
    listings: [
      { id: "l6", title: "Japanese Garden House", city: "Kyoto", pricePerNight: 200, status: "active" },
    ],
  },
  {
    id: "u8",
    name: "Pierre Dubois",
    email: "pierre@example.com",
    joined: "2026-02-28",
    lastSeen: "2026-06-02T07:00:00Z",
    roles: ["guest"],
    status: "active",
    avatarColor: AVATAR_COLORS[7],
    adminNotes: "",
    bookings: [],
    listings: [],
  },
  {
    id: "u9",
    name: "Ingrid Svensson",
    email: "ingrid@example.com",
    joined: "2025-07-01",
    lastSeen: "2026-06-01T18:00:00Z",
    roles: ["host", "guest"],
    status: "active",
    avatarColor: AVATAR_COLORS[8],
    adminNotes: "Superhost candidate.",
    bookings: [
      { id: "b7", property: "Cozy Studio Jordaan", checkIn: "2026-05-22", checkOut: "2026-05-24", total: 150, status: "confirmed" },
    ],
    listings: [
      { id: "l7", title: "Nordic Retreat Cabin", city: "Dalarna", pricePerNight: 130, status: "active" },
      { id: "l8", title: "Stockholm City Flat", city: "Stockholm", pricePerNight: 110, status: "inactive" },
    ],
  },
  {
    id: "u10",
    name: "Fatima Al-Hassan",
    email: "fatima@example.com",
    joined: "2026-04-15",
    lastSeen: "2026-06-02T09:45:00Z",
    roles: ["guest"],
    status: "active",
    avatarColor: AVATAR_COLORS[9],
    adminNotes: "",
    bookings: [
      { id: "b8", property: "Villa with Private Pool", checkIn: "2026-08-10", checkOut: "2026-08-17", total: 1960, status: "confirmed" },
    ],
    listings: [],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatDate(str: string): string {
  return new Date(str).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function generatePassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ─── Role chip ────────────────────────────────────────────────────────────────

function RoleChip({ role }: { role: Role }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
      role === "admin" && "bg-emerald-100 text-emerald-700",
      role === "host" && "bg-blue-100 text-blue-700",
      role === "guest" && "bg-gray-100 text-gray-600",
    )}>
      {role === "admin" && <Shield className="w-3 h-3" />}
      {role === "host" && <Building2 className="w-3 h-3" />}
      {role === "guest" && <User className="w-3 h-3" />}
      {role}
    </span>
  );
}

// ─── Status chip ──────────────────────────────────────────────────────────────

function StatusChip({ status }: { status: Status }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
      status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
    )}>
      {status === "active" ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
      {status}
    </span>
  );
}

// ─── EditUserModal ────────────────────────────────────────────────────────────

interface EditUserModalProps {
  user: DemoUser;
  onClose: () => void;
  onSave: (updated: DemoUser) => void;
}

function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [name, setName] = useState(user.name);
  const [roles, setRoles] = useState<Set<Role>>(new Set(user.roles));
  const [status, setStatus] = useState<Status>(user.status);

  const toggleRole = (role: Role) => {
    if (role === "guest") return; // guest is always set
    setRoles((prev) => {
      const next = new Set(prev);
      next.has(role) ? next.delete(role) : next.add(role);
      return next;
    });
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error("Name cannot be empty"); return; }
    onSave({ ...user, name: name.trim(), roles: Array.from(roles), status });
    toast.success("User updated successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-primary">Edit User</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-base"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input value={user.email} readOnly className="input-base bg-muted/50 cursor-not-allowed text-muted-foreground" />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Roles</label>
            <div className="flex flex-col gap-2">
              {(["admin", "host", "guest"] as Role[]).map((role) => (
                <label key={role} className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                  roles.has(role) ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground",
                  role === "guest" && "opacity-60 cursor-not-allowed",
                )}>
                  <input
                    type="checkbox"
                    checked={roles.has(role)}
                    onChange={() => toggleRole(role)}
                    disabled={role === "guest"}
                    className="rounded accent-orange-500"
                  />
                  <RoleChip role={role} />
                  <span className="text-xs text-muted-foreground ml-auto">
                    {role === "admin" ? "Full platform access" : role === "host" ? "Can list properties" : "Always assigned"}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Account status</label>
            <div className="flex gap-2">
              {(["active", "banned"] as Status[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all",
                    status === s
                      ? s === "active" ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-red-400 bg-red-50 text-red-700"
                      : "border-border text-muted-foreground hover:border-muted-foreground",
                  )}
                >
                  {s === "active" ? "✓ Active" : "⛔ Banned"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-border text-sm font-semibold hover:bg-muted transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 btn-primary">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AddUserModal ─────────────────────────────────────────────────────────────

interface AddUserModalProps {
  onClose: () => void;
  onAdd: (user: DemoUser) => void;
}

function AddUserModal({ onClose, onAdd }: AddUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password] = useState(generatePassword);
  const [role, setRole] = useState<Role>("guest");
  const [sendInvite, setSendInvite] = useState(true);

  const handleCreate = () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    if (!email.trim() || !email.includes("@")) { toast.error("Valid email required"); return; }
    const newUser: DemoUser = {
      id: `u${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      joined: new Date().toISOString().slice(0, 10),
      lastSeen: new Date().toISOString(),
      roles: role === "admin" ? ["admin", "host", "guest"] : role === "host" ? ["host", "guest"] : ["guest"],
      status: "active",
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      adminNotes: "",
      bookings: [],
      listings: [],
    };
    onAdd(newUser);
    toast.success(`User ${name} created${sendInvite ? " — invite email sent" : ""}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-primary">Add New User</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Display name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-base"
              placeholder="Jane Smith"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Generated password</label>
            <div className="relative">
              <input value={password} readOnly className="input-base bg-muted/50 font-mono text-sm cursor-text" />
              <button
                onClick={() => { navigator.clipboard.writeText(password); toast.success("Password copied!"); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-accent hover:underline font-medium"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">User should change this on first login.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="input-base">
              <option value="guest">Guest — can book properties</option>
              <option value="host">Host — can list properties</option>
              <option value="admin">Admin — full platform access</option>
            </select>
          </div>
          <label className="flex items-center gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/30 transition-colors">
            <input
              type="checkbox"
              checked={sendInvite}
              onChange={(e) => setSendInvite(e.target.checked)}
              className="rounded accent-orange-500"
            />
            <div>
              <p className="text-sm font-medium">Send invite email</p>
              <p className="text-xs text-muted-foreground">User will receive credentials via email</p>
            </div>
            <Mail className="w-4 h-4 text-muted-foreground ml-auto" />
          </label>
        </div>
        <div className="flex gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-border text-sm font-semibold hover:bg-muted transition-colors">
            Cancel
          </button>
          <button onClick={handleCreate} className="flex-1 btn-primary">
            <Plus className="w-4 h-4" /> Create user
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── UserDetailPanel ──────────────────────────────────────────────────────────

interface UserDetailPanelProps {
  user: DemoUser;
  onClose: () => void;
  onUpdate: (updated: DemoUser) => void;
}

function UserDetailPanel({ user, onClose, onUpdate }: UserDetailPanelProps) {
  const [notes, setNotes] = useState(user.adminNotes);
  const [saved, setSaved] = useState(false);

  const saveNotes = () => {
    onUpdate({ ...user, adminNotes: notes });
    setSaved(true);
    toast.success("Admin notes saved");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative z-50 w-full max-w-md bg-white shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
          <h2 className="text-base font-bold text-primary">User Profile</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Avatar & name */}
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0",
              user.avatarColor,
            )}>
              {getInitials(user.name)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {user.roles.map((r) => <RoleChip key={r} role={r} />)}
                <StatusChip status={user.status} />
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Calendar className="w-4 h-4" />, label: "Joined", value: formatDate(user.joined) },
              { icon: <Clock className="w-4 h-4" />, label: "Last seen", value: relativeTime(user.lastSeen) },
              { icon: <BookOpen className="w-4 h-4" />, label: "Bookings", value: `${user.bookings.length}` },
              { icon: <Home className="w-4 h-4" />, label: "Listings", value: `${user.listings.length}` },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-muted/30 rounded-xl">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  {item.icon}
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
                <p className="text-sm font-bold text-primary">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Bookings */}
          <div>
            <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Bookings ({user.bookings.length})
            </h4>
            {user.bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No bookings yet.</p>
            ) : (
              <div className="space-y-2">
                {user.bookings.map((b) => (
                  <div key={b.id} className="p-3 bg-muted/30 rounded-xl text-sm">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-foreground leading-tight">{b.property}</p>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0",
                        b.status === "confirmed" && "bg-emerald-100 text-emerald-700",
                        b.status === "pending" && "bg-amber-100 text-amber-700",
                        b.status === "cancelled" && "bg-red-100 text-red-700",
                      )}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(b.checkIn)} → {formatDate(b.checkOut)} · €{b.total}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Listings (hosts only) */}
          {user.listings.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                <Home className="w-4 h-4" /> Listings ({user.listings.length})
              </h4>
              <div className="space-y-2">
                {user.listings.map((l) => (
                  <div key={l.id} className="p-3 bg-muted/30 rounded-xl text-sm flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">{l.title}</p>
                      <p className="text-xs text-muted-foreground">{l.city} · €{l.pricePerNight}/night</p>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0",
                      l.status === "active" && "bg-emerald-100 text-emerald-700",
                      l.status === "pending" && "bg-amber-100 text-amber-700",
                      l.status === "inactive" && "bg-gray-100 text-gray-600",
                    )}>
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin notes */}
          <div>
            <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
              <StickyNote className="w-4 h-4" /> Admin Notes
            </h4>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-base resize-none text-sm"
              placeholder="Internal notes about this user..."
            />
            <button
              onClick={saveNotes}
              className={cn(
                "mt-2 w-full py-2 rounded-xl text-sm font-semibold border-2 transition-all",
                saved
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-accent bg-accent/5 text-accent hover:bg-accent hover:text-white",
              )}
            >
              {saved ? "✓ Saved" : "Save notes"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type RoleFilter = "all" | Role;

export default function AdminUsers() {
  const [users, setUsers] = useState<DemoUser[]>(DEMO_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState<DemoUser | null>(null);
  const [detailUser, setDetailUser] = useState<DemoUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Stats
  const stats = useMemo(() => ({
    total: users.length,
    guests: users.filter((u) => u.roles.includes("guest")).length,
    hosts: users.filter((u) => u.roles.includes("host")).length,
    admins: users.filter((u) => u.roles.includes("admin")).length,
  }), [users]);

  // Filtered users
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.roles.includes(roleFilter);
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const updateUser = (updated: DemoUser) => {
    setUsers((prev) => prev.map((u) => u.id === updated.id ? updated : u));
    if (detailUser?.id === updated.id) setDetailUser(updated);
    if (editUser?.id === updated.id) setEditUser(null);
  };

  const addUser = (user: DemoUser) => {
    setUsers((prev) => [user, ...prev]);
  };

  const toggleBan = (userId: string) => {
    setUsers((prev) => prev.map((u) => {
      if (u.id !== userId) return u;
      const newStatus: Status = u.status === "active" ? "banned" : "active";
      toast.success(`User ${newStatus === "banned" ? "banned" : "unbanned"}`);
      return { ...u, status: newStatus };
    }));
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (detailUser?.id === userId) setDetailUser(null);
    setDeleteConfirm(null);
    toast.success("User deleted");
  };

  const TABS: { label: string; value: RoleFilter }[] = [
    { label: `All (${users.length})`, value: "all" },
    { label: `Guests (${stats.guests})`, value: "guest" },
    { label: `Hosts (${stats.hosts})`, value: "host" },
    { label: `Admins (${stats.admins})`, value: "admin" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage platform users, roles, and permissions</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex-shrink-0">
          <Plus className="w-4 h-4" /> Add user
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total users", value: stats.total, icon: <User className="w-5 h-5" />, color: "text-primary bg-primary/10" },
          { label: "Guests", value: stats.guests, icon: <User className="w-5 h-5" />, color: "text-gray-600 bg-gray-100" },
          { label: "Hosts", value: stats.hosts, icon: <Building2 className="w-5 h-5" />, color: "text-blue-600 bg-blue-100" },
          { label: "Admins", value: stats.admins, icon: <Shield className="w-5 h-5" />, color: "text-emerald-600 bg-emerald-100" },
        ].map((s) => (
          <div key={s.label} className="card-base p-4 flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", s.color)}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="input-base pl-9"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 p-1 bg-muted rounded-xl">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setRoleFilter(tab.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                roleFilter === tab.value
                  ? "bg-white text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {["User", "Joined", "Roles", "Status", "Last seen", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    No users match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-muted/20 cursor-pointer transition-colors"
                    onClick={() => setDetailUser(u)}
                  >
                    {/* Avatar + name + email */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
                          u.avatarColor,
                        )}>
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground leading-tight">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Joined */}
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                      {formatDate(u.joined)}
                    </td>
                    {/* Roles */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => <RoleChip key={r} role={r} />)}
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusChip status={u.status} />
                    </td>
                    {/* Last seen */}
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {relativeTime(u.lastSeen)}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setEditUser(u)}
                          title="Edit user"
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleBan(u.id)}
                          title={u.status === "active" ? "Ban user" : "Unban user"}
                          className={cn(
                            "p-1.5 rounded-lg transition-colors",
                            u.status === "active"
                              ? "hover:bg-red-50 text-muted-foreground hover:text-red-600"
                              : "text-emerald-600 hover:bg-emerald-50",
                          )}
                        >
                          {u.status === "active" ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(u.id)}
                          title="Delete user"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDetailUser(u)}
                          title="View profile"
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
            Showing {filtered.length} of {users.length} users
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-primary text-center">Delete user?</h3>
            <p className="text-sm text-muted-foreground text-center">
              This action is permanent and cannot be undone. All user data will be removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border-2 border-border text-sm font-semibold hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteUser(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddUserModal onClose={() => setShowAddModal(false)} onAdd={addUser} />
      )}
      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSave={updateUser} />
      )}
      {detailUser && (
        <UserDetailPanel user={detailUser} onClose={() => setDetailUser(null)} onUpdate={updateUser} />
      )}
    </div>
  );
}
