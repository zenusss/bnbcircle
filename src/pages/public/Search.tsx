import React, { useState, useEffect, useRef } from "react";
import { SEO } from "@/components/SEO";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Search as SearchIcon,
  SlidersHorizontal,
  Map,
  Heart,
  Star,
  Building2,
  MapPin,
  Filter,
  LayoutGrid,
  List,
  X,
  Zap,
  ChevronDown,
} from "lucide-react";
import { PropertyCard, PropertyCardSkeleton } from "@/components/PropertyCard";
import { SearchBar } from "@/components/SearchBar";
import { cn } from "@/lib/utils";

const formatEUR = (n: number) => `â‚¬${n}`;
import type { Listing, ListingImage } from "@/integrations/supabase/types";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type DemoListing = Listing & { images?: ListingImage[] };

// â”€â”€â”€ Demo data: 18 Dutch properties â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DEMO_LISTINGS: DemoListing[] = [
  {
    id: "1", host_id: "h1", title: "Charming Canal House in Amsterdam Centre",
    slug: "canal-house-amsterdam-centre", description: "A beautiful 17th-century canal house in the heart of Amsterdam, fully renovated with modern comforts.",
    property_type: "house", status: "active", city: "Amsterdam", region: "North Holland",
    country: "Netherlands", postal_code: "1015", address: null,
    latitude: 52.374, longitude: 4.901, bedrooms: 3, bathrooms: 2, max_guests: 6,
    area_sqm: 120, price_per_night: 185, cleaning_fee: 45, service_fee_percent: 12,
    currency: "EUR", min_nights: 2, max_nights: 30, check_in_time: null, check_out_time: null,
    instant_book: true, featured: true, avg_rating: 4.9, review_count: 47,
    created_at: "", updated_at: "",
    images: [{ id: "i1", listing_id: "1", url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "2", host_id: "h2", title: "Modern Apartment Near Vondelpark",
    slug: "modern-apartment-vondelpark", description: "Bright and stylish studio apartment steps from the famous Vondelpark.",
    property_type: "apartment", status: "active", city: "Amsterdam", region: "North Holland",
    country: "Netherlands", postal_code: "1054", address: null,
    latitude: 52.358, longitude: 4.869, bedrooms: 1, bathrooms: 1, max_guests: 2,
    area_sqm: 55, price_per_night: 95, cleaning_fee: 25, service_fee_percent: 12,
    currency: "EUR", min_nights: 1, max_nights: 14, check_in_time: null, check_out_time: null,
    instant_book: true, featured: true, avg_rating: 4.7, review_count: 89,
    created_at: "", updated_at: "",
    images: [{ id: "i2", listing_id: "2", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "3", host_id: "h3", title: "Luxury Villa with Private Pool, Zeeland",
    slug: "luxury-villa-zeeland-pool", description: "Exclusive villa in Zeeland with stunning sea views and private heated pool.",
    property_type: "villa", status: "active", city: "Middelburg", region: "Zeeland",
    country: "Netherlands", postal_code: "4330", address: null,
    latitude: 51.499, longitude: 3.611, bedrooms: 5, bathrooms: 3, max_guests: 10,
    area_sqm: 280, price_per_night: 420, cleaning_fee: 120, service_fee_percent: 12,
    currency: "EUR", min_nights: 3, max_nights: 21, check_in_time: null, check_out_time: null,
    instant_book: false, featured: true, avg_rating: 5.0, review_count: 23,
    created_at: "", updated_at: "",
    images: [{ id: "i3", listing_id: "3", url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "4", host_id: "h4", title: "Cosy Studio in The Hague Historic Centre",
    slug: "studio-the-hague-historic", description: "Intimate studio apartment in the diplomatic heart of the Netherlands.",
    property_type: "studio", status: "active", city: "Den Haag", region: "South Holland",
    country: "Netherlands", postal_code: "2511", address: null,
    latitude: 52.071, longitude: 4.301, bedrooms: 0, bathrooms: 1, max_guests: 2,
    area_sqm: 35, price_per_night: 75, cleaning_fee: 20, service_fee_percent: 12,
    currency: "EUR", min_nights: 1, max_nights: null, check_in_time: null, check_out_time: null,
    instant_book: true, featured: false, avg_rating: 4.6, review_count: 134,
    created_at: "", updated_at: "",
    images: [{ id: "i4", listing_id: "4", url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "5", host_id: "h5", title: "Rustic Cabin in the Veluwe Forest",
    slug: "rustic-cabin-veluwe-forest", description: "Escape into nature in this cosy cabin surrounded by ancient Veluwe woodland.",
    property_type: "cabin", status: "active", city: "Arnhem", region: "Gelderland",
    country: "Netherlands", postal_code: "6811", address: null,
    latitude: 52.000, longitude: 5.900, bedrooms: 2, bathrooms: 1, max_guests: 4,
    area_sqm: 70, price_per_night: 110, cleaning_fee: 35, service_fee_percent: 12,
    currency: "EUR", min_nights: 2, max_nights: 14, check_in_time: null, check_out_time: null,
    instant_book: false, featured: false, avg_rating: 4.8, review_count: 61,
    created_at: "", updated_at: "",
    images: [{ id: "i5", listing_id: "5", url: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "6", host_id: "h6", title: "Spacious Family House with Garden, Utrecht",
    slug: "family-house-garden-utrecht", description: "A warm and spacious family home near Utrecht's medieval centre with a sunny garden.",
    property_type: "house", status: "active", city: "Utrecht", region: "Utrecht",
    country: "Netherlands", postal_code: "3511", address: null,
    latitude: 52.091, longitude: 5.120, bedrooms: 4, bathrooms: 2, max_guests: 8,
    area_sqm: 160, price_per_night: 195, cleaning_fee: 55, service_fee_percent: 12,
    currency: "EUR", min_nights: 2, max_nights: 21, check_in_time: null, check_out_time: null,
    instant_book: true, featured: false, avg_rating: 4.9, review_count: 38,
    created_at: "", updated_at: "",
    images: [{ id: "i6", listing_id: "6", url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "7", host_id: "h7", title: "Designer Loft in Rotterdam Centrum",
    slug: "designer-loft-rotterdam-centrum", description: "Industrial-chic loft in Rotterdam's buzzing city centre with panoramic skyline views.",
    property_type: "apartment", status: "active", city: "Rotterdam", region: "South Holland",
    country: "Netherlands", postal_code: "3011", address: null,
    latitude: 51.920, longitude: 4.479, bedrooms: 1, bathrooms: 1, max_guests: 3,
    area_sqm: 75, price_per_night: 120, cleaning_fee: 30, service_fee_percent: 12,
    currency: "EUR", min_nights: 1, max_nights: 30, check_in_time: null, check_out_time: null,
    instant_book: true, featured: true, avg_rating: 4.8, review_count: 72,
    created_at: "", updated_at: "",
    images: [{ id: "i7", listing_id: "7", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "8", host_id: "h8", title: "Peaceful Houseboat on Amsterdam Canals",
    slug: "houseboat-amsterdam-canals", description: "Live the quintessential Amsterdam experience aboard a beautifully renovated houseboat.",
    property_type: "other", status: "active", city: "Amsterdam", region: "North Holland",
    country: "Netherlands", postal_code: "1016", address: null,
    latitude: 52.370, longitude: 4.886, bedrooms: 1, bathrooms: 1, max_guests: 2,
    area_sqm: 45, price_per_night: 145, cleaning_fee: 40, service_fee_percent: 12,
    currency: "EUR", min_nights: 2, max_nights: 14, check_in_time: null, check_out_time: null,
    instant_book: false, featured: true, avg_rating: 4.9, review_count: 55,
    created_at: "", updated_at: "",
    images: [{ id: "i8", listing_id: "8", url: "https://images.unsplash.com/photo-1511348560182-fbaea3d26b27?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "9", host_id: "h9", title: "Beachside Cottage in Zandvoort",
    slug: "beachside-cottage-zandvoort", description: "Steps from the North Sea â€” this cheerful cottage is perfect for a beach break.",
    property_type: "cabin", status: "active", city: "Zandvoort", region: "North Holland",
    country: "Netherlands", postal_code: "2042", address: null,
    latitude: 52.370, longitude: 4.534, bedrooms: 2, bathrooms: 1, max_guests: 5,
    area_sqm: 80, price_per_night: 155, cleaning_fee: 40, service_fee_percent: 12,
    currency: "EUR", min_nights: 2, max_nights: 14, check_in_time: null, check_out_time: null,
    instant_book: true, featured: false, avg_rating: 4.7, review_count: 43,
    created_at: "", updated_at: "",
    images: [{ id: "i9", listing_id: "9", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "10", host_id: "h10", title: "Grand Villa Near Giethoorn Canals",
    slug: "grand-villa-giethoorn", description: "Elegant villa surrounded by the enchanting waterways of the Dutch Venice.",
    property_type: "villa", status: "active", city: "Giethoorn", region: "Overijssel",
    country: "Netherlands", postal_code: "8355", address: null,
    latitude: 52.724, longitude: 6.079, bedrooms: 4, bathrooms: 2, max_guests: 8,
    area_sqm: 200, price_per_night: 295, cleaning_fee: 80, service_fee_percent: 12,
    currency: "EUR", min_nights: 3, max_nights: 21, check_in_time: null, check_out_time: null,
    instant_book: false, featured: false, avg_rating: 5.0, review_count: 19,
    created_at: "", updated_at: "",
    images: [{ id: "i10", listing_id: "10", url: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "11", host_id: "h11", title: "Stylish Apartment in Groningen University Quarter",
    slug: "apartment-groningen-university", description: "Hip apartment in Groningen's lively student district, close to all amenities.",
    property_type: "apartment", status: "active", city: "Groningen", region: "Groningen",
    country: "Netherlands", postal_code: "9711", address: null,
    latitude: 53.219, longitude: 6.567, bedrooms: 2, bathrooms: 1, max_guests: 4,
    area_sqm: 70, price_per_night: 88, cleaning_fee: 25, service_fee_percent: 12,
    currency: "EUR", min_nights: 1, max_nights: 30, check_in_time: null, check_out_time: null,
    instant_book: true, featured: false, avg_rating: 4.6, review_count: 61,
    created_at: "", updated_at: "",
    images: [{ id: "i11", listing_id: "11", url: "https://images.unsplash.com/photo-1555990793-da11153b2473?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "12", host_id: "h12", title: "Romantic Suite in Maastricht Old Town",
    slug: "romantic-suite-maastricht", description: "Intimate suite in a 18th-century building in the heart of charming Maastricht.",
    property_type: "apartment", status: "active", city: "Maastricht", region: "Limburg",
    country: "Netherlands", postal_code: "6211", address: null,
    latitude: 50.851, longitude: 5.690, bedrooms: 1, bathrooms: 1, max_guests: 2,
    area_sqm: 50, price_per_night: 135, cleaning_fee: 35, service_fee_percent: 12,
    currency: "EUR", min_nights: 2, max_nights: 14, check_in_time: null, check_out_time: null,
    instant_book: true, featured: false, avg_rating: 4.9, review_count: 88,
    created_at: "", updated_at: "",
    images: [{ id: "i12", listing_id: "12", url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "13", host_id: "h13", title: "Design House in Eindhoven Strijp-S",
    slug: "design-house-eindhoven-strijps", description: "A creative home in Eindhoven's iconic Strijp-S cultural district, built for design lovers.",
    property_type: "house", status: "active", city: "Eindhoven", region: "North Brabant",
    country: "Netherlands", postal_code: "5617", address: null,
    latitude: 51.441, longitude: 5.478, bedrooms: 3, bathrooms: 2, max_guests: 5,
    area_sqm: 130, price_per_night: 165, cleaning_fee: 45, service_fee_percent: 12,
    currency: "EUR", min_nights: 2, max_nights: 21, check_in_time: null, check_out_time: null,
    instant_book: false, featured: false, avg_rating: 4.8, review_count: 34,
    created_at: "", updated_at: "",
    images: [{ id: "i13", listing_id: "13", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "14", host_id: "h14", title: "Cosy Canal Apartment in Haarlem",
    slug: "canal-apartment-haarlem", description: "Sun-drenched apartment on a peaceful Haarlem canal, 20 minutes from Amsterdam.",
    property_type: "apartment", status: "active", city: "Haarlem", region: "North Holland",
    country: "Netherlands", postal_code: "2011", address: null,
    latitude: 52.385, longitude: 4.636, bedrooms: 1, bathrooms: 1, max_guests: 2,
    area_sqm: 48, price_per_night: 98, cleaning_fee: 25, service_fee_percent: 12,
    currency: "EUR", min_nights: 1, max_nights: 14, check_in_time: null, check_out_time: null,
    instant_book: true, featured: false, avg_rating: 4.7, review_count: 52,
    created_at: "", updated_at: "",
    images: [{ id: "i14", listing_id: "14", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "15", host_id: "h15", title: "Historic Townhouse in Leiden University District",
    slug: "townhouse-leiden-university", description: "Step into Leiden's rich academic past in this beautifully restored 19th-century townhouse.",
    property_type: "house", status: "active", city: "Leiden", region: "South Holland",
    country: "Netherlands", postal_code: "2311", address: null,
    latitude: 52.160, longitude: 4.496, bedrooms: 3, bathrooms: 2, max_guests: 6,
    area_sqm: 140, price_per_night: 175, cleaning_fee: 50, service_fee_percent: 12,
    currency: "EUR", min_nights: 2, max_nights: 21, check_in_time: null, check_out_time: null,
    instant_book: false, featured: false, avg_rating: 4.8, review_count: 29,
    created_at: "", updated_at: "",
    images: [{ id: "i15", listing_id: "15", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "16", host_id: "h16", title: "Charming Blue Delft Apartment",
    slug: "charming-apartment-delft", description: "Beautifully decorated apartment in Delft's old town, surrounded by iconic blue-painted ceramics.",
    property_type: "apartment", status: "active", city: "Delft", region: "South Holland",
    country: "Netherlands", postal_code: "2611", address: null,
    latitude: 52.011, longitude: 4.357, bedrooms: 1, bathrooms: 1, max_guests: 3,
    area_sqm: 60, price_per_night: 105, cleaning_fee: 30, service_fee_percent: 12,
    currency: "EUR", min_nights: 1, max_nights: 14, check_in_time: null, check_out_time: null,
    instant_book: true, featured: false, avg_rating: 4.7, review_count: 66,
    created_at: "", updated_at: "",
    images: [{ id: "i16", listing_id: "16", url: "https://images.unsplash.com/photo-1596568817847-04db19ceeed2?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "17", host_id: "h17", title: "Tulip Retreat Cottage Near Keukenhof",
    slug: "tulip-cottage-keukenhof", description: "Romantic countryside cottage in the heart of the famous tulip-growing region.",
    property_type: "cabin", status: "active", city: "Lisse", region: "South Holland",
    country: "Netherlands", postal_code: "2161", address: null,
    latitude: 52.265, longitude: 4.556, bedrooms: 2, bathrooms: 1, max_guests: 4,
    area_sqm: 75, price_per_night: 128, cleaning_fee: 35, service_fee_percent: 12,
    currency: "EUR", min_nights: 2, max_nights: 14, check_in_time: null, check_out_time: null,
    instant_book: true, featured: false, avg_rating: 4.9, review_count: 41,
    created_at: "", updated_at: "",
    images: [{ id: "i17", listing_id: "17", url: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
  {
    id: "18", host_id: "h18", title: "Lakeside Villa in Friesland",
    slug: "lakeside-villa-friesland", description: "Serene lakeside villa in the Dutch lake district â€” ideal for sailing and cycling.",
    property_type: "villa", status: "active", city: "Sneek", region: "Friesland",
    country: "Netherlands", postal_code: "8601", address: null,
    latitude: 53.033, longitude: 5.657, bedrooms: 4, bathrooms: 2, max_guests: 8,
    area_sqm: 190, price_per_night: 260, cleaning_fee: 70, service_fee_percent: 12,
    currency: "EUR", min_nights: 3, max_nights: 28, check_in_time: null, check_out_time: null,
    instant_book: false, featured: false, avg_rating: 4.8, review_count: 27,
    created_at: "", updated_at: "",
    images: [{ id: "i18", listing_id: "18", url: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&h=400&fit=crop", alt: null, sort_order: 0, is_cover: true, created_at: "" }],
  },
];

// â”€â”€â”€ Feature cards for the landing view â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FEATURES = [
  {
    icon: SearchIcon,
    title: "Smart Search",
    desc: "Find properties by location, dates, number of guests, and more. Our search understands what you're looking for.",
  },
  {
    icon: SlidersHorizontal,
    title: "Advanced Filters",
    desc: "Narrow results by price range, amenities, property type, instant book, rating, and cancellation policy.",
  },
  {
    icon: Map,
    title: "Map Split View",
    desc: "See results on a map alongside the list. Click markers to preview properties instantly.",
  },
  {
    icon: Heart,
    title: "Save Favorites",
    desc: "Heart properties you love and access them anytime from your favorites list.",
  },
  {
    icon: Star,
    title: "Featured Locations",
    desc: "Explore curated collections of top-rated, new, and deal properties across destinations.",
  },
  {
    icon: Building2,
    title: "Browse by Type",
    desc: "Apartments, houses, villas, houseboats, cottages â€” find the style that fits your trip.",
  },
];

// â”€â”€â”€ Sort options â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type SortKey = "recommended" | "price_asc" | "price_desc" | "rating";
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating: Highest" },
];

// â”€â”€â”€ Property type options (from original site) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PROP_TYPES: { key: string; label: string }[] = [
  { key: "apartment", label: "Apartment" },
  { key: "house", label: "House" },
  { key: "villa", label: "Villa" },
  { key: "other", label: "Houseboat" },
  { key: "cabin", label: "Cottage / Cabin" },
  { key: "studio", label: "Studio" },
];

// â”€â”€â”€ Amenity pills â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const AMENITIES = ["WiFi", "Kitchen", "Parking", "Pool", "Pet-friendly", "Garden", "Washer", "Air conditioning"];

// â”€â”€â”€ Landing page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SearchLandingPage() {
  const navigate = useNavigate();
  const topRef = useRef<HTMLDivElement>(null);

  const handleOpenDemo = () => {
    navigate("/search?q=Netherlands&demo=1");
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-muted/30 text-center section-padding">
        <div className="section-container max-w-3xl mx-auto" ref={topRef}>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Search &amp; Book
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Find your perfect stay among hundreds of unique properties across the Netherlands.
            Our powerful search and filter tools make it easy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={handleOpenDemo} className="btn-primary">
              <SearchIcon className="w-4 h-4" />
              Start exploring
            </button>
            <Link to="/locations" className="btn-outline">
              Browse locations
            </Link>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-base p-6 flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="py-12 bg-muted/30">
        <div className="section-container text-center">
          <h2 className="text-2xl font-bold text-primary mb-3">Try it in demo mode</h2>
          <p className="text-muted-foreground mb-6">
            Explore our pre-populated search with 18 Dutch properties.
          </p>
          <button onClick={handleOpenDemo} className="btn-primary">
            <Zap className="w-4 h-4" />
            Open search
          </button>
        </div>
      </section>
    </div>
  );
}

// â”€â”€â”€ Results page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filter state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [instantOnly, setInstantOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const queryCity = searchParams.get("q") || searchParams.get("city") || "";

  // Simulate a brief loading state
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [queryCity]);

  // Filtering
  const filtered = DEMO_LISTINGS.filter((l) => {
    if (queryCity && !l.city.toLowerCase().includes(queryCity.toLowerCase()) &&
      !l.region?.toLowerCase().includes(queryCity.toLowerCase()) &&
      queryCity.toLowerCase() !== "netherlands") return false;
    if (selectedTypes.length && !selectedTypes.includes(l.property_type)) return false;
    if (l.price_per_night < priceRange[0] || l.price_per_night > priceRange[1]) return false;
    if (instantOnly && !l.instant_book) return false;
    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc") return a.price_per_night - b.price_per_night;
    if (sortBy === "price_desc") return b.price_per_night - a.price_per_night;
    if (sortBy === "rating") return (b.avg_rating ?? 0) - (a.avg_rating ?? 0);
    // recommended: featured first then by review count
    if (b.featured !== a.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return b.review_count - a.review_count;
  });

  const toggleType = (key: string) =>
    setSelectedTypes((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );

  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const resetFilters = () => {
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setPriceRange([0, 500]);
    setInstantOnly(false);
    setSortBy("recommended");
  };

  const hasActiveFilters = selectedTypes.length > 0 || selectedAmenities.length > 0 || instantOnly || priceRange[0] > 0 || priceRange[1] < 500;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Thin filter bar */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="section-container py-2.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all",
                filtersOpen || hasActiveFilters
                  ? "border-primary text-primary bg-primary/5"
                  : "border-gray-200 text-gray-700 hover:border-primary"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
            <Link
              to="/map"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-sm font-semibold hover:border-primary transition-all text-gray-700"
            >
              <Map className="w-4 h-4" />
              Map view
            </Link>
            {/* Sort */}
            <div className="ml-auto flex items-center gap-2">
              <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 bg-white text-gray-700">
                <option value="recommended">Recommended</option>
                <option value="price_asc">Price: Low to high</option>
                <option value="price_desc">Price: High to low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container py-6 flex gap-6">
        {/* â”€â”€ Sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {filtersOpen && (
          <aside className="w-64 flex-shrink-0 hidden md:block">
            <div className="card-base p-5 space-y-6 sticky top-36">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-primary flex items-center gap-2">
                  <Filter className="w-4 h-4 text-accent" />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button onClick={resetFilters} className="text-xs text-accent hover:underline">
                    Reset all
                  </button>
                )}
              </div>

              {/* Price range */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-3">Price per night</h4>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span className="font-medium text-foreground">â‚¬{priceRange[0]}</span>
                  <span>â€”</span>
                  <span className="font-medium text-foreground">â‚¬{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={500}
                  step={10}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className="w-full accent-[#C96A3E]"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>â‚¬0</span>
                  <span>â‚¬500+</span>
                </div>
              </div>

              {/* Property type */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-3">Property type</h4>
                <div className="space-y-2">
                  {PROP_TYPES.map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(key)}
                        onChange={() => toggleType(key)}
                        className="w-4 h-4 rounded border-border accent-[#C96A3E]"
                      />
                      <span className="text-sm text-foreground group-hover:text-accent transition-colors">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-3">Amenities</h4>
                <div className="space-y-2">
                  {AMENITIES.map((a) => (
                    <label key={a} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(a)}
                        onChange={() => toggleAmenity(a)}
                        className="w-4 h-4 rounded border-border accent-[#C96A3E]"
                      />
                      <span className="text-sm text-foreground group-hover:text-accent transition-colors">
                        {a}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instant book */}
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-semibold text-sm text-foreground">Instant Book</p>
                    <p className="text-xs text-muted-foreground">No approval needed</p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={instantOnly}
                    onClick={() => setInstantOnly((v) => !v)}
                    className={cn(
                      "relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none",
                      instantOnly ? "bg-accent" : "bg-border"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
                        instantOnly && "translate-x-5"
                      )}
                    />
                  </button>
                </label>
              </div>
            </div>
          </aside>
        )}

        {/* â”€â”€ Results â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="flex-1 min-w-0">
          {/* Result toolbar */}
          <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                <span className="skeleton h-4 w-36 rounded inline-block" />
              ) : (
                <>
                  <strong className="text-foreground">{sorted.length}</strong>{" "}
                  {sorted.length === 1 ? "property" : "properties"} found
                  {queryCity && queryCity.toLowerCase() !== "netherlands" && (
                    <> in <strong className="text-foreground">{queryCity}</strong></>
                  )}
                </>
              )}
            </p>

            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="hidden sm:flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn("px-3 py-2 transition-colors", viewMode === "grid" ? "bg-primary text-white" : "hover:bg-muted/50 text-muted-foreground")}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn("px-3 py-2 transition-colors", viewMode === "list" ? "bg-primary text-white" : "hover:bg-muted/50 text-muted-foreground")}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="input-base py-2 pl-3 pr-8 text-sm appearance-none"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      Sort: {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTypes.map((t) => {
                const label = PROP_TYPES.find((p) => p.key === t)?.label ?? t;
                return (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
                  >
                    {label}
                    <X className="w-3 h-3" />
                  </button>
                );
              })}
              {instantOnly && (
                <button
                  onClick={() => setInstantOnly(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
                >
                  Instant Book
                  <X className="w-3 h-3" />
                </button>
              )}
              <button onClick={resetFilters} className="text-xs text-muted-foreground underline hover:text-foreground">
                Clear all
              </button>
            </div>
          )}

          {/* Skeleton loaders */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">No properties found</p>
              <p className="text-sm text-muted-foreground mb-6">
                Try adjusting your filters or searching a different location.
              </p>
              <button onClick={resetFilters} className="btn-outline">
                Clear filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {sorted.map((l) => (
                <PropertyCard key={l.id} listing={l} />
              ))}
            </div>
          ) : (
            /* List view */
            <div className="space-y-4">
              {sorted.map((l) => (
                <Link
                  key={l.id}
                  to={`/listing/${l.id}`}
                  className="group card-hover flex gap-4 overflow-hidden block"
                >
                  <div className="w-40 h-28 flex-shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={l.images?.[0]?.url}
                      alt={l.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 py-2 pr-4 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {l.city}, {l.region}
                      </p>
                      {l.avg_rating && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-foreground flex-shrink-0">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          {l.avg_rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-accent transition-colors mb-2">
                      {l.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {l.bedrooms} bed Â· {l.max_guests} guests
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-center py-2 pr-3 flex-shrink-0">
                    <span className="text-lg font-bold text-primary">{formatEUR(l.price_per_night)}</span>
                    <span className="text-xs text-muted-foreground">/ night</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Main export: dual-mode router â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Search() {
  const [searchParams] = useSearchParams();

  // Show results if ANY meaningful query param is present
  const hasQuery =
    searchParams.has("q") ||
    searchParams.has("city") ||
    searchParams.has("checkIn") ||
    searchParams.has("adults") ||
    searchParams.has("demo");

  return (
    <>
      <SEO
        title="Search Properties"
        description="Find vacation rentals across Amsterdam, Rotterdam, Utrecht and more."
        noIndex
      />
      {hasQuery ? <SearchResultsPage /> : <SearchLandingPage />}
    </>
  );
}


