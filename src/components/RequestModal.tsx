import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { X, Send, Calendar, Users } from "lucide-react";

interface RequestModalProps {
  listingId: string;
  listingTitle: string;
  maxGuests: number;
  minNights: number;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  defaultGuests?: number;
  onClose: () => void;
}

export function RequestModal({
  listingId, listingTitle, maxGuests, minNights,
  defaultCheckIn = "", defaultCheckOut = "", defaultGuests = 1,
  onClose,
}: RequestModalProps) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(defaultGuests);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setSending(false);
    toast.success("Request sent! The host will respond within 48 hours.");
    onClose();
    navigate("/app/requests");
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">Request availability</h2>
            <p className="text-sm text-muted-foreground truncate max-w-xs">{listingTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" /> Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={e => setCheckIn(e.target.value)}
                required
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" /> Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={e => setCheckOut(e.target.value)}
                required
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              <Users className="w-3 h-3 inline mr-1" /> Guests
            </label>
            <select
              value={guests}
              onChange={e => setGuests(+e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Message for host{" "}
              <span className="font-normal normal-case text-muted-foreground">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              placeholder="Tell the host about your stay, group size, or any questions..."
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Min nights note */}
          {minNights > 1 && (
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 flex items-center gap-2">
              ⚠️ Minimum stay: {minNights} nights
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={sending || !checkIn || !checkOut}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send request
              </>
            )}
          </button>
          <p className="text-xs text-muted-foreground text-center">
            You won't be charged yet · Free to request
          </p>
        </form>
      </div>
    </div>
  );
}
