import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Users, BedDouble } from "lucide-react";
import { cn, formatEUR, PROPERTY_TYPE_LABELS } from "@/lib/utils";
import type { Listing, ListingImage } from "@/integrations/supabase/types";

interface PropertyCardProps {
  listing: Listing & { images?: ListingImage[] };
  highlighted?: boolean;
  onHover?: (id: string | null) => void;
  className?: string;
}

export function PropertyCard({ listing, highlighted, onHover, className }: PropertyCardProps) {
  const coverImage = listing.images?.find((i) => i.is_cover) || listing.images?.[0];
  const displayImage = coverImage?.url || `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop&auto=format`;

  return (
    <Link
      to={`/listing/${listing.id}`}
      className={cn(
        "group card-hover block",
        highlighted && "ring-2 ring-accent shadow-orange-glow",
        className
      )}
      onMouseEnter={() => onHover?.(listing.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl aspect-[4/3]">
        <img
          src={displayImage}
          alt={listing.title}
          className="property-card-img absolute inset-0 w-full h-full"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {listing.featured && (
            <span className="px-2.5 py-1 rounded-full bg-accent text-white text-xs font-bold shadow">
              Featured
            </span>
          )}
          {listing.instant_book && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow">
              Instant Book
            </span>
          )}
        </div>

        {/* Type badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full bg-white/90 text-primary text-xs font-semibold shadow">
            {PROPERTY_TYPE_LABELS[listing.property_type]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location + Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{listing.city}{listing.region ? `, ${listing.region}` : ""}</span>
          </div>
          {listing.avg_rating && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 star-filled" />
              <span className="text-xs font-semibold text-foreground">{listing.avg_rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({listing.review_count})</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground text-sm leading-snug mb-3 line-clamp-2 group-hover:text-accent transition-colors">
          {listing.title}
        </h3>

        {/* Specs */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5" />
            {listing.bedrooms} {listing.bedrooms === 1 ? "bed" : "beds"}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            Up to {listing.max_guests}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-primary">{formatEUR(listing.price_per_night)}</span>
            <span className="text-xs text-muted-foreground ml-1">/ night</span>
          </div>
          <span className="btn-primary text-xs px-3 py-1.5 rounded-lg">View</span>
        </div>
      </div>
    </Link>
  );
}

// Skeleton loader
export function PropertyCardSkeleton() {
  return (
    <div className="card-base overflow-hidden">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-3 w-12 rounded" />
        </div>
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="flex gap-3">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
        <div className="flex justify-between items-center">
          <div className="skeleton h-6 w-20 rounded" />
          <div className="skeleton h-7 w-14 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
