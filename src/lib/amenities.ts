/**
 * amenities.ts
 * Comprehensive amenities database for the Bnb Circle app.
 * Used across listing creation, search filters, and property display.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Amenity {
  /** Unique kebab-case identifier */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Parent category id */
  category: string;
  /** Lucide icon name in PascalCase (e.g. "Wifi", "Car") */
  iconName: string;
  /** Premium amenities are highlighted with a badge in listings */
  isPremium?: boolean;
  /** Shown as a quick-filter chip on the search/browse page */
  searchable: boolean;
}

export interface AmenityCategory {
  /** Unique kebab-case identifier */
  id: string;
  /** Human-readable label */
  label: string;
  /** Lucide icon name for the category header */
  iconName: string;
  /** Ordered list of amenities belonging to this category */
  amenities: Amenity[];
}

// ─── Categories & Amenities ───────────────────────────────────────────────────

export const AMENITY_CATEGORIES: AmenityCategory[] = [
  // ── Connectivity ──────────────────────────────────────────────────────────
  {
    id: "connectivity",
    label: "Connectivity",
    iconName: "Wifi",
    amenities: [
      { id: "wifi",             name: "WiFi",               category: "connectivity", iconName: "Wifi",        searchable: true  },
      { id: "speed_200mbps",    name: "200+ Mbps WiFi",     category: "connectivity", iconName: "Wifi",        searchable: false },
      { id: "dedicated_workspace", name: "Dedicated workspace", category: "connectivity", iconName: "Monitor", searchable: false },
      { id: "wifi_6",           name: "WiFi 6",             category: "connectivity", iconName: "Wifi",        searchable: false },
      { id: "ethernet",         name: "Ethernet port",      category: "connectivity", iconName: "Network",     searchable: false },
    ],
  },

  // ── Kitchen ───────────────────────────────────────────────────────────────
  {
    id: "kitchen",
    label: "Kitchen",
    iconName: "UtensilsCrossed",
    amenities: [
      { id: "kitchen",      name: "Full kitchen",    category: "kitchen", iconName: "UtensilsCrossed", searchable: true,  isPremium: false },
      { id: "dishwasher",   name: "Dishwasher",      category: "kitchen", iconName: "UtensilsCrossed", searchable: false },
      { id: "coffee_maker", name: "Coffee maker",    category: "kitchen", iconName: "Coffee",          searchable: false },
      { id: "microwave",    name: "Microwave",       category: "kitchen", iconName: "Zap",             searchable: false },
      { id: "oven",         name: "Oven",            category: "kitchen", iconName: "Flame",           searchable: false },
      { id: "fridge",       name: "Refrigerator",   category: "kitchen", iconName: "Thermometer",     searchable: false },
      { id: "freezer",      name: "Freezer",        category: "kitchen", iconName: "Snowflake",       searchable: false },
      { id: "toaster",      name: "Toaster",        category: "kitchen", iconName: "Square",          searchable: false },
      { id: "bbq",          name: "BBQ grill",      category: "kitchen", iconName: "Flame",           searchable: false, isPremium: true },
      { id: "dining_table", name: "Dining table",   category: "kitchen", iconName: "Table",           searchable: false },
      { id: "wine_glasses", name: "Wine glasses",   category: "kitchen", iconName: "Wine",            searchable: false },
      { id: "blender",      name: "Blender",        category: "kitchen", iconName: "Blend",           searchable: false },
    ],
  },

  // ── Bedroom & Bathroom ────────────────────────────────────────────────────
  {
    id: "bedroom_bathroom",
    label: "Bedroom & Bathroom",
    iconName: "Bed",
    amenities: [
      { id: "king_bed",      name: "King bed",                   category: "bedroom_bathroom", iconName: "Bed",          searchable: false },
      { id: "queen_bed",     name: "Queen bed",                  category: "bedroom_bathroom", iconName: "Bed",          searchable: false },
      { id: "twin_beds",     name: "Twin beds",                  category: "bedroom_bathroom", iconName: "Bed",          searchable: false },
      { id: "bunk_beds",     name: "Bunk beds",                  category: "bedroom_bathroom", iconName: "Layers",       searchable: false },
      { id: "extra_pillows", name: "Extra pillows & blankets",   category: "bedroom_bathroom", iconName: "Bed",          searchable: false },
      { id: "en_suite",      name: "En-suite bathroom",          category: "bedroom_bathroom", iconName: "Bath",         searchable: false },
      { id: "bath",          name: "Bathtub",                    category: "bedroom_bathroom", iconName: "Bath",         searchable: false },
      { id: "rain_shower",   name: "Rain shower",                category: "bedroom_bathroom", iconName: "Droplets",     searchable: false },
      { id: "hot_tub",       name: "Hot tub",                    category: "bedroom_bathroom", iconName: "Waves",        searchable: true,  isPremium: true },
      { id: "bidet",         name: "Bidet",                      category: "bedroom_bathroom", iconName: "Droplet",      searchable: false },
      { id: "hair_dryer",    name: "Hair dryer",                 category: "bedroom_bathroom", iconName: "Wind",         searchable: false },
      { id: "towels",        name: "Towels & linens",            category: "bedroom_bathroom", iconName: "Layers",       searchable: false },
    ],
  },

  // ── Living Spaces ─────────────────────────────────────────────────────────
  {
    id: "living_spaces",
    label: "Living Spaces",
    iconName: "Sofa",
    amenities: [
      { id: "living_room", name: "Living room",      category: "living_spaces", iconName: "Sofa",      searchable: false },
      { id: "fireplace",   name: "Fireplace",        category: "living_spaces", iconName: "Flame",     searchable: true  },
      { id: "tv_4k",       name: "4K Smart TV",      category: "living_spaces", iconName: "Tv",        searchable: false },
      { id: "netflix",     name: "Netflix/streaming",category: "living_spaces", iconName: "Play",      searchable: false },
      { id: "board_games", name: "Board games",      category: "living_spaces", iconName: "Gamepad2",  searchable: false },
      { id: "books",       name: "Library/books",    category: "living_spaces", iconName: "BookOpen",  searchable: false },
      { id: "piano",       name: "Piano",            category: "living_spaces", iconName: "Music",     searchable: false, isPremium: true },
    ],
  },

  // ── Outdoor ───────────────────────────────────────────────────────────────
  {
    id: "outdoor",
    label: "Outdoor",
    iconName: "Trees",
    amenities: [
      { id: "private_pool",    name: "Private pool",       category: "outdoor", iconName: "Waves",         searchable: true,  isPremium: true },
      { id: "shared_pool",     name: "Shared pool",        category: "outdoor", iconName: "Waves",         searchable: false },
      { id: "jacuzzi",         name: "Jacuzzi",            category: "outdoor", iconName: "Waves",         searchable: false, isPremium: true },
      { id: "garden",          name: "Private garden",     category: "outdoor", iconName: "Trees",         searchable: false },
      { id: "terrace",         name: "Terrace/balcony",    category: "outdoor", iconName: "Home",          searchable: false },
      { id: "beach_access",    name: "Beach access",       category: "outdoor", iconName: "Waves",         searchable: true  },
      { id: "lake_access",     name: "Lake access",        category: "outdoor", iconName: "Waves",         searchable: false },
      { id: "outdoor_shower",  name: "Outdoor shower",     category: "outdoor", iconName: "Shower",        searchable: false },
      { id: "sun_loungers",    name: "Sun loungers",       category: "outdoor", iconName: "Sun",           searchable: false },
      { id: "outdoor_dining",  name: "Outdoor dining area",category: "outdoor", iconName: "UtensilsCrossed",searchable: false },
      { id: "bbq_outdoor",     name: "Outdoor BBQ",        category: "outdoor", iconName: "Flame",         searchable: false },
      { id: "fire_pit",        name: "Fire pit",           category: "outdoor", iconName: "Flame",         searchable: false },
    ],
  },

  // ── Parking ───────────────────────────────────────────────────────────────
  {
    id: "parking",
    label: "Parking",
    iconName: "Car",
    amenities: [
      { id: "free_parking",      name: "Free private parking",  category: "parking", iconName: "Car",         searchable: true  },
      { id: "street_parking",    name: "Free street parking",   category: "parking", iconName: "Car",         searchable: false },
      { id: "paid_parking",      name: "Paid parking nearby",   category: "parking", iconName: "CircleDollarSign", searchable: false },
      { id: "ev_charger",        name: "EV charger",            category: "parking", iconName: "Zap",         searchable: true  },
      { id: "garage",            name: "Enclosed garage",       category: "parking", iconName: "Warehouse",   searchable: false },
      { id: "boat_dock",         name: "Boat dock",             category: "parking", iconName: "Anchor",      searchable: false, isPremium: true },
    ],
  },

  // ── Climate ───────────────────────────────────────────────────────────────
  {
    id: "climate",
    label: "Climate",
    iconName: "Thermometer",
    amenities: [
      { id: "ac",                 name: "Air conditioning",     category: "climate", iconName: "Wind",         searchable: true  },
      { id: "central_heating",    name: "Central heating",      category: "climate", iconName: "Thermometer",  searchable: false },
      { id: "underfloor_heating", name: "Underfloor heating",   category: "climate", iconName: "Thermometer",  searchable: false },
      { id: "ceiling_fan",        name: "Ceiling fan",          category: "climate", iconName: "Wind",         searchable: false },
      { id: "portable_fan",       name: "Portable fan",         category: "climate", iconName: "Wind",         searchable: false },
    ],
  },

  // ── Laundry ───────────────────────────────────────────────────────────────
  {
    id: "laundry",
    label: "Laundry",
    iconName: "Shirt",
    amenities: [
      { id: "washer",      name: "Washing machine",     category: "laundry", iconName: "Shirt",  searchable: true  },
      { id: "dryer",       name: "Dryer",               category: "laundry", iconName: "Wind",   searchable: false },
      { id: "iron",        name: "Iron & ironing board",category: "laundry", iconName: "Shirt",  searchable: false },
      { id: "drying_rack", name: "Drying rack",         category: "laundry", iconName: "Shirt",  searchable: false },
    ],
  },

  // ── Safety ────────────────────────────────────────────────────────────────
  {
    id: "safety",
    label: "Safety",
    iconName: "Shield",
    amenities: [
      { id: "smoke_detector",      name: "Smoke detector",             category: "safety", iconName: "AlertTriangle", searchable: false },
      { id: "co_detector",         name: "CO detector",                category: "safety", iconName: "AlertTriangle", searchable: false },
      { id: "fire_extinguisher",   name: "Fire extinguisher",          category: "safety", iconName: "Flame",         searchable: false },
      { id: "first_aid",           name: "First aid kit",              category: "safety", iconName: "HeartPulse",    searchable: false },
      { id: "security_camera_ext", name: "Security cameras (exterior)",category: "safety", iconName: "Camera",        searchable: false },
      { id: "safe",                name: "In-room safe",               category: "safety", iconName: "Lock",          searchable: false },
      { id: "deadbolt",            name: "Deadbolt lock",              category: "safety", iconName: "Lock",          searchable: false },
      { id: "keypad_entry",        name: "Keypad entry",               category: "safety", iconName: "KeyRound",      searchable: false },
    ],
  },

  // ── Family Friendly ───────────────────────────────────────────────────────
  {
    id: "family_friendly",
    label: "Family Friendly",
    iconName: "Baby",
    amenities: [
      { id: "crib",           name: "Baby crib",               category: "family_friendly", iconName: "Baby",      searchable: false },
      { id: "high_chair",     name: "High chair",              category: "family_friendly", iconName: "Baby",      searchable: false },
      { id: "baby_bath",      name: "Baby bathtub",            category: "family_friendly", iconName: "Bath",      searchable: false },
      { id: "baby_monitor",   name: "Baby monitor",            category: "family_friendly", iconName: "Monitor",   searchable: false },
      { id: "children_books", name: "Children's books & toys", category: "family_friendly", iconName: "BookOpen",  searchable: false },
      { id: "stair_gate",     name: "Stair gate",              category: "family_friendly", iconName: "Shield",    searchable: false },
      { id: "pool_fence",     name: "Pool fence",              category: "family_friendly", iconName: "Shield",    searchable: false },
    ],
  },

  // ── Accessibility ─────────────────────────────────────────────────────────
  {
    id: "accessibility",
    label: "Accessibility",
    iconName: "Accessibility",
    amenities: [
      { id: "step_free",          name: "Step-free access",        category: "accessibility", iconName: "Accessibility", searchable: false },
      { id: "wide_doorways",      name: "Wide doorways (>80cm)",   category: "accessibility", iconName: "DoorOpen",      searchable: false },
      { id: "ground_floor",       name: "Ground floor unit",       category: "accessibility", iconName: "Home",          searchable: false },
      { id: "elevator",           name: "Elevator access",         category: "accessibility", iconName: "ArrowUpDown",   searchable: false },
      { id: "roll_in_shower",     name: "Roll-in shower",          category: "accessibility", iconName: "Shower",        searchable: false },
      { id: "accessible_parking", name: "Accessible parking spot", category: "accessibility", iconName: "Car",           searchable: false },
    ],
  },

  // ── Services ──────────────────────────────────────────────────────────────
  {
    id: "services",
    label: "Services",
    iconName: "Star",
    amenities: [
      { id: "breakfast",       name: "Breakfast included",      category: "services", iconName: "Coffee",         searchable: true,  isPremium: false },
      { id: "self_checkin",    name: "Self check-in",           category: "services", iconName: "KeyRound",       searchable: true  },
      { id: "late_checkout",   name: "Late checkout available", category: "services", iconName: "Clock",          searchable: false },
      { id: "luggage_storage", name: "Luggage storage",         category: "services", iconName: "Package",        searchable: false },
      { id: "concierge",       name: "Concierge service",       category: "services", iconName: "Bell",           searchable: false, isPremium: true },
      { id: "daily_cleaning",  name: "Daily cleaning",          category: "services", iconName: "Sparkles",       searchable: false, isPremium: true },
      { id: "weekly_cleaning", name: "Weekly cleaning",         category: "services", iconName: "Sparkles",       searchable: false },
      { id: "welcome_package", name: "Welcome package",         category: "services", iconName: "Gift",           searchable: false },
      { id: "bike_rental",     name: "Bike rental",             category: "services", iconName: "Bike",           searchable: false },
      { id: "kayak_rental",    name: "Kayak/boat rental",       category: "services", iconName: "Anchor",         searchable: false },
    ],
  },
];

// ─── Derived Helpers ──────────────────────────────────────────────────────────

/** Flat array of every amenity across all categories */
export const ALL_AMENITIES: Amenity[] = AMENITY_CATEGORIES.flatMap(
  (cat) => cat.amenities
);

/**
 * Returns all amenities belonging to a given category id.
 * Returns an empty array if the category doesn't exist.
 */
export function getAmenitiesByCategory(categoryId: string): Amenity[] {
  const cat = AMENITY_CATEGORIES.find((c) => c.id === categoryId);
  return cat ? cat.amenities : [];
}

/**
 * Finds a single amenity by its id.
 * Returns undefined if not found.
 */
export function getAmenityById(id: string): Amenity | undefined {
  return ALL_AMENITIES.find((a) => a.id === id);
}

/** All amenities marked as searchable — used for quick-filter chips */
export const SEARCHABLE_AMENITIES: Amenity[] = ALL_AMENITIES.filter(
  (a) => a.searchable
);

/** All amenities marked as premium — highlighted with a badge */
export const PREMIUM_AMENITIES: Amenity[] = ALL_AMENITIES.filter(
  (a) => a.isPremium
);
