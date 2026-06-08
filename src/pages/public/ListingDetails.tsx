import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star, MapPin, Users, BedDouble, Bath, Calendar, ChevronLeft, ChevronRight,
  Heart, Share2, Clock, Shield, Wifi, Car, Flame, Tv, Wind, UtensilsCrossed,
  Waves, TreePine, Dog, Cigarette, PartyPopper, Volume2, CheckCircle2, XCircle,
} from "lucide-react";
import { formatEUR, cn } from "@/lib/utils";
import { RequestModal } from "@/components/RequestModal";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";
import { SecurityBadge } from "@/components/SecurityBadge";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface Amenity {
  icon: React.ReactNode;
  label: string;
}

interface Host {
  name: string;
  joined: string;
  superhost: boolean;
}

interface HouseRules {
  checkIn: string;
  checkOut: string;
  quietHours: string;
  smoking: boolean;
  pets: boolean;
  parties: boolean;
}

interface DemoListing {
  id: string;
  title: string;
  description: string;
  city: string;
  region: string;
  address: string;
  lat: number;
  lng: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  area_sqm: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee_percent: number;
  currency: string;
  min_nights: number;
  check_in_time: string;
  check_out_time: string;
  instant_book: boolean;
  avg_rating: number;
  review_count: number;
  property_type: string;
  host: Host;
  images: string[];
  amenities: Amenity[];
  ratings: Record<string, number>;
  houseRules: HouseRules;
}

