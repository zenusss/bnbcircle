import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Search, MapPin, Users, ChevronLeft, ChevronRight,
  CheckCircle, CheckCircle2, Calendar, ShieldCheck, Clock, Headphones,
  Building2, Home as HomeIcon, Trees, Star, Quote,
  ArrowRight, Minus, Plus, ChevronDown, X,
  Wifi, Car, Coffee,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { SEO } from "@/components/SEO";

// ─── Real assets from bnb-circle.com ────────────────────────────────────────
import iconRentals from "@/assets/icon-rentals.png";
import iconManagement from "@/assets/icon-management.png";
import iconCommunity from "@/assets/icon-community.png";
import iconOperations from "@/assets/icon-operations.png";
import cityscapeBg from "@/assets/cityscape-bg.png";

// ─── EXACT DATA from bundle ───────────────────────────────────────────────────

// sM — trust bar icons (from bundle)
const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Verified bookings" },
  { icon: CheckCircle2, label: "No hidden fees" },
  { icon: Clock, label: "Flexible cancellation 48h" },
  { icon: Headphones, label: "24/7 Support" },
];

// lM — travelling for categories (from bundle)
const TRAVEL_INTENTS = [
  { image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=600&fit=crop", label: "Work from anywhere", intent: "work" },
  { image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=600&fit=crop", label: "City break", intent: "city" },
  { image: "https://images.unsplash.com/photo-1511895426328-dc8714191011?w=400&h=600&fit=crop", label: "Family", intent: "family" },
  { image: "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=400&h=600&fit=crop", label: "Romantic getaway", intent: "romantic" },
  { image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop", label: "Nature & quiet", intent: "nature" },
  { image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=600&fit=crop", label: "Events", intent: "events" },
];

// cM — property types (from bundle)
const PROPERTY_TYPES = [
  { icon: Building2, label: "Apartments", type: "apartment" },
  { icon: HomeIcon, label: "Houses", type: "house" },
  { icon: Trees, label: "Cabins", type: "cabin" },
  { icon: Star, label: "Villas", type: "villa" },
  { icon: Coffee, label: "Boutique stays", type: "boutique" },
  { icon: Wifi, label: "Pet-friendly", type: "pet-friendly" },
];

// AM — testimonials (EXACT from bundle)
const TESTIMONIALS = [
  { rating: 5, comment: "Found the perfect place in 2 minutes - everything was exactly as pictured.", name: "Alex M.", city: "Amsterdam", stayType: "City break" },
  { rating: 5, comment: "Excellent communication with the host, quick check-in and spotless cleanliness.", name: "Sophie V.", city: "Rotterdam", stayType: "Family" },
  { rating: 4, comment: "Fantastic location, 5 minutes from the center. We'll definitely be back!", name: "Pieter D.", city: "Utrecht", stayType: "Romantic getaway" },
  { rating: 5, comment: "Best value for money I've found. Highly recommend!", name: "Elena S.", city: "Den Haag", stayType: "Work from anywhere" },
];

// uM — popular destinations (exact Unsplash URLs from bundle)
const POPULAR_DESTINATIONS = [
  { name: "Amsterdam", image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop", active: true },
  { name: "Rotterdam", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", active: false },
  { name: "Utrecht", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop", active: false },
  { name: "Den Haag", image: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=400&h=300&fit=crop", active: false },
  { name: "Maastricht", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop", active: false },
  { name: "Groningen", image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=400&h=300&fit=crop", active: false },
];

// Demo property cards (from our demo listings)
const DEMO_LISTINGS = [
  { id: "1", title: "Canal House Amsterdam", city: "Amsterdam", price: 185, rating: 4.9, reviews: 47, image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600&h=400&fit=crop", type: "House" },
  { id: "2", title: "Modern Loft near Rijksmuseum", city: "Amsterdam", price: 120, rating: 4.8, reviews: 31, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop", type: "Apartment" },
  { id: "3", title: "Charming Room in Utrecht", city: "Utrecht", price: 88, rating: 4.7, reviews: 22, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop", type: "Room" },
  { id: "4", title: "Sunny Apartment on Amst...", city: "Amsterdam", price: 225, rating: 5.0, reviews: 18, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop", type: "Apartment" },
  { id: "5", title: "Rotterdam Waterfront Studio", city: "Rotterdam", price: 95, rating: 4.6, reviews: 34, image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&h=400&fit=crop", type: "Studio" },
  { id: "6", title: "Haarlem Historic Center", city: "Haarlem", price: 145, rating: 4.9, reviews: 29, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop", type: "Apartment" },
];

// HERO slides
const HERO_SLIDES = [
  "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=1600&h=900&fit=crop",
];

// Pillars (exact from bundle: KF)
const PILLARS = [
  { icon: iconRentals,    title: "Rentals",              desc: "Short, mid-term & long stays on top platforms" },
  { icon: iconManagement, title: "Property Management",  desc: "Bookings, pricing, guests & compliance handled" },
  { icon: iconCommunity,  title: "Owner Circle",         desc: "Private community with exclusive benefits" },
  { icon: iconOperations, title: "Operational Services", desc: "Cleaning, maintenance & repairs" },
];

const CITIES_LIST = ["Amsterdam","Rotterdam","Utrecht","Den Haag","Eindhoven","Groningen","Maastricht","Haarlem","Leiden","Delft","Breda","Nijmegen","Arnhem","Tilburg","Almere"];

// ─── Horizontal scroll helper ─────────────────────────────────────────────────
function useHScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  return { ref, scroll };
}

// ─── SearchBar (hero + sticky variants) — exact from u5 component ─────────────
function SearchBar({ variant = "hero" }: { variant?: "hero" | "sticky" }) {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [showCities, setShowCities] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [showGuests, setShowGuests] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = city.length > 0 ? CITIES_LIST.filter(c => c.toLowerCase().startsWith(city.toLowerCase())) : CITIES_LIST;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowCities(false); setShowGuests(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const doSearch = () => {
    const p = new URLSearchParams();
    if (city) p.set("q", city);
    if (checkIn) p.set("checkIn", checkIn);
    if (checkOut) p.set("checkOut", checkOut);
    p.set("adults", String(adults));
    navigate(`/search?${p.toString()}`);
  };

  if (variant === "sticky") {
    return (
      <div ref={containerRef} className="flex items-center gap-2 bg-background rounded-full px-4 py-2 max-w-xl mx-auto">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input value={city} onChange={e => setCity(e.target.value)} placeholder="Search destinations..."
          className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-foreground min-w-0" />
        <button onClick={doSearch} className="bg-primary text-primary-foreground rounded-full px-4 h-8 text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0">
          Search
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-background rounded-2xl shadow-2xl p-4 max-w-4xl mx-auto w-full relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
        {/* Location */}
        <div className="relative md:col-span-1">
          <label className="block text-xs font-semibold text-foreground mb-1">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input value={city} onChange={e => { setCity(e.target.value); setShowCities(true); }}
              onFocus={() => setShowCities(true)}
              placeholder="Anywhere in NL"
              className="w-full pl-9 pr-8 py-3 text-sm border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background transition-all" />
            {city && <button onClick={() => setCity("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>}
            {showCities && filtered.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                {filtered.map(c => (
                  <button key={c} onClick={() => { setCity(c); setShowCities(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-primary" />{c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Check-in */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Check-in</label>
          <input type="date" value={checkIn} min={format(new Date(), "yyyy-MM-dd")}
            onChange={e => { setCheckIn(e.target.value); if (!checkOut || checkOut <= e.target.value) setCheckOut(format(addDays(new Date(e.target.value), 3), "yyyy-MM-dd")); }}
            className="w-full px-3 py-3 text-sm border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background transition-all" />
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Check-out</label>
          <input type="date" value={checkOut} min={checkIn || format(new Date(), "yyyy-MM-dd")}
            onChange={e => setCheckOut(e.target.value)}
            className="w-full px-3 py-3 text-sm border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background transition-all" />
        </div>

        {/* Search button */}
        <button onClick={doSearch}
          className="bg-primary text-primary-foreground h-[46px] px-6 rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/25 whitespace-nowrap">
          <Search className="w-4 h-4" /> Search
        </button>
      </div>

      {/* Guests row */}
      <div className="relative mt-3">
        <button onClick={() => setShowGuests(!showGuests)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm hover:border-primary transition-colors">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{adults} guest{adults !== 1 ? "s" : ""}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        {showGuests && (
          <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-xl shadow-xl z-50 p-4 w-64">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold">Guests</p>
                <p className="text-xs text-muted-foreground">Age 2+</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-foreground disabled:opacity-30" disabled={adults === 1}>
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center text-sm font-medium">{adults}</span>
                <button onClick={() => setAdults(adults + 1)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-foreground">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sticky Search (iM from bundle) — appears after 400px scroll ─────────────
function StickySearch() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-md animate-in slide-in-from-top-2 duration-200">
      <div className="container mx-auto px-4 py-2">
        <SearchBar variant="sticky" />
      </div>
    </div>
  );
}

// ─── PropertyCard (minimal, for horizontal carousels) ────────────────────────
function PropertyCard({ listing }: { listing: typeof DEMO_LISTINGS[0] }) {
  return (
    <Link to={`/listing/${listing.id}`}
      className="min-w-[240px] max-w-[240px] snap-start rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow group block">
      <div className="h-40 overflow-hidden relative">
        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-3">
        <p className="text-xs text-muted-foreground">{listing.type} · {listing.city}</p>
        <h3 className="font-semibold text-sm text-foreground mt-0.5 line-clamp-1">{listing.title}</h3>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span className="text-xs font-medium">{listing.rating}</span>
            <span className="text-xs text-muted-foreground">({listing.reviews})</span>
          </div>
          <p className="text-sm font-bold text-foreground">€{listing.price}<span className="text-xs font-normal text-muted-foreground"> / night</span></p>
        </div>
      </div>
    </Link>
  );
}

// ─── Section: Hero ────────────────────────────────────────────────────────────
function HeroSection() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const INTERVAL = 4000;

  const next = () => setSlide(s => (s + 1) % HERO_SLIDES.length);
  const prev = () => setSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    if (paused || HERO_SLIDES.length <= 1) return;
    const t = setInterval(next, INTERVAL);
    return () => clearInterval(t);
  }, [paused, slide]);

  return (
    <section className="relative overflow-hidden"
      style={{ background: "var(--hero-gradient, hsl(222 47% 10%))" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      {/* Slides */}
      {HERO_SLIDES.map((src, i) => (
        <div key={src}
          className={cn("absolute inset-0 transition-opacity duration-700", i === slide ? "opacity-100" : "opacity-0")}
          style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      ))}
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Prev/Next arrows */}
      {HERO_SLIDES.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/30 hover:bg-background/50 flex items-center justify-center text-white transition-colors"
            aria-label="Previous slide">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/30 hover:bg-background/50 flex items-center justify-center text-white transition-colors"
            aria-label="Next slide">
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Slide dots */}
      {HERO_SLIDES.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => { setSlide(i); setPaused(true); }}
              className={cn("w-2.5 h-2.5 rounded-full transition-colors", i === slide ? "bg-primary" : "bg-primary/30")}
              aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-16 md:py-24">
        {/* Headline — EXACT from bundle */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-secondary-foreground leading-tight mb-4">
            Find unique places across the{" "}
            <span className="text-primary">Netherlands</span>
          </h1>
          <p className="text-base md:text-lg text-secondary-foreground/80 max-w-xl mx-auto">
            Stay in authentic properties, book quickly and securely.
          </p>
        </div>

        {/* Search bar */}
        <SearchBar variant="hero" />

        {/* Trust bar items — sM array from bundle */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-8">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-secondary-foreground/70">
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-xs md:text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Property listings carousels (city-based) ───────────────────────
function ListingsCarousel({ title, subtitle, listings, viewAllLink }: {
  title: string; subtitle: string;
  listings: typeof DEMO_LISTINGS; viewAllLink: string;
}) {
  const navigate = useNavigate();
  const { ref, scroll } = useHScroll();
  return (
    <section className="container mx-auto px-4 pt-12 pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => scroll(-1)}
            className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll(1)}
            className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {listings.map(l => <PropertyCard key={l.id} listing={l} />)}
      </div>
      <div className="mt-4">
        <button onClick={() => navigate(viewAllLink)}
          className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
          Show all stays <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </section>
  );
}

// ─── Section: Pillars (One platform. Four pillars.) ──────────────────────────
function PillarsSection() {
  return (
    <section className="py-20 bg-background scroll-mt-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-12">
          One platform. Four pillars.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map(p => (
            <div key={p.title}
              className="bg-card rounded-xl border border-border p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
              <img src={p.icon} alt={p.title} className="w-28 h-28 object-contain mb-5" />
              <h3 className="font-heading font-bold text-foreground text-lg mb-2">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Host pitch — "Own a property? List it in 2 minutes." ───────────
function HostPitchSection() {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 md:p-12 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          {/* "For property owners" pill */}
          <div className="inline-flex items-center gap-2 bg-white/15 text-white rounded-full px-3 py-1 text-xs font-semibold mb-4">
            <Building2 className="h-3.5 w-3.5" /> For property owners
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white mb-3">
            Own a property? List it in 2 minutes.
          </h2>
          <p className="text-white/90 text-base md:text-lg mb-6">
            Join Bnb Circle as a partner. Free signup, no monthly fees, you're in control of your calendar and prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate("/signup?as=host")}
              className="inline-flex items-center justify-center h-11 px-8 rounded-md text-sm font-semibold bg-white text-primary hover:bg-white/90 transition-colors">
              Become a Host <ArrowRight className="h-4 w-4 ml-2" />
            </button>
            <button onClick={() => navigate("/pillar/host")}
              className="inline-flex items-center justify-center h-11 px-8 rounded-md text-sm font-semibold text-white hover:bg-white/10 transition-colors border border-white/20">
              Learn more
            </button>
          </div>
          {/* 3 trust items below buttons */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm text-white/90">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Free to list</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Verified guests</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Secure payouts</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: "Founding Owners Wanted" ───────────────────────────────────────
function FoundingOwnersSection() {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 overflow-hidden" style={{ background: "hsl(222 47% 15%)" }}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url(${cityscapeBg})`, backgroundSize: "cover", backgroundPosition: "center bottom" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Founding Owners Wanted</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-6" />
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Join our select group of founding owners in Amsterdam and shape the future of BnbCircle.
          </p>
          <ul className="space-y-3 mb-8 inline-block text-left">
            {["No fee to join", "Preferential management terms", "Early access & exclusive benefits"].map(b => (
              <li key={b} className="flex items-center gap-3 text-white">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="font-medium">{b}</span>
              </li>
            ))}
          </ul>
          <div>
            <button onClick={() => navigate("/signup?role=host")}
              className="bg-primary text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 active:scale-95 transition-all shadow-xl">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: "Travelling for..." ────────────────────────────────────────────
function TravellingForSection() {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">Travelling for...</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {TRAVEL_INTENTS.map(item => (
          <div key={item.intent}
            className="group cursor-pointer rounded-xl overflow-hidden relative shadow-md hover:shadow-lg transition-all duration-300"
            style={{ paddingBottom: "133%" }}
            onClick={() => navigate(`/search?intent=${item.intent}`)}>
            <img src={item.image} alt={item.label}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute bottom-4 left-4 right-4 text-sm font-bold text-white">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Section: Property types ──────────────────────────────────────────────────
function PropertyTypesSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">Property types</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PROPERTY_TYPES.map(pt => {
            const Icon = pt.icon;
            return (
              <div key={pt.type}
                className="group cursor-pointer rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all duration-200"
                onClick={() => navigate(`/search?type=${pt.type}`)}>
                <div className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{pt.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Top Rated (horizontal scroll carousel) ─────────────────────────
function TopRatedSection() {
  const { ref, scroll } = useHScroll();
  const topRated = DEMO_LISTINGS.filter(l => l.rating >= 4.8);
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-primary text-primary" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold">Top Rated</h2>
        </div>
        <div className="flex gap-1">
          <button onClick={() => scroll(-1)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll(1)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {topRated.map(l => <PropertyCard key={l.id} listing={l} />)}
      </div>
    </section>
  );
}

// ─── Section: Testimonials — "What guests say" (AM from bundle) ───────────────
function TestimonialsSection() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-10">What guests say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6">
              <Quote className="w-8 h-8 text-primary/30 mb-3" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-foreground mb-4 leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.city} · {t.stayType}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: New on BnbCircle (horizontal scroll) ───────────────────────────
function NewOnBnbCircleSection() {
  const { ref, scroll } = useHScroll();
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl md:text-3xl font-bold">New on BnbCircle</h2>
        <div className="flex gap-1">
          <button onClick={() => scroll(-1)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => scroll(1)} className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {DEMO_LISTINGS.slice(0, 8).map(l => <PropertyCard key={l.id} listing={l} />)}
      </div>
    </section>
  );
}

// ─── Section: Popular destinations ────────────────────────────────────────────
function PopularDestinationsSection() {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">Popular destinations</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {POPULAR_DESTINATIONS.map(dest => (
          <div
            key={dest.name}
            onClick={() => dest.active && navigate(`/search?q=${dest.name}`)}
            className={cn(
              "group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-200",
              dest.active
                ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                : "cursor-default",
            )}
          >
            {/* Image */}
            <div className="relative h-[130px] overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-300",
                  dest.active
                    ? "group-hover:scale-105"
                    : "grayscale brightness-75",
                )}
              />
              {/* Coming Soon overlay on inactive */}
              {!dest.active && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-md border border-white/30 tracking-wide">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
            {/* City name bar */}
            <div className="px-3 py-2.5 bg-white">
              <p className="text-sm font-semibold text-gray-800">{dest.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Section: Host pitch bottom — "Own a property? Earn more with BnbCircle" ─
function HostPitchBottomSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-secondary-foreground mb-2">
              Own a property? Earn more with{" "}
              <span className="text-primary">BnbCircle</span>
            </h2>
            <ul className="space-y-3 my-6">
              {[
                "Full control over your calendar and pricing",
                "Availability sync with other platforms",
                "Safe and fast payments",
                "Direct messaging with guests",
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-secondary-foreground/80 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate("/signup?role=host")}
              className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all shadow-lg inline-flex items-center gap-2">
              List your property <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {/* Dashboard preview card */}
          <div className="flex-1 max-w-sm">
            <div className="bg-card rounded-2xl shadow-2xl p-6 border border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-4">Host Dashboard</p>
              <p className="font-heading font-bold text-lg text-foreground mb-4">Overview</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-2xl font-bold text-primary">87%</p>
                  <p className="text-xs text-muted-foreground mt-1">Occupancy</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-2xl font-bold text-foreground">€3,240</p>
                  <p className="text-xs text-muted-foreground mt-1">Monthly Revenue</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-xs text-muted-foreground mt-1">Check-ins</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-2xl font-bold text-foreground">4.9</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg rating</p>
                </div>
              </div>
              <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "87%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: How It Works ────────────────────────────────────────────────────
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-muted/50 scroll-mt-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { num: "1", title: "Share your property details" },
            { num: "2", title: "We check compliance & set up management" },
            { num: "3", title: "We manage everything for you" },
          ].map(step => (
            <div key={step.num} className="bg-card rounded-xl border border-border p-8 flex items-start gap-4">
              <span className="text-3xl font-heading font-extrabold text-primary shrink-0">{step.num}.</span>
              <p className="text-foreground font-medium text-left text-base mt-1">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── MAIN EXPORT — exact section order from fM() in bundle ───────────────────
export default function Home() {
  const amsterdam = DEMO_LISTINGS.filter(l => l.city === "Amsterdam");
  const rotterdam = DEMO_LISTINGS.filter(l => l.city === "Rotterdam");
  const utrecht   = DEMO_LISTINGS.filter(l => l.city === "Utrecht");

  return (
    <>
      <SEO
        title="Vacation Rentals in the Netherlands"
        description="Discover handpicked short-term rentals from trusted Dutch hosts. 0% host commission, verified properties, instant booking."
      />
      {/* StickySearch moved to SiteHeader (compact search pill on scroll) */}

      {/* 1. Hero with search + trust items */}
      <HeroSection />

      {/* 2. City carousel — Amsterdam only (others hidden until populated) */}
      {amsterdam.length > 0 && (
        <ListingsCarousel title="Available this weekend in Amsterdam" subtitle="Book now for a spontaneous getaway"
          listings={amsterdam} viewAllLink="/search?q=Amsterdam" />
      )}

      {/* 3. Pillars */}
      <PillarsSection />

      {/* 4. How it works */}
      <HowItWorksSection />

      {/* 5. Host pitch banner (orange) */}
      <HostPitchSection />

      {/* 6. Founding owners CTA */}
      <FoundingOwnersSection />

      {/* 7. Travelling for... */}
      <TravellingForSection />

      {/* 8. Property types */}
      <PropertyTypesSection />

      {/* 9. Top Rated */}
      <TopRatedSection />

      {/* 10. What guests say */}
      <TestimonialsSection />

      {/* 11. New on BnbCircle */}
      <NewOnBnbCircleSection />

      {/* 12. Popular destinations */}
      <PopularDestinationsSection />

      {/* 13. Own a property — bottom section with dashboard preview */}
      <HostPitchBottomSection />
    </>
  );
}
