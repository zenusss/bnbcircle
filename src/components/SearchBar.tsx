import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Calendar, Users, ChevronDown, X } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  compact?: boolean;
  className?: string;
}

export function SearchBar({ compact = false, className }: SearchBarProps) {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("city", location);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests > 1) params.set("guests", guests.toString());
    navigate(`/search?${params.toString()}`);
  };

  if (compact) {
    return (
      <button
        onClick={handleSearch}
        className={cn(
          "flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-card border border-border hover:shadow-card-hover transition-all duration-200",
          className
        )}
      >
        <Search className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Search destinations...</span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-card-hover border border-border/60 p-2 flex flex-col md:flex-row items-stretch gap-2",
        className
      )}
    >
      {/* Location */}
      <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors cursor-text group">
        <Search className="w-5 h-5 text-accent flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-primary mb-0.5">Where</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search destinations"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
      </div>

      <div className="hidden md:block w-px bg-border self-stretch my-2" />

      {/* Check-in */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
        <Calendar className="w-5 h-5 text-accent flex-shrink-0" />
        <div>
          <label className="block text-xs font-semibold text-primary mb-0.5">Check-in</label>
          <input
            type="date"
            value={checkIn}
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (!checkOut || checkOut <= e.target.value) {
                setCheckOut(format(addDays(new Date(e.target.value), 3), "yyyy-MM-dd"));
              }
            }}
            className="bg-transparent text-sm text-foreground focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="hidden md:block w-px bg-border self-stretch my-2" />

      {/* Check-out */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
        <Calendar className="w-5 h-5 text-accent flex-shrink-0" />
        <div>
          <label className="block text-xs font-semibold text-primary mb-0.5">Check-out</label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => setCheckOut(e.target.value)}
            className="bg-transparent text-sm text-foreground focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="hidden md:block w-px bg-border self-stretch my-2" />

      {/* Guests */}
      <div className="relative">
        <button
          onClick={() => setGuestsOpen(!guestsOpen)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors w-full md:w-auto"
        >
          <Users className="w-5 h-5 text-accent flex-shrink-0" />
          <div className="text-left">
            <p className="text-xs font-semibold text-primary mb-0.5">Guests</p>
            <p className="text-sm text-foreground">{guests} {guests === 1 ? "guest" : "guests"}</p>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground ml-2 transition-transform", guestsOpen && "rotate-180")} />
        </button>

        {guestsOpen && (
          <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-card-hover border border-border p-4 z-50 w-56">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-foreground">Guests</p>
                <p className="text-xs text-muted-foreground">Adults & children</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center text-foreground hover:border-accent transition-colors disabled:opacity-30"
                  disabled={guests <= 1}
                >
                  –
                </button>
                <span className="w-6 text-center font-semibold">{guests}</span>
                <button
                  onClick={() => setGuests(Math.min(20, guests + 1))}
                  className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center text-foreground hover:border-accent transition-colors disabled:opacity-30"
                  disabled={guests >= 20}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="btn-primary rounded-xl px-6 py-3 flex-shrink-0"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:block">Search</span>
      </button>
    </div>
  );
}
