/**
 * MapSearch.tsx
 * Full-screen map search: left panel list + right map (Google Maps or styled fallback).
 * Detects VITE_GOOGLE_MAPS_API_KEY at runtime — renders real map or beautiful placeholder.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  MapPin,
  List,
  Map as MapIcon,
  BedDouble,
  Users,
  X,
  ExternalLink,
} from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { cn, formatEUR } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MapListing {
  id: string;
  title: string;
  city: string;
  price_per_night: number;
  avg_rating: number;
  review_count: number;
  bedrooms: number;
  max_guests: number;
  property_type: string;
  instant_book: boolean;
  lat: number;
  lng: number;
  image: string;
}

// ─── Demo Data ─────────────────────────────────────────────────────────────────

const DEMO_LISTINGS: MapListing[] = [
  {
    id: "1",
    title: "Charming Canal House in Amsterdam Centre",
    city: "Amsterdam",
    price_per_night: 185,
    avg_rating: 4.9,
    review_count: 47,
    bedrooms: 3,
    max_guests: 6,
    property_type: "House",
    instant_book: true,
    lat: 52.374,
    lng: 4.901,
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=280&fit=crop",
  },
  {
    id: "2",
    title: "Modern Apartment near Vondelpark",
    city: "Amsterdam",
    price_per_night: 95,
    avg_rating: 4.7,
    review_count: 89,
    bedrooms: 1,
    max_guests: 2,
    property_type: "Apartment",
    instant_book: true,
    lat: 52.358,
    lng: 4.869,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=280&fit=crop",
  },
  {
    id: "3",
    title: "Luxury Villa with Private Pool, Zeeland",
    city: "Middelburg",
    price_per_night: 420,
    avg_rating: 5.0,
    review_count: 23,
    bedrooms: 5,
    max_guests: 10,
    property_type: "Villa",
    instant_book: false,
    lat: 51.499,
    lng: 3.611,
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=280&fit=crop",
  },
  {
    id: "4",
    title: "Cosy Studio in The Hague Historic Centre",
    city: "The Hague",
    price_per_night: 75,
    avg_rating: 4.6,
    review_count: 134,
    bedrooms: 0,
    max_guests: 2,
    property_type: "Studio",
    instant_book: true,
    lat: 52.071,
    lng: 4.301,
    image:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=280&fit=crop",
  },
  {
    id: "5",
    title: "Rustic Cabin in the Veluwe Forest",
    city: "Arnhem",
    price_per_night: 110,
    avg_rating: 4.8,
    review_count: 61,
    bedrooms: 2,
    max_guests: 4,
    property_type: "Cabin",
    instant_book: false,
    lat: 51.984,
    lng: 5.909,
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&h=280&fit=crop",
  },
  {
    id: "6",
    title: "Modern House with Garden, Utrecht",
    city: "Utrecht",
    price_per_night: 195,
    avg_rating: 4.9,
    review_count: 38,
    bedrooms: 4,
    max_guests: 8,
    property_type: "House",
    instant_book: true,
    lat: 52.091,
    lng: 5.12,
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=280&fit=crop",
  },
];

// Pixel positions for the decorative fallback map (% of container)
const FALLBACK_PILL_POSITIONS: Record<string, { x: string; y: string }> = {
  "1": { x: "38%", y: "22%" }, // Amsterdam Canal
  "2": { x: "34%", y: "28%" }, // Amsterdam Vondelpark
  "3": { x: "22%", y: "68%" }, // Middelburg
  "4": { x: "30%", y: "45%" }, // The Hague
  "5": { x: "62%", y: "35%" }, // Arnhem
  "6": { x: "52%", y: "40%" }, // Utrecht
};

// ─── Google Maps helpers ───────────────────────────────────────────────────────

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
const HAS_API_KEY = Boolean(MAPS_API_KEY && MAPS_API_KEY.length > 10);

// Map center: Netherlands centroid
const NL_CENTER = { lat: 52.15, lng: 4.8 };

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps?: () => void;
  }
}

// ─── Subcomponents ─────────────────────────────────────────────────────────────

/** Info popup that appears above a selected marker */
function MarkerPopup({
  listing,
  onClose,
}: {
  listing: MapListing;
  onClose: () => void;
}) {
  return (
    <div className="absolute z-50 w-64 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-border overflow-hidden pointer-events-auto">
      {/* Image */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-primary text-[10px] font-semibold">
          {listing.property_type}
        </span>
        {listing.instant_book && (
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
            Instant
          </span>
        )}
      </div>
      {/* Content */}
      <div className="p-3">
        <p className="text-xs font-semibold text-foreground line-clamp-2 mb-1">
          {listing.title}
        </p>
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">{listing.city}</span>
          <div className="flex items-center gap-0.5 ml-auto">
            <Star className="w-3 h-3 star-filled" />
            <span className="text-[11px] font-semibold">{listing.avg_rating.toFixed(1)}</span>
            <span className="text-[11px] text-muted-foreground">({listing.review_count})</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <BedDouble className="w-3 h-3" />
            {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} beds`}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            Up to {listing.max_guests}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-primary">
              {formatEUR(listing.price_per_night)}
            </span>
            <span className="text-[11px] text-muted-foreground ml-1">/ night</span>
          </div>
          <Link
            to={`/listing/${listing.id}`}
            className="flex items-center gap-1 btn-primary text-xs px-3 py-1.5 rounded-lg"
          >
            View <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Single listing card in the left sidebar */
function ListingCard({
  listing,
  isHighlighted,
  onHover,
  onClick,
}: {
  listing: MapListing;
  isHighlighted: boolean;
  onHover: (id: string | null) => void;
  onClick: (listing: MapListing) => void;
}) {
  return (
    <button
      onClick={() => onClick(listing)}
      onMouseEnter={() => onHover(listing.id)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "w-full text-left flex gap-3 p-2.5 rounded-xl transition-all duration-150 group",
        isHighlighted
          ? "bg-accent/8 ring-1 ring-accent/30 shadow-sm"
          : "hover:bg-muted/60"
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-[72px] rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {listing.instant_book && (
          <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-emerald-400 border border-white" />
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-xs font-semibold line-clamp-2 transition-colors leading-snug mb-0.5",
            isHighlighted ? "text-accent" : "text-foreground group-hover:text-accent"
          )}
        >
          {listing.title}
        </p>
        <p className="text-[11px] text-muted-foreground flex items-center gap-0.5 mb-1">
          <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
          {listing.city}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary">
            {formatEUR(listing.price_per_night)}
            <span className="font-normal text-muted-foreground text-[10px]">/nt</span>
          </span>
          <div className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 star-filled" />
            <span className="text-[11px] font-semibold">{listing.avg_rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Google Maps Component ────────────────────────────────────────────────────

function GoogleMapView({
  listings,
  selectedId,
  hoveredId,
  onSelectListing,
}: {
  listings: MapListing[];
  selectedId: string | null;
  hoveredId: string | null;
  onSelectListing: (listing: MapListing | null) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement | google.maps.Marker>>(new Map());
  const [mapReady, setMapReady] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) {
      setMapReady(true);
      return;
    }
    const scriptId = "google-maps-script";
    if (document.getElementById(scriptId)) return;

    window.initGoogleMaps = () => setMapReady(true);
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&callback=initGoogleMaps&libraries=marker`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    return () => {
      delete window.initGoogleMaps;
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapReady || !mapRef.current || mapInstanceRef.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: NL_CENTER,
      zoom: 8,
      disableDefaultUI: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "simplified" }] },
      ],
    });
    mapInstanceRef.current = map;

    // Create price-pill markers
    listings.forEach((listing) => {
      const pillEl = document.createElement("div");
      pillEl.className = "map-price-pill";
      pillEl.textContent = `€${listing.price_per_night}`;
      pillEl.dataset.listingId = listing.id;

      let marker: google.maps.marker.AdvancedMarkerElement | google.maps.Marker;

      try {
        // Try AdvancedMarkerElement (newer API)
        marker = new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: listing.lat, lng: listing.lng },
          content: pillEl,
          title: listing.title,
        });
        (marker as google.maps.marker.AdvancedMarkerElement).addListener("click", () => {
          onSelectListing(listing);
          map.panTo({ lat: listing.lat, lng: listing.lng });
        });
      } catch {
        // Fallback to classic Marker with label
        marker = new window.google.maps.Marker({
          map,
          position: { lat: listing.lat, lng: listing.lng },
          label: {
            text: `€${listing.price_per_night}`,
            color: "#0B1F3A",
            fontWeight: "700",
            fontSize: "12px",
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 0,
          },
          title: listing.title,
        });
        (marker as google.maps.Marker).addListener("click", () => {
          onSelectListing(listing);
          map.panTo({ lat: listing.lat, lng: listing.lng });
        });
      }

      markersRef.current.set(listing.id, marker);
    });

    // Close popup on map click
    map.addListener("click", () => onSelectListing(null));
  }, [mapReady, listings, onSelectListing]);

  // Update marker visual states
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const isActive = id === selectedId || id === hoveredId;
      // Update pill element class if AdvancedMarker
      if ((marker as google.maps.marker.AdvancedMarkerElement).content) {
        const el = (marker as google.maps.marker.AdvancedMarkerElement).content as HTMLElement;
        if (isActive) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      }
    });
  }, [selectedId, hoveredId]);

  // Pan to selected listing
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedId) return;
    const listing = listings.find((l) => l.id === selectedId);
    if (listing) {
      mapInstanceRef.current.panTo({ lat: listing.lat, lng: listing.lng });
    }
  }, [selectedId, listings]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/60">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-accent border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Loading map…</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Fallback Map (no API key) ────────────────────────────────────────────────

