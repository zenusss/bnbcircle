import React from "react";
import { Link } from "react-router-dom";
import { Heart, Search } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";

// Reuse demo listings
const DEMO: any[] = [
  {
    id: "1", host_id: "h1", title: "Charming Canal House in Amsterdam Centre",
    slug: "canal-house-amsterdam", description: "", property_type: "house", status: "active",
    city: "Amsterdam", region: "North Holland", country: "Netherlands", postal_code: "1015",
    address: null, latitude: 52.374, longitude: 4.901, bedrooms: 3, bathrooms: 2, max_guests: 6,
    area_sqm: 120, price_per_night: 185, cleaning_fee: 45, service_fee_percent: 12, currency: "EUR",
    min_nights: 2, max_nights: 30, check_in_time: null, check_out_time: null,
    instant_book: true, featured: true, avg_rating: 4.9, review_count: 47,
    created_at: "", updated_at: "",
    images: [{ id: "i1", listing_id: "1", url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "3", host_id: "h3", title: "Luxury Villa with Private Pool, Zeeland",
    slug: "zeeland-villa-pool", description: "", property_type: "villa", status: "active",
    city: "Middelburg", region: "Zeeland", country: "Netherlands", postal_code: "4330",
    address: null, latitude: 51.499, longitude: 3.611, bedrooms: 5, bathrooms: 3, max_guests: 10,
    area_sqm: 280, price_per_night: 420, cleaning_fee: 120, service_fee_percent: 12, currency: "EUR",
    min_nights: 3, max_nights: 21, check_in_time: null, check_out_time: null,
    instant_book: false, featured: true, avg_rating: 5.0, review_count: 23,
    created_at: "", updated_at: "",
    images: [{ id: "i3", listing_id: "3", url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
];

export default function Favorites() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Saved Properties</h1>
        <Link to="/search" className="btn-ghost text-sm"><Search className="w-4 h-4" />Find more</Link>
      </div>

      {DEMO.length === 0 ? (
        <div className="card-base p-16 text-center">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-medium text-foreground mb-2">No saved properties</p>
          <p className="text-sm text-muted-foreground mb-6">Heart any property to save it here for later.</p>
          <Link to="/search" className="btn-primary">Explore properties</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO.map((l) => <PropertyCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
