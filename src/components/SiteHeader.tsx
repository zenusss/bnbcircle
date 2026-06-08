import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search, Globe, Menu, X, Heart, LogOut, LayoutDashboard,
  Building2, Shield, MessageSquare, Settings, User,
  MapPin, ChevronLeft, ChevronRight, Minus, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import logoImg from "@/assets/logo.png";
import { format, addDays } from "date-fns";

// ─── Constants ────────────────────────────────────────────────────────────────
const CITIES = [
  "Amsterdam", "Rotterdam", "Utrecht", "Den Haag", "Eindhoven",
  "Groningen", "Maastricht", "Haarlem", "Leiden", "Delft", "Breda",
];

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const WDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function getInitials(email?: string | null) {
  if (!email) return "U";
  const p = email.split("@")[0].split(/[._-]/);
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : email.slice(0, 2).toUpperCase();
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────
function MiniCalendar({
  checkIn, checkOut, onSelect,
}: {
  checkIn?: Date; checkOut?: Date;
  onSelect: (d: Date) => void;
}) {
  const [month, setMonth] = useState(() => {
    const m = checkIn ? new Date(checkIn) : new Date();
    m.setDate(1); return m;
  });

  const today = new Date(); today.setHours(0,0,0,0);
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  const prevMonth = () => setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const nextMonth = () => setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const dayClass = (d: Date) => {
    const isPast = d < today;
    const isStart = checkIn && d.toDateString() === checkIn.toDateString();
    const isEnd   = checkOut && d.toDateString() === checkOut.toDateString();
    const inRange = checkIn && checkOut && d > checkIn && d < checkOut;
    return cn(
      "relative w-9 h-9 mx-auto flex items-center justify-center text-sm rounded-full transition-colors select-none",
      isPast ? "text-gray-300 cursor-default" : "cursor-pointer",
      !isPast && !isStart && !isEnd && !inRange && "hover:bg-gray-100",
      (isStart || isEnd) && "bg-gray-900 text-white font-semibold hover:bg-gray-800",
      inRange && "bg-gray-100 rounded-none",
    );
  };

  return (
    <div className="w-72">
      {/* Quick picks */}
      <div className="flex gap-2 mb-4">
        {[
          { label: "Today", d: today },
          { label: "Tomorrow", d: addDays(today, 1) },
          { label: "This weekend", d: (() => { const fr = new Date(); fr.setDate(fr.getDate() + ((5 - fr.getDay() + 7) % 7)); return fr; })() },
        ].map(q => (
          <button key={q.label} onClick={() => onSelect(q.d)}
            className="flex-1 text-xs border border-gray-200 rounded-xl py-2 px-1 hover:border-gray-800 transition-colors text-gray-700 font-medium">
            <p className="font-semibold text-gray-900">{q.label}</p>
            <p className="text-gray-400 text-[10px]">{format(q.d, "MMM d")}</p>
          </button>
        ))}
      </div>

      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <p className="text-sm font-semibold text-gray-900">{MONTHS[month.getMonth()]} {month.getFullYear()}</p>
        <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {WDAYS.map(d => <p key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</p>)}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: days }).map((_, i) => {
          const d = new Date(month.getFullYear(), month.getMonth(), i + 1);
          return (
            <div key={i} className={dayClass(d)}
              onClick={() => d >= today && onSelect(d)}>
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Guest counter ────────────────────────────────────────────────────────────
function Counter({ label, sub, value, onChange, min = 0 }: {
  label: string; sub: string; value: number;
  onChange: (v: number) => void; min?: number;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value === min}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-700 transition-colors disabled:opacity-30 disabled:cursor-default">
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-5 text-center text-sm font-medium text-gray-900">{value}</span>
        <button onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-700 transition-colors">
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Search Bar (inline in header) ───────────────────────────────────────────
function HeaderSearch({ compact }: { compact?: boolean }) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState<"where" | "when" | "guests" | null>(null);
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [dateStep, setDateStep] = useState<"in" | "out">("in");

  const filtered = CITIES.filter(c => !city || c.toLowerCase().startsWith(city.toLowerCase()));
  const total = adults + children;

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setPanel(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleDayClick = (d: Date) => {
    if (dateStep === "in") {
      setCheckIn(d); setCheckOut(undefined); setDateStep("out");
    } else {
      if (checkIn && d > checkIn) {
        setCheckOut(d); setPanel("guests"); setDateStep("in");
      } else {
        setCheckIn(d); setCheckOut(undefined); setDateStep("out");
      }
    }
  };

  const formatRange = () => {
    if (!checkIn && !checkOut) return "Add dates";
    if (checkIn && !checkOut) return format(checkIn, "MMM d");
    if (checkIn && checkOut) return `${format(checkIn, "MMM d")} – ${format(checkOut, "MMM d")}`;
    return "Add dates";
  };

  const doSearch = () => {
    const p = new URLSearchParams();
    if (city) p.set("q", city);
    if (checkIn) p.set("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) p.set("checkOut", format(checkOut, "yyyy-MM-dd"));
    p.set("adults", String(adults));
    if (children > 0) p.set("children", String(children));
    setPanel(null);
    navigate(`/search?${p.toString()}`);
  };

  if (compact) {
    return (
      <button onClick={() => navigate("/search")}
        className="flex items-center border border-gray-200 rounded-full px-4 py-2.5 shadow-sm hover:shadow-md bg-white transition-shadow text-sm gap-2 text-gray-600 font-medium">
        <Search className="w-4 h-4 text-gray-500 shrink-0" />
        <span className="hidden sm:inline border-r border-gray-200 pr-2 mr-1">Anywhere</span>
        <span className="hidden sm:inline border-r border-gray-200 pr-2 mr-1">Any week</span>
        <span className="hidden sm:inline text-gray-400">Add guests</span>
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center ml-1 shrink-0">
          <Search className="w-3.5 h-3.5 text-white" />
        </div>
      </button>
    );
  }

  return (
    <div ref={ref} className="relative w-full max-w-2xl">
      {/* Pill */}
      <div className={cn(
        "flex items-stretch bg-white border rounded-full transition-shadow",
        panel ? "shadow-xl border-gray-300 ring-1 ring-gray-200" : "shadow-md border-gray-200 hover:shadow-lg",
      )}>
        {/* WHERE */}
        <button type="button" onClick={() => setPanel(panel === "where" ? null : "where")}
          className={cn(
            "flex-[1.2] text-left px-5 py-3 rounded-full transition-colors",
            panel === "where" ? "bg-white shadow-inner" : "hover:bg-gray-50",
          )}>
          <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Where</p>
          <p className={cn("text-sm truncate", city ? "text-gray-900 font-medium" : "text-gray-400")}>
            {city || "Search destinations"}
          </p>
        </button>

        <div className="w-px bg-gray-200 self-stretch my-2.5" />

        {/* WHEN */}
        <button type="button" onClick={() => { setDateStep("in"); setPanel(panel === "when" ? null : "when"); }}
          className={cn(
            "flex-1 text-left px-5 py-3 rounded-full transition-colors",
            panel === "when" ? "bg-white shadow-inner" : "hover:bg-gray-50",
          )}>
          <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">When</p>
          <p className={cn("text-sm", (checkIn || checkOut) ? "text-gray-900 font-medium" : "text-gray-400")}>
            {formatRange()}
          </p>
        </button>

        <div className="w-px bg-gray-200 self-stretch my-2.5" />

        {/* WHO + SEARCH BTN */}
        <div className="flex items-center gap-2 pl-4 pr-2">
          <button type="button" onClick={() => setPanel(panel === "guests" ? null : "guests")} className="text-left">
            <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Who</p>
            <p className={cn("text-sm whitespace-nowrap", total > 0 ? "text-gray-900 font-medium" : "text-gray-400")}>
              {total > 0 ? `${total} guest${total > 1 ? "s" : ""}` : "Add guests"}
            </p>
          </button>
          <button onClick={doSearch}
            className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all shadow-md shrink-0 ml-2">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── WHERE panel ── */}
      {panel === "where" && (
        <div className="absolute top-[calc(100%+12px)] left-0 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 z-[60]
          animate-in fade-in-0 zoom-in-95 duration-150">
          <input value={city} onChange={e => setCity(e.target.value)}
            placeholder="Search destinations"
            autoFocus
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 mb-3" />
          {filtered.slice(0, 6).map(c => (
            <button key={c} onClick={() => { setCity(c); setPanel("when"); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{c}</p>
                <p className="text-xs text-gray-400">Netherlands</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── WHEN panel ── */}
      {panel === "when" && (
        <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 z-[60]
          animate-in fade-in-0 zoom-in-95 duration-150">
          <p className="text-xs text-center text-gray-500 mb-3 font-medium">
            {dateStep === "in" ? "Select check-in date" : "Select check-out date"}
          </p>
          <MiniCalendar checkIn={checkIn} checkOut={checkOut} onSelect={handleDayClick} />
          {checkIn && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <button onClick={() => { setCheckIn(undefined); setCheckOut(undefined); setDateStep("in"); }}
                className="text-sm font-semibold text-gray-500 underline hover:text-gray-900">Clear</button>
              <button onClick={() => setPanel("guests")}
                className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── WHO panel ── */}
      {panel === "guests" && (
        <div className="absolute top-[calc(100%+12px)] right-0 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 z-[60]
          animate-in fade-in-0 zoom-in-95 duration-150">
          <Counter label="Adults" sub="Ages 13+" value={adults} onChange={setAdults} min={1} />
          <Counter label="Children" sub="Ages 2–12" value={children} onChange={setChildren} />
          <Counter label="Infants" sub="Under 2" value={0} onChange={() => {}} />
          <button onClick={doSearch}
            className="w-full mt-4 bg-primary text-white rounded-xl py-3 font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            <Search className="w-4 h-4" /> Search
          </button>
        </div>
      )}
    </div>
  );
}

// ─── User Menu Dropdown ───────────────────────────────────────────────────────
function UserMenuDropdown({ user, isAdmin, isHost, signOut }: {
  user: { email?: string | null }; isAdmin: boolean; isHost: boolean; signOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const initials = getInitials(user.email);
  const dashPath = isAdmin ? "/admin" : isHost ? "/host" : "/app";

  const items = [
    { label: "Dashboard", icon: LayoutDashboard, href: dashPath },
    { label: "Favorites", icon: Heart, href: "/app/favorites" },
    { label: "Messages", icon: MessageSquare, href: "/app/messages" },
    { label: "Profile & settings", icon: Settings, href: "/app/profile" },
    ...(isHost ? [{ label: "Host dashboard", icon: Building2, href: "/host" }] : []),
    ...(isAdmin ? [{ label: "Admin panel", icon: Shield, href: "/admin" }] : []),
  ];

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 border border-gray-200 rounded-full pl-3 pr-1.5 py-1.5 hover:shadow-md transition-shadow bg-white">
        <Menu className="w-4 h-4 text-gray-600" />
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[70]
          animate-in fade-in-0 zoom-in-95 duration-150">
          <p className="px-4 py-2 text-xs text-gray-400 truncate border-b border-gray-100 mb-1">{user.email}</p>
          {items.map(item => (
            <button key={item.label} onClick={() => { navigate(item.href); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <item.icon className="w-4 h-4 text-gray-500" />
              {item.label}
            </button>
          ))}
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button onClick={() => { signOut(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Guest Menu (not logged in) ───────────────────────────────────────────────
function GuestMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 border border-gray-200 rounded-full pl-3 pr-1.5 py-1.5 hover:shadow-md transition-shadow bg-white">
        <Menu className="w-4 h-4 text-gray-600" />
        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[70]
          animate-in fade-in-0 zoom-in-95 duration-150">
          <Link to="/signup" onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
            Sign up
          </Link>
          <Link to="/login" onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Log in
          </Link>
          <div className="border-t border-gray-100 mt-1 pt-1">
            <Link to="/signup?role=host" onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Become a host
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mobile Search Modal ──────────────────────────────────────────────────────
function MobileSearchModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<"where" | "when" | "guests">("where");
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [dateStep, setDateStep] = useState<"in" | "out">("in");

  const filtered = CITIES.filter(c => !city || c.toLowerCase().startsWith(city.toLowerCase()));
  const total = adults + children;

  const handleDayClick = (d: Date) => {
    if (dateStep === "in") {
      setCheckIn(d); setCheckOut(undefined); setDateStep("out");
    } else {
      if (checkIn && d > checkIn) {
        setCheckOut(d); setStep("guests"); setDateStep("in");
      } else {
        setCheckIn(d); setCheckOut(undefined); setDateStep("out");
      }
    }
  };

  const formatRange = () => {
    if (!checkIn && !checkOut) return "Any dates";
    if (checkIn && !checkOut) return format(checkIn, "MMM d");
    if (checkIn && checkOut) return `${format(checkIn, "MMM d")} – ${format(checkOut, "MMM d")}`;
    return "Any dates";
  };

  const doSearch = () => {
    const p = new URLSearchParams();
    if (city) p.set("q", city);
    if (checkIn) p.set("checkIn", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) p.set("checkOut", format(checkOut, "yyyy-MM-dd"));
    p.set("adults", String(adults));
    if (children > 0) p.set("children", String(children));
    onClose();
    navigate(`/search?${p.toString()}`);
  };

  const STEPS = ["where", "when", "guests"] as const;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <p className="text-sm font-bold text-gray-900">
          {step === "where" ? "Where to?" : step === "when" ? "When?" : "Who's coming?"}
        </p>
        <div className="w-9" />
      </div>

      {/* Step pills */}
      <div className="flex border-b border-gray-100">
        {STEPS.map((s, i) => (
          <button key={s} onClick={() => setStep(s)}
            className={cn(
              "flex-1 py-2.5 text-xs font-semibold transition-colors",
              step === s ? "text-primary border-b-2 border-primary" : "text-gray-400",
            )}>
            {s === "where" ? `📍 ${city || "Where"}` : s === "when" ? `📅 ${formatRange()}` : `👥 ${total > 0 ? `${total} guest${total > 1 ? "s" : ""}` : "Guests"}`}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-4">
        {step === "where" && (
          <div>
            <input value={city} onChange={e => setCity(e.target.value)}
              placeholder="Search destinations"
              autoFocus
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm outline-none focus:border-primary bg-gray-50 mb-4" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Popular</p>
            <div className="grid grid-cols-2 gap-2">
              {filtered.slice(0, 8).map(c => (
                <button key={c} onClick={() => { setCity(c); setStep("when"); }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all text-left">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{c}</p>
                    <p className="text-[10px] text-gray-400">Netherlands</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "when" && (
          <div>
            <div className="flex gap-2 mb-4">
              {[
                { label: "Today", d: new Date() },
                { label: "Tomorrow", d: addDays(new Date(), 1) },
                { label: "This weekend", d: (() => { const fr = new Date(); fr.setDate(fr.getDate() + ((5 - fr.getDay() + 7) % 7)); return fr; })() },
              ].map(q => (
                <button key={q.label} onClick={() => { setCheckIn(q.d); setCheckOut(undefined); setDateStep("out"); }}
                  className="flex-1 text-xs border-2 border-gray-200 rounded-xl py-2.5 hover:border-primary transition-colors">
                  <p className="font-bold text-gray-900">{q.label}</p>
                  <p className="text-gray-400 text-[10px]">{format(q.d, "MMM d")}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <MiniCalendar checkIn={checkIn} checkOut={checkOut} onSelect={handleDayClick} />
            </div>
            {checkIn && (
              <button onClick={() => setStep("guests")}
                className="w-full mt-4 bg-primary text-white py-3 rounded-2xl font-semibold text-sm hover:bg-primary/90 transition-colors">
                Next →
              </button>
            )}
          </div>
        )}

        {step === "guests" && (
          <div className="space-y-1">
            <Counter label="Adults" sub="Ages 13+" value={adults} onChange={setAdults} min={1} />
            <Counter label="Children" sub="Ages 2–12" value={children} onChange={setChildren} />
            <Counter label="Infants" sub="Under 2" value={0} onChange={() => {}} />
          </div>
        )}
      </div>

      {/* Bottom search button */}
      <div className="p-4 border-t border-gray-100 safe-area-bottom">
        <button onClick={doSearch}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base hover:bg-primary/90 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
          <Search className="w-5 h-5" />
          Search
        </button>
      </div>
    </div>
  );
}

// ─── Main SiteHeader ──────────────────────────────────────────────────────────
export function SiteHeader({
  transparentHeader = false,
  showSearch = false,
}: {
  transparentHeader?: boolean;
  showSearch?: boolean;
}) {
  const { user, isAdmin, isHost, signOut } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const isHome = location.pathname === "/";

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Lock body scroll when mobile search is open
  useEffect(() => {
    document.body.style.overflow = mobileSearchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileSearchOpen]);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 bg-white transition-shadow duration-300",
        scrolled ? "shadow-md border-b border-gray-200" : "border-b border-gray-100",
      )}>
        <div className="px-4 md:px-8 h-16 md:h-[72px] flex items-center justify-between gap-3 md:gap-4">

          {/* ── LEFT: Logo ── */}
          <Link to="/" className="shrink-0" aria-label="BnbCircle">
            <img src={logoImg} alt="BnbCircle" className="h-7 md:h-8 max-w-[100px] object-contain" />
          </Link>

          {/* ── CENTER ── */}
          {/* Desktop: full search pill */}
          <div className="hidden md:flex flex-1 items-center justify-center min-w-0 px-2">
            {(isHome && scrolled) ? <HeaderSearch compact /> : <HeaderSearch />}
          </div>

          {/* Mobile: compact pill that opens fullscreen modal */}
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="md:hidden flex-1 flex items-center gap-2 border border-gray-200 rounded-full px-3 py-2 shadow-sm bg-white min-w-0"
          >
            <Search className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-xs text-gray-400 truncate">Where to? · Dates · Guests</span>
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center ml-auto shrink-0">
              <Search className="w-3 h-3 text-white" />
            </div>
          </button>

          {/* ── RIGHT: auth ── */}
          <div className="flex items-center gap-1 shrink-0">
            {!user && (
              <Link to="/signup?role=host"
                className="hidden md:block text-sm font-semibold text-gray-700 px-4 py-2.5 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap">
                Become a host
              </Link>
            )}
            <button className="w-10 h-10 rounded-full items-center justify-center hidden md:flex hover:bg-gray-100 transition-colors">
              <Globe className="w-5 h-5 text-gray-600" />
            </button>
            {user
              ? <UserMenuDropdown user={user} isAdmin={isAdmin} isHost={isHost} signOut={() => void signOut()} />
              : <GuestMenu />
            }
          </div>
        </div>
      </header>

      {/* Mobile fullscreen search */}
      {mobileSearchOpen && <MobileSearchModal onClose={() => setMobileSearchOpen(false)} />}
    </>
  );
}