function FallbackMap({
  listings,
  selectedId,
  hoveredId,
  onSelectListing,
}: {
  listings: MapListing[];
  selectedId: string | null;
  hoveredId: string | null;
  onSelectListing: (listing: MapListing | null) => void;
}) {
  const selectedListing = listings.find((l) => l.id === selectedId);

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-[#0B1F3A] cursor-crosshair"
      onClick={(e) => {
        if (e.target === e.currentTarget) onSelectListing(null);
      }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Stylised "land" blobs */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.12]"
        preserveAspectRatio="none"
        viewBox="0 0 800 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Netherlands rough silhouette */}
        <path
          d="M200,140 L340,100 L480,120 L560,180 L580,280 L520,380 L460,460 L380,500 L280,480 L200,420 L160,320 L140,220 Z"
          fill="#1a3a5c"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />
        {/* Water bodies */}
        <ellipse cx="400" cy="200" rx="60" ry="30" fill="#0B1F3A" opacity="0.6" />
        <path d="M160,300 Q200,260 240,300 Q200,340 160,300Z" fill="#0B2540" opacity="0.7" />
        {/* Roads */}
        <path d="M250,150 L380,250 L480,380 L540,460" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
        <path d="M200,300 L350,300 L480,280" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" />
      </svg>

      {/* River / coast shimmer */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 35% 50%, rgba(100,180,255,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(11,31,58,0.7) 100%)",
        }}
      />

      {/* Floating city labels */}
      {[
        { label: "Amsterdam", x: "36%", y: "20%" },
        { label: "The Hague", x: "29%", y: "43%" },
        { label: "Utrecht", x: "51%", y: "38%" },
        { label: "Arnhem", x: "61%", y: "33%" },
        { label: "Middelburg", x: "21%", y: "66%" },
      ].map((city) => (
        <span
          key={city.label}
          className="absolute text-[10px] font-semibold text-white/30 pointer-events-none uppercase tracking-widest"
          style={{ left: city.x, top: city.y, transform: "translate(-50%, -50%)" }}
        >
          {city.label}
        </span>
      ))}

      {/* Price pills */}
      {listings.map((listing) => {
        const pos = FALLBACK_PILL_POSITIONS[listing.id];
        if (!pos) return null;
        const isActive = listing.id === selectedId || listing.id === hoveredId;
        return (
          <button
            key={listing.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectListing(listing.id === selectedId ? null : listing);
            }}
            className={cn(
              "map-price-pill absolute z-20 transition-all duration-150",
              isActive && "active scale-110"
            )}
            style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
          >
            {formatEUR(listing.price_per_night)}
          </button>
        );
      })}

      {/* Info popup anchored near the selected pill */}
      {selectedListing && (() => {
        const pos = FALLBACK_PILL_POSITIONS[selectedListing.id];
        if (!pos) return null;
        // Flip popup above/below/left/right based on position
        const topNum = parseFloat(pos.y);
        const leftNum = parseFloat(pos.x);
        const popupStyle: React.CSSProperties = {
          position: "absolute",
          left: leftNum > 55 ? undefined : pos.x,
          right: leftNum > 55 ? `${100 - leftNum}%` : undefined,
          top: topNum > 55 ? undefined : `calc(${pos.y} + 24px)`,
          bottom: topNum > 55 ? `calc(${100 - topNum}% + 24px)` : undefined,
          transform: leftNum > 55 ? "translateX(0)" : "translateX(-10%)",
          zIndex: 30,
        };
        return (
          <div style={popupStyle}>
            <MarkerPopup
              listing={selectedListing}
              onClose={() => onSelectListing(null)}
            />
          </div>
        );
      })()}

      {/* No API key notice */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70 text-xs">
          <MapIcon className="w-3.5 h-3.5" />
          Add{" "}
          <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono">
            VITE_GOOGLE_MAPS_API_KEY
          </code>{" "}
          to enable real maps
        </div>
      </div>
    </div>
  );
}