// â”€â”€â”€ Demo data: 18 Dutch properties (matching DEMO_LISTINGS in Search.tsx) â”€â”€â”€
const DEMO_LISTINGS: DemoListing[] = [
  {
    id: "1",
    title: "Charming Canal House in Amsterdam Centre",
    description:
      "Step inside this beautifully restored 17th-century canal house in the heart of Amsterdam. The property blends original period features â€” exposed wooden beams, ornate fireplaces, and classic Dutch gable â€” with modern comforts and tasteful interiors.\n\nThe house spans three floors and accommodates up to 6 guests in three thoughtfully designed bedrooms. The open-plan kitchen/living room on the ground floor looks out over the tranquil Keizersgracht canal, a view that never gets old.\n\nYou'll be perfectly positioned to explore Amsterdam on foot or by bicycle. The Jordaan neighbourhood, the Rijksmuseum, and the best local cafÃ©s are all within a 10-minute walk.",
    city: "Amsterdam", region: "North Holland", address: "Keizersgracht 123, 1015 AB Amsterdam",
    lat: 52.374, lng: 4.901,
    bedrooms: 3, bathrooms: 2, max_guests: 6, area_sqm: 120,
    price_per_night: 185, cleaning_fee: 45, service_fee_percent: 12, currency: "EUR",
    min_nights: 2, check_in_time: "15:00", check_out_time: "11:00",
    instant_book: true, avg_rating: 4.9, review_count: 47, property_type: "house",
    host: { name: "Sarah van der Berg", joined: "2022", superhost: true },
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "High-speed WiFi" },
      { icon: <Car className="w-4 h-4" />, label: "Street parking" },
      { icon: <Flame className="w-4 h-4" />, label: "Fireplace" },
      { icon: <Tv className="w-4 h-4" />, label: "Smart TV" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Fully equipped kitchen" },
      { icon: <Wind className="w-4 h-4" />, label: "Air conditioning" },
    ],
    ratings: { Cleanliness: 5.0, Accuracy: 4.8, Communication: 5.0, Location: 5.0, Value: 4.7 },
    houseRules: { checkIn: "15:00", checkOut: "11:00", quietHours: "22:00â€“08:00", smoking: false, pets: false, parties: false },
  },
  {
    id: "2",
    title: "Modern Apartment Near Vondelpark",
    description:
      "Bright and stylish studio apartment steps from the famous Vondelpark. Floor-to-ceiling windows flood the space with natural light and offer leafy treetop views.\n\nEverything is thoughtfully designed for a comfortable stay: a high-quality bed, a fully equipped kitchen, and super-fast WiFi. Cycle to Museumplein in 5 minutes or stroll to the park for a morning jog.",
    city: "Amsterdam", region: "North Holland", address: "Vondelstraat 45, 1054 GH Amsterdam",
    lat: 52.358, lng: 4.869,
    bedrooms: 1, bathrooms: 1, max_guests: 2, area_sqm: 55,
    price_per_night: 95, cleaning_fee: 25, service_fee_percent: 12, currency: "EUR",
    min_nights: 1, check_in_time: "14:00", check_out_time: "11:00",
    instant_book: true, avg_rating: 4.7, review_count: 89, property_type: "apartment",
    host: { name: "Joost Bakker", joined: "2021", superhost: false },
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "High-speed WiFi" },
      { icon: <Tv className="w-4 h-4" />, label: "Smart TV" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Fully equipped kitchen" },
      { icon: <Wind className="w-4 h-4" />, label: "Air conditioning" },
    ],
    ratings: { Cleanliness: 4.9, Accuracy: 4.7, Communication: 4.8, Location: 4.9, Value: 4.6 },
    houseRules: { checkIn: "14:00", checkOut: "11:00", quietHours: "23:00â€“07:00", smoking: false, pets: false, parties: false },
  },
  {
    id: "3",
    title: "Luxury Villa with Private Pool, Zeeland",
    description:
      "Exclusive villa in Zeeland with stunning sea views and a private heated pool. The property is surrounded by dunes and pine woodland, offering absolute privacy and natural beauty.\n\nSpread across two floors, the villa sleeps up to 10 guests across 5 bedrooms. A gourmet kitchen, a games room, and a terrace with outdoor dining area make this the ultimate group retreat.",
    city: "Middelburg", region: "Zeeland", address: "Duinweg 7, 4330 AA Middelburg",
    lat: 51.499, lng: 3.611,
    bedrooms: 5, bathrooms: 3, max_guests: 10, area_sqm: 280,
    price_per_night: 420, cleaning_fee: 120, service_fee_percent: 12, currency: "EUR",
    min_nights: 3, check_in_time: "16:00", check_out_time: "10:00",
    instant_book: false, avg_rating: 5.0, review_count: 23, property_type: "villa",
    host: { name: "Annemiek de Vries", joined: "2019", superhost: true },
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Waves className="w-4 h-4" />, label: "Private heated pool" },
      { icon: <Wifi className="w-4 h-4" />, label: "High-speed WiFi" },
      { icon: <Car className="w-4 h-4" />, label: "Private parking" },
      { icon: <Tv className="w-4 h-4" />, label: "Smart TV" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Gourmet kitchen" },
      { icon: <TreePine className="w-4 h-4" />, label: "Garden & terrace" },
    ],
    ratings: { Cleanliness: 5.0, Accuracy: 5.0, Communication: 5.0, Location: 5.0, Value: 4.9 },
    houseRules: { checkIn: "16:00", checkOut: "10:00", quietHours: "22:00â€“08:00", smoking: false, pets: true, parties: false },
  },
  {
    id: "4",
    title: "Cosy Studio in The Hague Historic Centre",
    description:
      "Intimate studio apartment in the diplomatic heart of the Netherlands. Walk to the Binnenhof parliament buildings, the Mauritshuis museum, and dozens of great restaurants.\n\nPerfect for solo travellers or couples seeking a central base in Den Haag.",
    city: "Den Haag", region: "South Holland", address: "Lange Voorhout 12, 2511 AA Den Haag",
    lat: 52.071, lng: 4.301,
    bedrooms: 0, bathrooms: 1, max_guests: 2, area_sqm: 35,
    price_per_night: 75, cleaning_fee: 20, service_fee_percent: 12, currency: "EUR",
    min_nights: 1, check_in_time: "15:00", check_out_time: "11:00",
    instant_book: true, avg_rating: 4.6, review_count: 134, property_type: "studio",
    host: { name: "Tom Hendricks", joined: "2020", superhost: false },
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "High-speed WiFi" },
      { icon: <Tv className="w-4 h-4" />, label: "Smart TV" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Kitchenette" },
    ],
    ratings: { Cleanliness: 4.7, Accuracy: 4.6, Communication: 4.8, Location: 4.9, Value: 4.5 },
    houseRules: { checkIn: "15:00", checkOut: "11:00", quietHours: "23:00â€“08:00", smoking: false, pets: false, parties: false },
  },
  {
    id: "5",
    title: "Rustic Cabin in the Veluwe Forest",
    description:
      "Escape into nature in this cosy cabin surrounded by ancient Veluwe woodland. Wake up to birdsong, spot deer at dusk, and explore 100 km of cycling and hiking trails right from the door.\n\nOff-grid peace with all the comforts you need: wood-burning stove, outdoor hot tub, and a starry night sky.",
    city: "Arnhem", region: "Gelderland", address: "Bosweg 3, 6811 AA Arnhem",
    lat: 52.0, lng: 5.9,
    bedrooms: 2, bathrooms: 1, max_guests: 4, area_sqm: 70,
    price_per_night: 110, cleaning_fee: 35, service_fee_percent: 12, currency: "EUR",
    min_nights: 2, check_in_time: "15:00", check_out_time: "11:00",
    instant_book: false, avg_rating: 4.8, review_count: 61, property_type: "cabin",
    host: { name: "Rudi Janssen", joined: "2021", superhost: true },
    images: [
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Flame className="w-4 h-4" />, label: "Wood-burning stove" },
      { icon: <Wifi className="w-4 h-4" />, label: "WiFi" },
      { icon: <TreePine className="w-4 h-4" />, label: "Forest terrace" },
      { icon: <Car className="w-4 h-4" />, label: "Free parking" },
    ],
    ratings: { Cleanliness: 4.9, Accuracy: 4.8, Communication: 4.9, Location: 4.8, Value: 4.7 },
    houseRules: { checkIn: "15:00", checkOut: "11:00", quietHours: "22:00â€“08:00", smoking: false, pets: true, parties: false },
  },
  {
    id: "6",
    title: "Spacious Family House with Garden, Utrecht",
    description:
      "A warm and spacious family home near Utrecht's medieval centre with a sunny south-facing garden. Four bedrooms, two bathrooms, and a large open-plan kitchen make this ideal for families or groups of friends.",
    city: "Utrecht", region: "Utrecht", address: "Oudegracht 88, 3511 AV Utrecht",
    lat: 52.091, lng: 5.120,
    bedrooms: 4, bathrooms: 2, max_guests: 8, area_sqm: 160,
    price_per_night: 195, cleaning_fee: 55, service_fee_percent: 12, currency: "EUR",
    min_nights: 2, check_in_time: "15:00", check_out_time: "11:00",
    instant_book: true, avg_rating: 4.9, review_count: 38, property_type: "house",
    host: { name: "Lena Bosman", joined: "2020", superhost: true },
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1560463284-17e109d61ad2?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "High-speed WiFi" },
      { icon: <TreePine className="w-4 h-4" />, label: "Sunny garden" },
      { icon: <Car className="w-4 h-4" />, label: "Driveway parking" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Fully equipped kitchen" },
    ],
    ratings: { Cleanliness: 5.0, Accuracy: 4.9, Communication: 5.0, Location: 4.8, Value: 4.8 },
    houseRules: { checkIn: "15:00", checkOut: "11:00", quietHours: "22:00â€“08:00", smoking: false, pets: true, parties: false },
  },
  {
    id: "7",
    title: "Designer Loft in Rotterdam Centrum",
    description:
      "Industrial-chic loft in Rotterdam's buzzing city centre with panoramic skyline views. High ceilings, exposed concrete, and designer furnishings create an unforgettable setting.",
    city: "Rotterdam", region: "South Holland", address: "Witte de Withstraat 55, 3012 BM Rotterdam",
    lat: 51.920, lng: 4.479,
    bedrooms: 1, bathrooms: 1, max_guests: 3, area_sqm: 75,
    price_per_night: 120, cleaning_fee: 30, service_fee_percent: 12, currency: "EUR",
    min_nights: 1, check_in_time: "15:00", check_out_time: "11:00",
    instant_book: true, avg_rating: 4.8, review_count: 72, property_type: "apartment",
    host: { name: "Kevin Smeets", joined: "2021", superhost: false },
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1543872084-c7bd3822856f?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "High-speed WiFi" },
      { icon: <Tv className="w-4 h-4" />, label: "Smart TV" },
      { icon: <Wind className="w-4 h-4" />, label: "Air conditioning" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Equipped kitchen" },
    ],
    ratings: { Cleanliness: 4.8, Accuracy: 4.8, Communication: 4.9, Location: 4.9, Value: 4.7 },
    houseRules: { checkIn: "15:00", checkOut: "11:00", quietHours: "23:00â€“07:00", smoking: false, pets: false, parties: false },
  },
  {
    id: "8",
    title: "Peaceful Houseboat on Amsterdam Canals",
    description:
      "Live the quintessential Amsterdam experience aboard a beautifully renovated houseboat. Gently rocking on the Prinsengracht canal, this unique property sleeps 2 in cosy comfort.",
    city: "Amsterdam", region: "North Holland", address: "Prinsengracht 456, 1016 GH Amsterdam",
    lat: 52.370, lng: 4.886,
    bedrooms: 1, bathrooms: 1, max_guests: 2, area_sqm: 45,
    price_per_night: 145, cleaning_fee: 40, service_fee_percent: 12, currency: "EUR",
    min_nights: 2, check_in_time: "16:00", check_out_time: "10:00",
    instant_book: false, avg_rating: 4.9, review_count: 55, property_type: "other",
    host: { name: "Floris de Groot", joined: "2018", superhost: true },
    images: [
      "https://images.unsplash.com/photo-1511348560182-fbaea3d26b27?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "WiFi" },
      { icon: <Tv className="w-4 h-4" />, label: "TV" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Kitchenette" },
    ],
    ratings: { Cleanliness: 5.0, Accuracy: 4.9, Communication: 5.0, Location: 5.0, Value: 4.8 },
    houseRules: { checkIn: "16:00", checkOut: "10:00", quietHours: "22:00â€“08:00", smoking: false, pets: false, parties: false },
  },
  {
    id: "9",
    title: "Beachside Cottage in Zandvoort",
    description:
      "Steps from the North Sea, this cheerful cottage is perfect for a beach break. Rinse off in the outdoor shower after a long swim, then relax on the terrace with a cold drink.",
    city: "Zandvoort", region: "North Holland", address: "Zeestraat 9, 2042 LC Zandvoort",
    lat: 52.370, lng: 4.534,
    bedrooms: 2, bathrooms: 1, max_guests: 5, area_sqm: 80,
    price_per_night: 155, cleaning_fee: 40, service_fee_percent: 12, currency: "EUR",
    min_nights: 2, check_in_time: "15:00", check_out_time: "11:00",
    instant_book: true, avg_rating: 4.7, review_count: 43, property_type: "cabin",
    host: { name: "Mirjam Wolters", joined: "2022", superhost: false },
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "WiFi" },
      { icon: <Car className="w-4 h-4" />, label: "Free parking" },
      { icon: <TreePine className="w-4 h-4" />, label: "Outdoor terrace" },
    ],
    ratings: { Cleanliness: 4.8, Accuracy: 4.7, Communication: 4.8, Location: 5.0, Value: 4.6 },
    houseRules: { checkIn: "15:00", checkOut: "11:00", quietHours: "22:00â€“08:00", smoking: false, pets: true, parties: false },
  },
  {
    id: "10",
    title: "Grand Villa Near Giethoorn Canals",
    description:
      "Elegant villa surrounded by the enchanting waterways of the Dutch Venice. Arrive by boat from the village and enjoy total privacy in this beautiful property.",
    city: "Giethoorn", region: "Overijssel", address: "Binnenpad 22, 8355 AC Giethoorn",
    lat: 52.724, lng: 6.079,
    bedrooms: 4, bathrooms: 2, max_guests: 8, area_sqm: 200,
    price_per_night: 295, cleaning_fee: 80, service_fee_percent: 12, currency: "EUR",
    min_nights: 3, check_in_time: "15:00", check_out_time: "11:00",
    instant_book: false, avg_rating: 5.0, review_count: 19, property_type: "villa",
    host: { name: "Gerda Prins", joined: "2020", superhost: true },
    images: [
      "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "WiFi" },
      { icon: <Waves className="w-4 h-4" />, label: "Private jetty" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Fully equipped kitchen" },
      { icon: <Car className="w-4 h-4" />, label: "Parking" },
    ],
    ratings: { Cleanliness: 5.0, Accuracy: 5.0, Communication: 5.0, Location: 5.0, Value: 4.9 },
    houseRules: { checkIn: "15:00", checkOut: "11:00", quietHours: "22:00â€“08:00", smoking: false, pets: false, parties: false },
  },
  {
    id: "11",
    title: "Stylish Apartment in Groningen University Quarter",
    description:
      "Hip apartment in Groningen's lively student district, close to all amenities, cafÃ©s, and the Martini Tower. A great base for exploring the energetic north.",
    city: "Groningen", region: "Groningen", address: "Herestraat 77, 9711 LM Groningen",
    lat: 53.219, lng: 6.567,
    bedrooms: 2, bathrooms: 1, max_guests: 4, area_sqm: 70,
    price_per_night: 88, cleaning_fee: 25, service_fee_percent: 12, currency: "EUR",
    min_nights: 1, check_in_time: "14:00", check_out_time: "11:00",
    instant_book: true, avg_rating: 4.6, review_count: 61, property_type: "apartment",
    host: { name: "Erik Mulder", joined: "2022", superhost: false },
    images: [
      "https://images.unsplash.com/photo-1555990793-da11153b2473?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "High-speed WiFi" },
      { icon: <Tv className="w-4 h-4" />, label: "Smart TV" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Kitchen" },
    ],
    ratings: { Cleanliness: 4.7, Accuracy: 4.6, Communication: 4.7, Location: 4.8, Value: 4.6 },
    houseRules: { checkIn: "14:00", checkOut: "11:00", quietHours: "23:00â€“08:00", smoking: false, pets: false, parties: false },
  },
  {
    id: "12",
    title: "Romantic Suite in Maastricht Old Town",
    description:
      "Intimate suite in an 18th-century building in the heart of charming Maastricht. Cobblestone streets, Michelin-starred restaurants, and the Vrijthof square are at your doorstep.",
    city: "Maastricht", region: "Limburg", address: "Vrijthof 3, 6211 LD Maastricht",
    lat: 50.851, lng: 5.690,
    bedrooms: 1, bathrooms: 1, max_guests: 2, area_sqm: 50,
    price_per_night: 135, cleaning_fee: 35, service_fee_percent: 12, currency: "EUR",
    min_nights: 2, check_in_time: "15:00", check_out_time: "11:00",
    instant_book: true, avg_rating: 4.9, review_count: 88, property_type: "apartment",
    host: { name: "Sophie Claes", joined: "2019", superhost: true },
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "WiFi" },
      { icon: <Tv className="w-4 h-4" />, label: "Smart TV" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Kitchenette" },
    ],
    ratings: { Cleanliness: 5.0, Accuracy: 4.9, Communication: 5.0, Location: 5.0, Value: 4.8 },
    houseRules: { checkIn: "15:00", checkOut: "11:00", quietHours: "22:00â€“08:00", smoking: false, pets: false, parties: false },
  },
  {
    id: "13",
    title: "Design House in Eindhoven Strijp-S",
    description:
      "A creative home in Eindhoven's iconic Strijp-S cultural district, built for design lovers. Original Philips factory details meet contemporary furnishings in this one-of-a-kind space.",
    city: "Eindhoven", region: "North Brabant", address: "Torenallee 20, 5617 BB Eindhoven",
    lat: 51.441, lng: 5.478,
    bedrooms: 3, bathrooms: 2, max_guests: 5, area_sqm: 130,
    price_per_night: 165, cleaning_fee: 45, service_fee_percent: 12, currency: "EUR",
    min_nights: 2, check_in_time: "15:00", check_out_time: "11:00",
    instant_book: false, avg_rating: 4.8, review_count: 34, property_type: "house",
    host: { name: "Marco Visser", joined: "2021", superhost: false },
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "High-speed WiFi" },
      { icon: <Car className="w-4 h-4" />, label: "Parking" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Fully equipped kitchen" },
      { icon: <Tv className="w-4 h-4" />, label: "Smart TV" },
    ],
    ratings: { Cleanliness: 4.9, Accuracy: 4.8, Communication: 4.8, Location: 4.7, Value: 4.7 },
    houseRules: { checkIn: "15:00", checkOut: "11:00", quietHours: "22:00â€“08:00", smoking: false, pets: false, parties: false },
  },
  {
    id: "14",
    title: "Cosy Canal Apartment in Haarlem",
    description:
      "Sun-drenched apartment on a peaceful Haarlem canal, 20 minutes from Amsterdam by train. The city's famous flower market, St. Bavo church, and Franz Hals museum are all nearby.",
    city: "Haarlem", region: "North Holland", address: "Nieuwe Gracht 14, 2011 NE Haarlem",
    lat: 52.385, lng: 4.636,
    bedrooms: 1, bathrooms: 1, max_guests: 2, area_sqm: 48,
    price_per_night: 98, cleaning_fee: 25, service_fee_percent: 12, currency: "EUR",
    min_nights: 1, check_in_time: "15:00", check_out_time: "11:00",
    instant_book: true, avg_rating: 4.7, review_count: 52, property_type: "apartment",
    host: { name: "Ingrid van Houten", joined: "2022", superhost: false },
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "WiFi" },
      { icon: <Tv className="w-4 h-4" />, label: "Smart TV" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Kitchen" },
    ],
    ratings: { Cleanliness: 4.8, Accuracy: 4.7, Communication: 4.8, Location: 4.9, Value: 4.6 },
    houseRules: { checkIn: "15:00", checkOut: "11:00", quietHours: "23:00â€“07:00", smoking: false, pets: false, parties: false },
  },
  {
    id: "15",
    title: "Historic Townhouse in Leiden University District",
    description:
      "Step into Leiden's rich academic past in this beautifully restored 19th-century townhouse. The Rijksmuseum van Oudheden, botanical garden, and canal-side cafÃ©s are all on your doorstep.",
    city: "Leiden", region: "South Holland", address: "Rapenburg 66, 2311 EZ Leiden",
    lat: 52.160, lng: 4.496,
    bedrooms: 3, bathrooms: 2, max_guests: 6, area_sqm: 140,
    price_per_night: 175, cleaning_fee: 50, service_fee_percent: 12, currency: "EUR",
    min_nights: 2, check_in_time: "15:00", check_out_time: "11:00",
    instant_book: false, avg_rating: 4.8, review_count: 29, property_type: "house",
    host: { name: "Hanna Vermeer", joined: "2020", superhost: true },
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "High-speed WiFi" },
      { icon: <Car className="w-4 h-4" />, label: "Street parking" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Fully equipped kitchen" },
      { icon: <Flame className="w-4 h-4" />, label: "Fireplace" },
    ],
    ratings: { Cleanliness: 4.9, Accuracy: 4.8, Communication: 4.9, Location: 4.8, Value: 4.7 },
    houseRules: { checkIn: "15:00", checkOut: "11:00", quietHours: "22:00â€“08:00", smoking: false, pets: false, parties: false },
  },
  {
    id: "16",
    title: "Charming Blue Delft Apartment",
    description:
      "Beautifully decorated apartment in Delft's old town, surrounded by iconic blue-painted ceramics. The Vermeer Centre and the New Church are a 5-minute stroll.",
    city: "Delft", region: "South Holland", address: "Markt 1, 2611 GW Delft",
    lat: 52.011, lng: 4.357,
    bedrooms: 1, bathrooms: 1, max_guests: 3, area_sqm: 60,
    price_per_night: 105, cleaning_fee: 30, service_fee_percent: 12, currency: "EUR",
    min_nights: 1, check_in_time: "15:00", check_out_time: "11:00",
    instant_book: true, avg_rating: 4.7, review_count: 66, property_type: "apartment",
    host: { name: "Pieter van Dam", joined: "2021", superhost: false },
    images: [
      "https://images.unsplash.com/photo-1596568817847-04db19ceeed2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "WiFi" },
      { icon: <Tv className="w-4 h-4" />, label: "Smart TV" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Kitchen" },
    ],
    ratings: { Cleanliness: 4.8, Accuracy: 4.7, Communication: 4.8, Location: 4.9, Value: 4.7 },
    houseRules: { checkIn: "15:00", checkOut: "11:00", quietHours: "23:00â€“07:00", smoking: false, pets: false, parties: false },
  },
  {
    id: "17",
    title: "Tulip Retreat Cottage Near Keukenhof",
    description:
      "Romantic countryside cottage in the heart of the famous tulip-growing region. In spring, you're surrounded by a sea of colour; year-round the Dutch countryside is breathtaking.",
    city: "Lisse", region: "South Holland", address: "Heereweg 219, 2161 AG Lisse",
    lat: 52.265, lng: 4.556,
    bedrooms: 2, bathrooms: 1, max_guests: 4, area_sqm: 75,
    price_per_night: 128, cleaning_fee: 35, service_fee_percent: 12, currency: "EUR",
    min_nights: 2, check_in_time: "15:00", check_out_time: "11:00",
    instant_book: true, avg_rating: 4.9, review_count: 41, property_type: "cabin",
    host: { name: "Anouk Peeters", joined: "2022", superhost: false },
    images: [
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "WiFi" },
      { icon: <Car className="w-4 h-4" />, label: "Free parking" },
      { icon: <TreePine className="w-4 h-4" />, label: "Garden" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Kitchen" },
    ],
    ratings: { Cleanliness: 5.0, Accuracy: 4.9, Communication: 5.0, Location: 4.9, Value: 4.8 },
    houseRules: { checkIn: "15:00", checkOut: "11:00", quietHours: "22:00â€“08:00", smoking: false, pets: true, parties: false },
  },
  {
    id: "18",
    title: "Lakeside Villa in Friesland",
    description:
      "Serene lakeside villa in the Dutch lake district â€” ideal for sailing and cycling. Moor your boat at the private jetty, then explore the Friesian lakes and waterways by canoe or kayak.",
    city: "Sneek", region: "Friesland", address: "Waterpoortstraat 1, 8601 BG Sneek",
    lat: 53.033, lng: 5.657,
    bedrooms: 4, bathrooms: 2, max_guests: 8, area_sqm: 190,
    price_per_night: 260, cleaning_fee: 70, service_fee_percent: 12, currency: "EUR",
    min_nights: 3, check_in_time: "15:00", check_out_time: "11:00",
    instant_book: false, avg_rating: 4.8, review_count: 27, property_type: "villa",
    host: { name: "Wiebe Dijkstra", joined: "2020", superhost: true },
    images: [
      "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { icon: <Wifi className="w-4 h-4" />, label: "WiFi" },
      { icon: <Waves className="w-4 h-4" />, label: "Private jetty" },
      { icon: <Car className="w-4 h-4" />, label: "Parking" },
      { icon: <UtensilsCrossed className="w-4 h-4" />, label: "Fully equipped kitchen" },
      { icon: <TreePine className="w-4 h-4" />, label: "Garden & terrace" },
    ],
    ratings: { Cleanliness: 4.9, Accuracy: 4.8, Communication: 4.9, Location: 4.9, Value: 4.7 },
    houseRules: { checkIn: "15:00", checkOut: "11:00", quietHours: "22:00â€“08:00", smoking: false, pets: true, parties: false },
  },
];

