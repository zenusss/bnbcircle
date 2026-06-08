import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Home, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Location {
  slug: string;
  name: string;
  province: string;
  propertyCount: number;
  /** Exact Unsplash URLs as in the original bnb-circle.com bundle */
  image: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

// ─── Data (images match original site exactly) ────────────────────────────────
const locations: Location[] = [
  {
    slug: "amsterdam",
    name: "Amsterdam",
    province: "Noord-Holland",
    propertyCount: 214,
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop",
    description: "Canal houses, world-class museums, and vibrant neighbourhoods.",
    tags: ["City", "Culture", "Canal"],
    featured: true,
  },
  {
    slug: "rotterdam",
    name: "Rotterdam",
    province: "Zuid-Holland",
    propertyCount: 87,
    image: "https://images.unsplash.com/photo-1543872084-c7bd3822856f?w=400&h=300&fit=crop",
    description: "Bold architecture, Europe's largest port, and a thriving food scene.",
    tags: ["City", "Architecture", "Modern"],
    featured: true,
  },
  {
    slug: "utrecht",
    name: "Utrecht",
    province: "Utrecht",
    propertyCount: 72,
    image: "https://images.unsplash.com/photo-1560463284-17e109d61ad2?w=400&h=300&fit=crop",
    description: "Charming canals, medieval city centre, and a lively university atmosphere.",
    tags: ["City", "Historic", "University"],
    featured: true,
  },
  {
    slug: "den-haag",
    name: "Den Haag",
    province: "Zuid-Holland",
    propertyCount: 64,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
    description: "Seat of government, international law, and proximity to the beach.",
    tags: ["City", "Political", "Coastal"],
  },
  {
    slug: "maastricht",
    name: "Maastricht",
    province: "Limburg",
    propertyCount: 35,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop",
    description: "Romantic city with French flair, Roman ruins, and fine dining.",
    tags: ["City", "Historic", "Romantic"],
  },
  {
    slug: "groningen",
    name: "Groningen",
    province: "Groningen",
    propertyCount: 41,
    image: "https://images.unsplash.com/photo-1555990793-da11153b2473?w=400&h=300&fit=crop",
    description: "Dynamic student city with a vibrant nightlife and the Martini tower.",
    tags: ["City", "University", "Culture"],
  },
  {
    slug: "eindhoven",
    name: "Eindhoven",
    province: "Noord-Brabant",
    propertyCount: 29,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
    description: "Design capital of the Netherlands, home to Philips and STRP festival.",
    tags: ["City", "Design", "Tech"],
  },
  {
    slug: "haarlem",
    name: "Haarlem",
    province: "Noord-Holland",
    propertyCount: 48,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    description: "Flower market, medieval centre, and 20 minutes from Amsterdam.",
    tags: ["City", "Historic", "Flowers"],
  },
  {
    slug: "leiden",
    name: "Leiden",
    province: "Zuid-Holland",
    propertyCount: 39,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
    description: "Home of Rembrandt, a prestigious university, and lovely canals.",
    tags: ["City", "Historic", "University"],
  },
  {
    slug: "delft",
    name: "Delft",
    province: "Zuid-Holland",
    propertyCount: 33,
    image: "https://images.unsplash.com/photo-1596568817847-04db19ceeed2?w=400&h=300&fit=crop",
    description: "Famous blue ceramics, gothic churches, and photo-perfect canals.",
    tags: ["City", "Historic", "Ceramics"],
  },
  {
    slug: "arnhem",
    name: "Arnhem",
    province: "Gelderland",
    propertyCount: 22,
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&h=300&fit=crop",
    description: "Gateway to the Veluwe, fashion hotspot, and WWII history.",
    tags: ["Nature", "History", "Fashion"],
  },
  {
    slug: "nijmegen",
    name: "Nijmegen",
    province: "Gelderland",
    propertyCount: 18,
    image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&h=300&fit=crop",
    description: "Oldest city in the Netherlands, on the banks of the Waal.",
    tags: ["City", "Historic", "River"],
  },
  {
    slug: "zandvoort",
    name: "Zandvoort",
    province: "Noord-Holland",
    propertyCount: 54,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    description: "Sandy beaches, Formula 1 circuit, and easy access from Amsterdam.",
    tags: ["Beach", "Coastal", "Sports"],
    featured: true,
  },
  {
    slug: "zeeland",
    name: "Zeeland",
    province: "Zeeland",
    propertyCount: 78,
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop",
    description: "Stunning coastline, world-class beaches, and fresh seafood.",
    tags: ["Beach", "Nature", "Coastal"],
    featured: true,
  },
  {
    slug: "texel",
    name: "Texel",
    province: "Noord-Holland",
    propertyCount: 43,
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=300&fit=crop",
    description: "Largest Wadden Island, bird paradise, and unspoiled natural beauty.",
    tags: ["Nature", "Island", "Beaches"],
  },
  {
    slug: "friesland",
    name: "Friesland",
    province: "Friesland",
    propertyCount: 61,
    image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&h=300&fit=crop",
    description: "Lakes, windmills, Elfstedentocht tradition, and Frisian culture.",
    tags: ["Nature", "Lakes", "Culture"],
  },
  {
    slug: "veluwe",
    name: "Veluwe",
    province: "Gelderland",
    propertyCount: 89,
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop",
    description: "Largest nature reserve in the Netherlands — forests, heathlands, and deer.",
    tags: ["Nature", "Forest", "Hiking"],
    featured: true,
  },
  {
    slug: "giethoorn",
    name: "Giethoorn",
    province: "Overijssel",
    propertyCount: 26,
    image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=400&h=300&fit=crop",
    description: "The Venice of the Netherlands — punting canals, thatched roofs, and serenity.",
    tags: ["Village", "Canals", "Romantic"],
  },
  {
    slug: "lisse",
    name: "Lisse / Keukenhof",
    province: "Zuid-Holland",
    propertyCount: 17,
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=300&fit=crop",
    description: "Fields of tulips, the world-famous Keukenhof gardens, and flower auctions.",
    tags: ["Flowers", "Spring", "Nature"],
  },
  {
    slug: "breda",
    name: "Breda",
    province: "Noord-Brabant",
    propertyCount: 24,
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=300&fit=crop",
    description: "Medieval castle, craft beers, and a vibrant market square.",
    tags: ["City", "Historic", "Beer"],
  },
];

// Collect unique tags for filter pill bar
const allTags = [...new Set(locations.flatMap((l) => l.tags))].sort();

// ─── Location card ────────────────────────────────────────────────────────────
interface LocationCardProps {
  loc: Location;
  large?: boolean;
  onClick: (name: string) => void;
}

function LocationCard({ loc, large = false, onClick }: LocationCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(loc.name)}
      className="group card-base overflow-hidden hover:-translate-y-1 transition-transform block text-left w-full"
    >
      {/* Image */}
      <div className={cn("relative overflow-hidden", large ? "h-52" : "h-36")}>
        <img
          src={loc.image}
          alt={loc.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Name + province overlay */}
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="font-bold text-white text-lg leading-tight">{loc.name}</h3>
          <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
            <MapPin className="w-3 h-3" />
            {loc.province}
          </div>
        </div>

        {/* Property count badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-primary text-xs font-semibold shadow">
            <Home className="w-3 h-3" />
            {loc.propertyCount}
          </span>
        </div>
      </div>

      {/* Description + tags (large cards only) */}
      {large && (
        <div className="p-4">
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{loc.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {loc.tags.map((tag) => (
              <span key={tag} className="badge-accent text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Locations() {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);

  // Navigate to search with the city as the query
  const handleCityClick = (cityName: string) => {
    navigate(`/search?q=${encodeURIComponent(cityName)}`);
  };

  const filtered = locations.filter((loc) => {
    const matchesSearch =
      !search.trim() ||
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.province.toLowerCase().includes(search.toLowerCase()) ||
      loc.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesTag = !selectedTag || loc.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const featured = filtered.filter((l) => l.featured);
  const rest = filtered.filter((l) => !l.featured);
  const totalProperties = locations.reduce((sum, l) => sum + l.propertyCount, 0);
  const showingFiltered = search.trim() || selectedTag;

  return (
    <div className="pt-16 md:pt-20">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="section-container text-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#C96A3E] mb-3">
            Destinations
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-6">
            Explore the Netherlands
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Find the perfect stay in any Dutch city.
          </p>

          {/* Search input */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search destinations or property types…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C96A3E]/60 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ── Tag filter bar ────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-white sticky top-16 md:top-20 z-20">
        <div className="section-container py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              onClick={() => setSelectedTag(null)}
              className={cn(
                "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
                !selectedTag
                  ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                  : "text-muted-foreground border-border hover:border-[#0B1F3A] hover:text-[#0B1F3A]"
              )}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={cn(
                  "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
                  selectedTag === tag
                    ? "bg-[#C96A3E] text-white border-[#C96A3E]"
                    : "text-muted-foreground border-border hover:border-[#C96A3E] hover:text-[#C96A3E]"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grid ──────────────────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="section-container">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-primary mb-2">No destinations found</h3>
              <p className="text-sm text-muted-foreground">
                Try a different search term or clear your filters.
              </p>
            </div>
          ) : (
            <>
              {/* Featured destinations */}
              {featured.length > 0 && !showingFiltered && (
                <div className="mb-14">
                  <div className="flex items-center gap-2 mb-8">
                    <TrendingUp className="w-5 h-5 text-[#C96A3E]" />
                    <h2 className="text-xl font-bold text-[#0B1F3A]">Popular destinations</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map((loc) => (
                      <LocationCard key={loc.slug} loc={loc} large onClick={handleCityClick} />
                    ))}
                  </div>
                </div>
              )}

              {/* All / filtered destinations */}
              <div>
                {!showingFiltered && (
                  <h2 className="text-xl font-bold text-[#0B1F3A] mb-8">All destinations</h2>
                )}
                {showingFiltered && (
                  <p className="text-sm text-muted-foreground mb-6">
                    {filtered.length} destination{filtered.length !== 1 && "s"} found
                  </p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(showingFiltered ? filtered : rest).map((loc) => (
                    <LocationCard key={loc.slug} loc={loc} onClick={handleCityClick} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Map CTA ───────────────────────────────────────────────────────── */}
      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="card-base p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0B1F3A] mb-2">
                Prefer exploring on a map?
              </h2>
              <p className="text-muted-foreground">
                Browse properties on our interactive map and find stays exactly where you want to be.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a href="/map" className="btn-primary">
                Open Map <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/search" className="btn-outline">
                Search Listings
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