// ─── Real Google Maps Info Window overlay ─────────────────────────────────────
// (Rendered via portal-like approach as sibling to map, positioned by state)

function GoogleMapsPopupOverlay({
  listing,
  onClose,
}: {
  listing: MapListing | null;
  onClose: () => void;
}) {
  if (!listing) return null;
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-64">
      <div className="pointer-events-auto">
        <MarkerPopup listing={listing} onClose={onClose} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MapSearch() {
  const [selectedListing, setSelectedListing] = useState<MapListing | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // When a listing is selected (from map click), scroll its card into view
  useEffect(() => {
    if (!selectedListing) return;
    const el = cardRefs.current.get(selectedListing.id);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedListing]);

  const handleSelectListing = useCallback((listing: MapListing | null) => {
    setSelectedListing(listing);
  }, []);

  return (
    <div className="pt-16 h-screen flex flex-col overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="flex-shrink-0 bg-white border-b border-border px-4 py-2.5 flex items-center gap-3 z-20 shadow-sm">
        {/* Compact SearchBar */}
        <div className="flex-1 min-w-0 max-w-lg">
          <SearchBar compact className="w-full" />
        </div>

        {/* List view link (desktop) */}
        <Link
          to="/search"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-border text-sm font-semibold text-foreground hover:border-accent hover:text-accent transition-all duration-150"
        >
          <List className="w-4 h-4" />
          List view
        </Link>

        {/* Mobile view toggle */}
        <button
          onClick={() => setMobileView((v) => (v === "list" ? "map" : "list"))}
          className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold"
        >
          {mobileView === "list" ? (
            <>
              <MapIcon className="w-4 h-4" /> Show map
            </>
          ) : (
            <>
              <List className="w-4 h-4" /> Show list
            </>
          )}
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Panel: Listing cards ── */}
        <aside
          className={cn(
            "w-full md:w-80 flex-shrink-0 bg-white border-r border-border overflow-y-auto",
            // Mobile: show/hide based on toggle
            mobileView === "list" ? "block" : "hidden md:block"
          )}
        >
          <div className="p-3">
            <p className="text-xs font-semibold text-muted-foreground px-1 mb-3">
              {DEMO_LISTINGS.length} properties in this area
            </p>
            <div className="space-y-1">
              {DEMO_LISTINGS.map((listing) => (
                <div
                  key={listing.id}
                  ref={(el) => {
                    if (el) cardRefs.current.set(listing.id, el);
                  }}
                >
                  <ListingCard
                    listing={listing}
                    isHighlighted={
                      listing.id === selectedListing?.id ||
                      listing.id === hoveredId
                    }
                    onHover={setHoveredId}
                    onClick={(l) => {
                      setSelectedListing((prev) =>
                        prev?.id === l.id ? null : l
                      );
                      setMobileView("map");
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Right Panel: Map ── */}
        <main
          className={cn(
            "flex-1 relative overflow-hidden",
            mobileView === "map" ? "block" : "hidden md:block"
          )}
        >
          {HAS_API_KEY ? (
            <>
              <GoogleMapView
                listings={DEMO_LISTINGS}
                selectedId={selectedListing?.id ?? null}
                hoveredId={hoveredId}
                onSelectListing={handleSelectListing}
              />
              {/* Info popup overlay for real map */}
              <GoogleMapsPopupOverlay
                listing={selectedListing}
                onClose={() => setSelectedListing(null)}
              />
            </>
          ) : (
            <FallbackMap
              listings={DEMO_LISTINGS}
              selectedId={selectedListing?.id ?? null}
              hoveredId={hoveredId}
              onSelectListing={handleSelectListing}
            />
          )}
        </main>
      </div>
    </div>
  );
}
