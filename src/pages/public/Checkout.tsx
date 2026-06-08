import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Shield, CreditCard, Lock, Calendar, Users, Star, ChevronLeft, Check, AlertCircle } from "lucide-react";
import { cn, formatEUR } from "@/lib/utils";

const DEMO_LISTINGS: Record<string, { title: string; city: string; image: string; price: number; cleaning: number; rating: number; reviews: number; cancellation: string; houseRules: string }> = {
  "1": { title: "Canal House Amsterdam", city: "Amsterdam", image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600&h=400&fit=crop", price: 185, cleaning: 45, rating: 4.9, reviews: 47, cancellation: "Flexible — full refund 1 day before check-in.", houseRules: "No smoking · No parties · Pets not allowed · Check-in after 15:00" },
  "2": { title: "Modern Loft Vondelpark", city: "Amsterdam", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop", price: 120, cleaning: 30, rating: 4.8, reviews: 31, cancellation: "Moderate — full refund 5 days before check-in.", houseRules: "No smoking · Quiet hours after 22:00 · Max 2 guests" },
};

function formatDate(s: string) {
  if (!s) return "—";
  try { return new Date(s).toLocaleDateString("en-NL", { day: "numeric", month: "short", year: "numeric" }); } catch { return s; }
}
function diffNights(a: string, b: string) {
  if (!a || !b) return 3;
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}
function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

export default function Checkout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const listing = DEMO_LISTINGS[id ?? "1"] ?? DEMO_LISTINGS["1"];
  const checkIn = params.get("checkIn") ?? "";
  const checkOut = params.get("checkOut") ?? "";
  const guests = Number(params.get("adults") ?? 2);
  const nights = diffNights(checkIn, checkOut);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const nightly = listing.price * nights;
  const service = Math.round((nightly + listing.cleaning) * 0.12);
  const total = nightly + listing.cleaning + service;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setConfirmed(true);
    toast.success("Booking confirmed! Check your email.");
    setTimeout(() => navigate("/app/trips"), 3000);
  };
  if (confirmed) return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-bounce">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-heading font-bold">Booking confirmed! 🎉</h1>
        <p className="text-muted-foreground">Confirmation email sent. Redirecting to your trips...</p>
        <Link to="/app/trips" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">View my trips</Link>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-background pt-6 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to={`/listing/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"><ChevronLeft className="w-4 h-4" /> Back to listing</Link>
        <h1 className="text-2xl md:text-3xl font-heading font-bold mb-8">Confirm and pay</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Your trip */}
            <div className="card-base p-6">
              <h2 className="font-bold text-lg mb-4">Your trip</h2>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Check-in</p>
                  <p className="font-semibold">{formatDate(checkIn) || "Select dates"}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Check-out</p>
                  <p className="font-semibold">{formatDate(checkOut) || "Select dates"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />{guests} guest{guests !== 1 ? "s" : ""} · {nights} night{nights !== 1 ? "s" : ""}
              </div>
            </div>
            {/* Contact */}
            <div className="card-base p-6">
              <h2 className="font-bold text-lg mb-4">Contact information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[["First name", "Jan"], ["Last name", "de Vries"]].map(([label, ph]) => (
                  <div key={label}><label className="block text-sm font-semibold mb-1.5">{label}</label><input className="input-base w-full" placeholder={ph} defaultValue={ph} /></div>
                ))}
                <div><label className="block text-sm font-semibold mb-1.5">Email</label><input type="email" className="input-base w-full" defaultValue="demo-guest@bnb-circle.com" /></div>
                <div><label className="block text-sm font-semibold mb-1.5">Phone</label><input type="tel" className="input-base w-full" placeholder="+31 6 12345678" /></div>
              </div>
              <div className="mt-4"><label className="block text-sm font-semibold mb-1.5">Message for host (optional)</label><textarea rows={3} className="input-base w-full resize-none" placeholder="Tell the host about your stay..." /></div>
            </div>
            {/* Payment */}
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Payment</h2>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3" /> Secured by Stripe</span>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm font-semibold mb-1.5">Card number</label>
                  <div className="relative"><CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))} placeholder="1234 5678 9012 3456" className="input-base w-full pl-10" maxLength={19} /></div>
                </div>
                <div><label className="block text-sm font-semibold mb-1.5">Name on card</label><input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Jan de Vries" className="input-base w-full" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold mb-1.5">Expiry</label><input value={expiry} onChange={e => { const v = e.target.value.replace(/\D/g,"").slice(0,4); setExpiry(v.length>2?`${v.slice(0,2)}/${v.slice(2)}`:v); }} placeholder="MM/YY" className="input-base w-full" maxLength={5} /></div>
                  <div><label className="block text-sm font-semibold mb-1.5">CVV</label><input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="123" type="password" className="input-base w-full" /></div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
                {["Visa", "Mastercard", "iDEAL", "PayPal"].map(p => <span key={p} className="text-xs font-semibold text-muted-foreground border border-border rounded px-2 py-1">{p}</span>)}
              </div>
            </div>
            {/* Policies */}
            <div className="card-base p-6 space-y-4">
              <div><h2 className="font-bold text-lg mb-2">Cancellation policy</h2><div className="flex gap-3"><AlertCircle className="w-5 h-5 text-amber-500 shrink-0" /><p className="text-sm text-muted-foreground">{listing.cancellation}</p></div></div>
              <div className="border-t border-border pt-4"><h2 className="font-bold text-lg mb-2">House rules</h2><p className="text-sm text-muted-foreground">{listing.houseRules}</p></div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</> : <><Lock className="w-5 h-5" /> Confirm and pay {formatEUR(total)}</>}
            </button>
            <p className="text-center text-xs text-muted-foreground">By confirming you agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link></p>
          </form>
          {/* Booking summary */}
          <div>
            <div className="card-base p-6 sticky top-24">
              <div className="flex gap-4 mb-6 pb-6 border-b border-border">
                <img src={listing.image} alt={listing.title} className="w-24 h-20 rounded-xl object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{listing.city}</p>
                  <p className="font-semibold text-sm leading-tight">{listing.title}</p>
                  <div className="flex items-center gap-1 mt-1"><Star className="w-3.5 h-3.5 fill-primary text-primary" /><span className="text-xs font-medium">{listing.rating}</span><span className="text-xs text-muted-foreground">({listing.reviews})</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground"><Calendar className="w-4 h-4 text-primary" /><span>{formatDate(checkIn)} → {formatDate(checkOut)}</span></div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>{formatEUR(listing.price)} × {nights} night{nights!==1?"s":""}</span><span>{formatEUR(nightly)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Cleaning fee</span><span>{formatEUR(listing.cleaning)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Service fee (12%)</span><span>{formatEUR(service)}</span></div>
                <div className="flex justify-between font-bold text-base pt-3 border-t border-border"><span>Total</span><span>{formatEUR(total)}</span></div>
              </div>
              <div className="mt-5 pt-5 border-t border-border space-y-2">
                {[{ I: Shield, t: "You won't be charged until host confirms" }, { I: Lock, t: "Payment info encrypted and secure" }].map(({ I, t }) => (
                  <div key={t} className="flex items-center gap-2 text-xs text-muted-foreground"><I className="w-3.5 h-3.5 text-primary shrink-0" />{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