// â”€â”€â”€ Demo reviews â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DEMO_REVIEWS = [
  { id: "r1", reviewer: "Emma", rating: 5, date: "May 2026", comment: "Absolutely stunning property! The views were breathtaking. Highly recommend!" },
  { id: "r2", reviewer: "Lars", rating: 4, date: "April 2026", comment: "Great location and very clean. Perfect for exploring the area." },
  { id: "r3", reviewer: "Isabelle", rating: 5, date: "March 2026", comment: "A dream stay. The property is even more beautiful in person." },
];

// â”€â”€â”€ House Rules icon helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function RuleRow({ icon, label, allowed }: { icon: React.ReactNode; label: string; allowed: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1 text-foreground">{label}</span>
      {allowed ? (
        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
      )}
    </div>
  );
}

// â”€â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();

  // Look up the listing by id, fall back to listing 1
    const navigate = useNavigate();
  const listing = DEMO_LISTINGS.find((l) => l.id === id) ?? DEMO_LISTINGS[0];

  const [activeImage, setActiveImage] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [favorited, setFavorited] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
      : 0;
  const nightly = nights * listing.price_per_night;
  const service = Math.round((nightly + listing.cleaning_fee) * (listing.service_fee_percent / 100));
  const total = nightly + listing.cleaning_fee + service;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${listing.lat},${listing.lng}`;

  return (
    <div className="pt-16 min-h-screen">
      {/* â”€â”€ JSON-LD Structured Data for SEO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            name: listing.title,
            description: listing.description,
            address: {
              "@type": "PostalAddress",
              addressLocality: listing.city,
              addressCountry: "NL",
            },
            starRating: {
              "@type": "Rating",
              ratingValue: listing.avg_rating,
            },
            priceRange: `â‚¬${listing.price_per_night}/night`,
          }),
        }}
      />
      {/* â”€â”€ Hero Gallery â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="relative">
        <div className="aspect-[21/9] overflow-hidden bg-muted">
          <img
            src={listing.images[activeImage]}
            alt={listing.title}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {listing.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === activeImage ? "bg-white w-5" : "bg-white/60 w-2"
              )}
            />
          ))}
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={() => setActiveImage((i) => Math.max(0, i - 1))}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:shadow-md transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveImage((i) => Math.min(listing.images.length - 1, i + 1))}
          aria-label="Next image"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:shadow-md transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Share / Favourite */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            aria-label="Share"
            className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:shadow-md transition-all"
          >
            <Share2 className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => setFavorited(!favorited)}
            aria-label={favorited ? "Remove from favourites" : "Add to favourites"}
            className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:shadow-md transition-all"
          >
            <Heart className={cn("w-4 h-4 transition-colors", favorited ? "text-red-500 fill-red-500" : "text-foreground")} />
          </button>
        </div>
      </div>

      {/* â”€â”€ Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {/* Bottom padding on mobile to leave room for sticky booking bar */}
      <div className="section-container py-8 pb-32 lg:pb-8">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* â”€â”€ Left column â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* Title & meta */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight mb-3">
                {listing.title}
              </h1>
              <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {listing.city}, {listing.region}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 star-filled" />
                  {listing.avg_rating} ({listing.review_count} reviews)
                </span>
                {listing.instant_book && <span className="badge-green">Instant Book</span>}
              </div>
            </div>

            {/* Specs */}
            <div className="flex gap-6 flex-wrap">
              {[
                { icon: <BedDouble className="w-5 h-5" />, label: listing.bedrooms > 0 ? `${listing.bedrooms} bedroom${listing.bedrooms > 1 ? "s" : ""}` : "Studio" },
                { icon: <Bath className="w-5 h-5" />, label: `${listing.bathrooms} bathroom${listing.bathrooms > 1 ? "s" : ""}` },
                { icon: <Users className="w-5 h-5" />, label: `Up to ${listing.max_guests} guests` },
                { icon: <Clock className="w-5 h-5" />, label: `Check-in from ${listing.check_in_time}` },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="text-accent">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>

            <hr className="border-border" />

            {/* Host info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold flex-shrink-0">
                {listing.host.name[0]}
              </div>
              <div>
                <p className="font-semibold text-foreground">Hosted by {listing.host.name}</p>
                <p className="text-sm text-muted-foreground">Host since {listing.host.joined}</p>
                {listing.host.superhost && (
                  <span className="badge-accent mt-1 inline-block">Superhost</span>
                )}
              </div>
            </div>

            <hr className="border-border" />

            {/* About this space */}
            <div>
              <h3 className="font-bold text-xl text-primary mb-4">About this space</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            <hr className="border-border" />

            {/* What this place offers */}
            <div>
              <h3 className="font-bold text-xl text-primary mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-3">
                {listing.amenities.map((a) => (
                  <div key={String(a.label)} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="text-accent">{a.icon}</span>
                    {a.label}
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* House rules */}
            <div>
              <h3 className="font-bold text-xl text-primary mb-4">House rules</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Check-in:</span>
                  <span className="font-medium text-foreground">from {listing.houseRules.checkIn}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Check-out:</span>
                  <span className="font-medium text-foreground">before {listing.houseRules.checkOut}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Quiet hours:</span>
                  <span className="font-medium text-foreground">{listing.houseRules.quietHours}</span>
                </div>
                <RuleRow icon={<Cigarette className="w-4 h-4" />} label="Smoking allowed" allowed={listing.houseRules.smoking} />
                <RuleRow icon={<Dog className="w-4 h-4" />} label="Pets allowed" allowed={listing.houseRules.pets} />
                <RuleRow icon={<PartyPopper className="w-4 h-4" />} label="Parties or events" allowed={listing.houseRules.parties} />
              </div>
            </div>

            <hr className="border-border" />

            {/* Cancellation policy */}
            <div>
              <h3 className="font-bold text-xl text-primary mb-2">Cancellation policy</h3>
              <p className="text-sm font-medium text-green-700 bg-green-50 rounded-xl px-4 py-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Free cancellation up to 24 hours before check-in.
              </p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                After that, cancellations within 24 hours of check-in will not be refunded.
                The cleaning fee is non-refundable once the booking is confirmed.
              </p>
            </div>

            <hr className="border-border" />

            {/* Location */}
            <div>
              <h3 className="font-bold text-xl text-primary mb-4">Location</h3>
              <p className="text-sm text-muted-foreground mb-3">
                <MapPin className="w-4 h-4 inline mr-1 align-middle" />
                {listing.address}
              </p>
              {/* Static map placeholder */}
              <div className="rounded-2xl overflow-hidden border border-border bg-slate-100 h-52 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{listing.city}, {listing.region}</p>
                </div>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-accent hover:underline font-medium"
              >
                <MapPin className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>

            <hr className="border-border" />

            {/* Reviews */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-5 h-5 star-filled" />
                <h3 className="font-bold text-xl text-primary">
                  {listing.avg_rating} Â· {listing.review_count} reviews
                </h3>
              </div>

              {/* Rating breakdown */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {Object.entries(listing.ratings).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-foreground">{key}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(val / 5) * 100}%` }} />
                      </div>
                      <span className="text-sm font-medium text-foreground w-6">{val}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Review list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {DEMO_REVIEWS.map((r) => (
                  <div key={r.id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground">
                        {r.reviewer[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{r.reviewer}</p>
                        <p className="text-xs text-muted-foreground">{r.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={cn("w-3 h-3", s <= r.rating ? "star-filled" : "star-empty")} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* â”€â”€ Right column â€” Booking Widget (desktop) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="hidden lg:block lg:w-96 flex-shrink-0">
            <BookingWidget listing={listing} nights={nights} nightly={nightly} service={service} total={total}
              checkIn={checkIn} setCheckIn={setCheckIn}
              checkOut={checkOut} setCheckOut={setCheckOut}
              guests={guests} setGuests={setGuests}
              onRequestOpen={() => setShowRequestModal(true)}
              onMessageHost={() => navigate(`/app/messages?listing=${listing.id}`)} />
          </div>
        </div>
      </div>

      {/* â”€â”€ Mobile sticky bottom bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-2xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-lg font-bold text-primary">{formatEUR(listing.price_per_night)}</span>
            <span className="text-sm text-muted-foreground"> / night</span>
            {listing.avg_rating > 0 && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 star-filled" />
                {listing.avg_rating} Â· {listing.review_count} reviews
              </p>
            )}
          </div>
          <button onClick={() => setShowRequestModal(true)} className="btn-primary px-6 py-3 text-sm font-semibold">Request availability</button>
        </div>
      {showRequestModal && (
        <RequestModal
          listingId={listing.id}
          listingTitle={listing.title}
          maxGuests={listing.max_guests}
          minNights={listing.min_nights}
          defaultCheckIn={checkIn}
          defaultCheckOut={checkOut}
          defaultGuests={guests}
          onClose={() => setShowRequestModal(false)}
        />
      )}
      </div>
    </div>
  );
}

// â”€â”€â”€ Booking Widget sub-component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface BookingWidgetProps {
  onRequestOpen: () => void;
  onMessageHost: () => void;
  listing: DemoListing;
  nights: number;
  nightly: number;
  service: number;
  total: number;
  checkIn: string;
  setCheckIn: (v: string) => void;
  checkOut: string;
  setCheckOut: (v: string) => void;
  guests: number;
  setGuests: (v: number) => void;
}

function BookingWidget({
  listing, nights, nightly, service, total,
  checkIn, setCheckIn, checkOut, setCheckOut, guests, setGuests,
  onRequestOpen, onMessageHost,
}: BookingWidgetProps) {
  return (
    <div className="card-base p-6 sticky top-24 space-y-4">
      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-primary">{formatEUR(listing.price_per_night)}</span>
        <span className="text-sm text-muted-foreground">/ night</span>
        {listing.avg_rating > 0 && (
          <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
            <Star className="w-3.5 h-3.5 star-filled" />
            {listing.avg_rating} ({listing.review_count})
          </span>
        )}
      </div>

      {/* Date & guests grid */}
      <div className="border-2 border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="p-3 border-r border-b border-border">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="text-sm text-foreground bg-transparent focus:outline-none w-full"
            />
          </div>
          <div className="p-3 border-b border-border">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="text-sm text-foreground bg-transparent focus:outline-none w-full"
            />
          </div>
        </div>
        <div className="p-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(+e.target.value)}
            className="text-sm text-foreground bg-transparent focus:outline-none w-full"
          >
            {Array.from({ length: listing.max_guests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} guest{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CTA button â€” "Request availability" */}
      <button
        onClick={onRequestOpen}
        className="btn-primary w-full justify-center py-3.5 text-base"
      >
        Request availability
      </button>
      <p className="text-xs text-muted-foreground text-center">You won&apos;t be charged yet</p>
      <button onClick={onMessageHost} className="w-full flex items-center justify-center gap-2 border border-border py-3 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
        <MessageSquare className="w-4 h-4" /> Message host
      </button>

      {/* Minimum nights note */}
      {listing.min_nights > 1 && (
        <p className="text-xs text-center text-muted-foreground">
          Minimum {listing.min_nights} nights
        </p>
      )}

      {/* Price breakdown â€” shown once dates are selected */}
      {nights > 0 && (
        <div className="space-y-2 pt-2 border-t border-border text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>{formatEUR(listing.price_per_night)} Ã— {nights} night{nights > 1 ? "s" : ""}</span>
            <span>{formatEUR(nightly)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Cleaning fee</span>
            <span>{formatEUR(listing.cleaning_fee)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Service fee ({listing.service_fee_percent}%)</span>
            <span>{formatEUR(service)}</span>
          </div>
          <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border">
            <span>Total</span>
            <span>{formatEUR(total)}</span>
          </div>
        </div>
      )}

      {/* Security badge â€” replaces old trust signal */}
      <SecurityBadge variant="compact" />
    </div>
  );
}

