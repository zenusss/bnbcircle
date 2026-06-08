import React, { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  X,
  Copy,
  Check,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type PropertyType =
  | "apartment"
  | "house"
  | "villa"
  | "cabin"
  | "studio"
  | "room"
  | "boutique"
  | "pet-friendly";

type ListingStatus = "draft" | "pending_review" | "active" | "inactive";

type CancellationPolicy = "flexible" | "moderate" | "strict" | "non-refundable";

interface CalendarSource {
  id: string;
  url: string;
  status: "synced" | "error" | "pending";
  lastSynced?: string;
}

interface ListingForm {
  // Basic info
  title: string;
  description: string;
  propertyType: PropertyType;
  status: ListingStatus;
  instantBook: boolean;
  // Location
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  // Photos
  images: string[];
  coverIndex: number;
  // Amenities
  amenities: Set<string>;
  // Pricing
  pricePerNight: string;
  cleaningFee: string;
  serviceFeePercent: string;
  minNights: string;
  maxNights: string;
  maxGuests: string;
  // Calendar
  icalImportUrl: string;
  calendarSources: CalendarSource[];
  // Policies
  cancellationPolicy: CancellationPolicy;
  checkInTime: string;
  checkOutTime: string;
  houseRules: string;
}

// ─── Amenity options ──────────────────────────────────────────────────────────

const AMENITIES: { id: string; label: string; emoji: string }[] = [
  { id: "wifi", label: "WiFi", emoji: "📶" },
  { id: "kitchen", label: "Kitchen", emoji: "🍳" },
  { id: "parking", label: "Parking", emoji: "🚗" },
  { id: "air_conditioning", label: "Air conditioning", emoji: "❄️" },
  { id: "tv", label: "TV", emoji: "📺" },
  { id: "washer", label: "Washer", emoji: "🫧" },
  { id: "dryer", label: "Dryer", emoji: "♨️" },
  { id: "pool", label: "Pool", emoji: "🏊" },
  { id: "gym", label: "Gym", emoji: "🏋️" },
  { id: "balcony", label: "Balcony", emoji: "🌅" },
  { id: "garden", label: "Garden", emoji: "🌿" },
  { id: "fireplace", label: "Fireplace", emoji: "🔥" },
  { id: "elevator", label: "Elevator", emoji: "🛗" },
  { id: "baby_crib", label: "Baby crib", emoji: "🍼" },
  { id: "pet_friendly", label: "Pet friendly", emoji: "🐾" },
  { id: "smoking_allowed", label: "Smoking allowed", emoji: "🚬" },
  { id: "bbq_grill", label: "BBQ grill", emoji: "🥩" },
  { id: "hot_tub", label: "Hot tub", emoji: "🛁" },
  { id: "sauna", label: "Sauna", emoji: "🧖" },
  { id: "workspace", label: "Workspace", emoji: "💻" },
];

// ─── Demo data loader ─────────────────────────────────────────────────────────

function loadDemoListing(id: string): ListingForm {
  const base = getDefaultForm();
  return {
    ...base,
    title: "Canal House Amsterdam",
    description:
      "A charming 17th-century canal house in the heart of Amsterdam. Enjoy the authentic Dutch experience with modern comforts. Steps from the Jordaan neighbourhood's best restaurants and boutiques.\n\nThe house features original wooden beams, a traditional staircase, and views over the canal from the main bedroom.",
    propertyType: "house",
    status: "active",
    instantBook: true,
    streetAddress: "Keizersgracht 123",
    city: "Amsterdam",
    region: "North Holland",
    postalCode: "1015 CJ",
    country: "Netherlands",
    latitude: "52.3702",
    longitude: "4.8952",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    ],
    coverIndex: 0,
    amenities: new Set(["wifi", "kitchen", "parking", "tv", "washer", "balcony", "workspace"]),
    pricePerNight: "185",
    cleaningFee: "45",
    serviceFeePercent: "12",
    minNights: "2",
    maxNights: "30",
    maxGuests: "4",
    calendarSources: [
      {
        id: "cal-1",
        url: "https://calendar.google.com/calendar/ical/example/public/basic.ics",
        status: "synced",
        lastSynced: "2026-06-01T10:00:00Z",
      },
    ],
    cancellationPolicy: "moderate",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    houseRules:
      "No smoking inside. Quiet hours after 22:00. Maximum 4 guests. No parties or events. Pets allowed on request.",
  };
}

function getDefaultForm(): ListingForm {
  return {
    title: "",
    description: "",
    propertyType: "apartment",
    status: "draft",
    instantBook: false,
    streetAddress: "",
    city: "",
    region: "",
    postalCode: "",
    country: "Netherlands",
    latitude: "",
    longitude: "",
    images: [],
    coverIndex: 0,
    amenities: new Set(),
    pricePerNight: "",
    cleaningFee: "",
    serviceFeePercent: "12",
    minNights: "1",
    maxNights: "365",
    maxGuests: "2",
    icalImportUrl: "",
    calendarSources: [],
    cancellationPolicy: "moderate",
    checkInTime: "15:00",
    checkOutTime: "11:00",
    houseRules: "",
  };
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-base p-6 space-y-5">
      <div>
        <h2 className="text-base font-bold text-primary">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Form field ───────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ─── ICAL status badge ────────────────────────────────────────────────────────

const ICAL_STATUS_CLS: Record<string, string> = {
  synced: "badge-green",
  error: "badge-red",
  pending: "badge-yellow",
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminListingEditor() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState<ListingForm>(() =>
    isNew ? getDefaultForm() : loadDemoListing(id!)
  );

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [icalCopied, setIcalCopied] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // ── Helpers ────────────────────────────────────────────────────────────
  function setField<K extends keyof ListingForm>(key: K, value: ListingForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Photos ────────────────────────────────────────────────────────────
  function addImage() {
    const url = imageUrlInput.trim();
    if (!url) return;
    if (form.images.length >= 15) {
      toast.error("Maximum 15 images allowed.");
      return;
    }
    if (form.images.includes(url)) {
      toast.error("This image URL is already added.");
      return;
    }
    setField("images", [...form.images, url]);
    setImageUrlInput("");
    imageInputRef.current?.focus();
  }

  function removeImage(index: number) {
    const next = form.images.filter((_, i) => i !== index);
    setField("images", next);
    if (form.coverIndex >= next.length) {
      setField("coverIndex", Math.max(0, next.length - 1));
    } else if (form.coverIndex > index) {
      setField("coverIndex", form.coverIndex - 1);
    }
  }

  // ── Amenities ─────────────────────────────────────────────────────────
  function toggleAmenity(id: string) {
    const next = new Set(form.amenities);
    next.has(id) ? next.delete(id) : next.add(id);
    setField("amenities", next);
  }

  // ── iCal ─────────────────────────────────────────────────────────────
  function handleIcalImport() {
    const url = form.icalImportUrl.trim();
    if (!url) {
      toast.error("Please enter an iCal URL.");
      return;
    }
    if (!url.startsWith("http")) {
      toast.error("URL must start with http or https.");
      return;
    }
    const newSource: CalendarSource = {
      id: `cal-${Date.now()}`,
      url,
      status: "synced",
      lastSynced: new Date().toISOString(),
    };
    setForm((prev) => ({
      ...prev,
      calendarSources: [...prev.calendarSources, newSource],
      icalImportUrl: "",
    }));
    toast.success("Calendar source validated and imported!");
  }

  function removeCalendarSource(calId: string) {
    setField(
      "calendarSources",
      form.calendarSources.filter((s) => s.id !== calId)
    );
  }

  // ── iCal export URL ───────────────────────────────────────────────────
  const exportUrl = isNew
    ? "(Save listing first to get export URL)"
    : `https://bnbcircle.com/ical/${id}/export.ics`;

  function copyExportUrl() {
    if (isNew) return;
    navigator.clipboard.writeText(exportUrl).catch(() => {});
    setIcalCopied(true);
    toast.success("iCal URL copied to clipboard!");
    setTimeout(() => setIcalCopied(false), 2000);
  }

  // ── Save / Publish ────────────────────────────────────────────────────
  function handleSaveDraft() {
    if (!form.title.trim()) {
      toast.error("Please enter a listing title.");
      return;
    }
    toast.success("Listing saved!");
  }

  function handlePublish() {
    if (!form.title.trim()) {
      toast.error("Please enter a listing title.");
      return;
    }
    setField("status", "active");
    toast.success("Listing published!");
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 pb-28">
      {/* ── Page header ── */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/listings"
          className="p-2 rounded-xl hover:bg-muted transition-colors"
          title="Back to listings"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-primary">
          {isNew ? "Add new listing" : `Edit: ${form.title || "Untitled"}`}
        </h1>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: Basic Info
      ══════════════════════════════════════════════════════════════ */}
      <Section
        title="Basic Information"
        description="The core details that guests see in search results."
      >
        <Field label="Title" required>
          <input
            className="input-base w-full"
            placeholder="e.g. Charming Canal House in Amsterdam"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
          />
        </Field>

        <Field label="Description" required>
          <textarea
            className="input-base w-full resize-y"
            rows={10}
            placeholder="Describe your property in detail — location highlights, special features, nearby attractions…"
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Property type">
            <select
              className="input-base w-full"
              value={form.propertyType}
              onChange={(e) => setField("propertyType", e.target.value as PropertyType)}
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="cabin">Cabin</option>
              <option value="studio">Studio</option>
              <option value="room">Room</option>
              <option value="boutique">Boutique</option>
              <option value="pet-friendly">Pet-Friendly</option>
            </select>
          </Field>

          <Field label="Status">
            <select
              className="input-base w-full"
              value={form.status}
              onChange={(e) => setField("status", e.target.value as ListingStatus)}
            >
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
        </div>

        {/* Instant book toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
          <div>
            <p className="text-sm font-medium text-foreground">Instant Book</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Allow guests to book without host approval
            </p>
          </div>
          <button
            type="button"
            onClick={() => setField("instantBook", !form.instantBook)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40",
              form.instantBook ? "bg-accent" : "bg-muted-foreground/30"
            )}
            aria-checked={form.instantBook}
            role="switch"
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                form.instantBook ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: Location
      ══════════════════════════════════════════════════════════════ */}
      <Section title="Location" description="Where is your property located?">
        <Field label="Street address" required>
          <input
            className="input-base w-full"
            placeholder="e.g. Keizersgracht 123"
            value={form.streetAddress}
            onChange={(e) => setField("streetAddress", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="City" required>
            <input
              className="input-base w-full"
              placeholder="e.g. Amsterdam"
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
            />
          </Field>
          <Field label="Region / Province">
            <input
              className="input-base w-full"
              placeholder="e.g. North Holland"
              value={form.region}
              onChange={(e) => setField("region", e.target.value)}
            />
          </Field>
          <Field label="Postal code">
            <input
              className="input-base w-full"
              placeholder="e.g. 1015 CJ"
              value={form.postalCode}
              onChange={(e) => setField("postalCode", e.target.value)}
            />
          </Field>
          <Field label="Country">
            <input
              className="input-base w-full"
              placeholder="e.g. Netherlands"
              value={form.country}
              onChange={(e) => setField("country", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Latitude" hint="Decimal degrees, e.g. 52.3702">
            <input
              className="input-base w-full"
              type="number"
              step="0.0001"
              placeholder="52.3702"
              value={form.latitude}
              onChange={(e) => setField("latitude", e.target.value)}
            />
          </Field>
          <Field label="Longitude" hint="Decimal degrees, e.g. 4.8952">
            <input
              className="input-base w-full"
              type="number"
              step="0.0001"
              placeholder="4.8952"
              value={form.longitude}
              onChange={(e) => setField("longitude", e.target.value)}
            />
          </Field>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs">
          <LinkIcon className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            You can drag a pin on the map view to automatically fill in latitude and longitude. The exact address is hidden from guests — only the neighbourhood is shown.
          </span>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: Photos
      ══════════════════════════════════════════════════════════════ */}
      <Section
        title="Photos"
        description="Add image URLs. The cover image appears first in search results."
      >
        {/* Add image input */}
        <Field label="Add image URL" hint="Maximum 15 images. Supported: .jpg, .jpeg, .png, .webp">
          <div className="flex gap-2">
            <input
              ref={imageInputRef}
              className="input-base flex-1"
              placeholder="https://example.com/photo.jpg"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
            />
            <button
              type="button"
              onClick={addImage}
              disabled={form.images.length >= 15}
              className="btn-primary flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </Field>

        {/* Thumbnails grid */}
        {form.images.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {form.images.map((url, index) => (
              <div
                key={url + index}
                className={cn(
                  "relative group rounded-xl overflow-hidden border-2 transition-colors",
                  form.coverIndex === index
                    ? "border-accent"
                    : "border-transparent hover:border-border"
                )}
              >
                <img
                  src={url}
                  alt={`Photo ${index + 1}`}
                  className="w-full aspect-[4/3] object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://placehold.co/400x300/f0f0f0/999?text=Invalid+URL";
                  }}
                />
                {/* Cover badge */}
                {form.coverIndex === index && (
                  <span className="absolute top-1.5 left-1.5 text-[10px] font-bold bg-accent text-white px-1.5 py-0.5 rounded-md">
                    Cover
                  </span>
                )}
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {form.coverIndex !== index && (
                    <button
                      type="button"
                      onClick={() => setField("coverIndex", index)}
                      className="text-[10px] font-semibold bg-white text-foreground px-2 py-1 rounded-lg hover:bg-muted transition-colors"
                    >
                      Set cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-xl p-10 text-center text-muted-foreground text-sm">
            <div className="text-3xl mb-2">🖼️</div>
            <p>No photos yet. Add image URLs above.</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {form.images.length} / 15 images added
        </p>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: Amenities
      ══════════════════════════════════════════════════════════════ */}
      <Section
        title="Amenities"
        description="Select everything available at your property."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {AMENITIES.map((amenity) => {
            const checked = form.amenities.has(amenity.id);
            return (
              <label
                key={amenity.id}
                className={cn(
                  "flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors text-sm select-none",
                  checked
                    ? "border-accent bg-accent/10 text-accent font-medium"
                    : "border-border hover:bg-muted"
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(amenity.id)}
                  className="sr-only"
                />
                <span className="text-base leading-none">{amenity.emoji}</span>
                <span>{amenity.label}</span>
              </label>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {form.amenities.size} amenit{form.amenities.size !== 1 ? "ies" : "y"} selected
        </p>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 5: Pricing
      ══════════════════════════════════════════════════════════════ */}
      <Section title="Pricing" description="Set nightly rate, fees, and stay length limits.">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Price per night (€)" required>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">€</span>
              <input
                className="input-base w-full pl-7"
                type="number"
                min="0"
                placeholder="95"
                value={form.pricePerNight}
                onChange={(e) => setField("pricePerNight", e.target.value)}
              />
            </div>
          </Field>

          <Field label="Cleaning fee (€)">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">€</span>
              <input
                className="input-base w-full pl-7"
                type="number"
                min="0"
                placeholder="25"
                value={form.cleaningFee}
                onChange={(e) => setField("cleaningFee", e.target.value)}
              />
            </div>
          </Field>

          <Field label="Service fee %" hint="Platform fee charged to guests (0–30%)">
            <input
              className="input-base w-full"
              type="number"
              min="0"
              max="30"
              placeholder="12"
              value={form.serviceFeePercent}
              onChange={(e) => setField("serviceFeePercent", e.target.value)}
            />
          </Field>

          <Field label="Minimum nights">
            <input
              className="input-base w-full"
              type="number"
              min="1"
              value={form.minNights}
              onChange={(e) => setField("minNights", e.target.value)}
            />
          </Field>

          <Field label="Maximum nights">
            <input
              className="input-base w-full"
              type="number"
              min="1"
              value={form.maxNights}
              onChange={(e) => setField("maxNights", e.target.value)}
            />
          </Field>

          <Field label="Maximum guests">
            <input
              className="input-base w-full"
              type="number"
              min="1"
              value={form.maxGuests}
              onChange={(e) => setField("maxGuests", e.target.value)}
            />
          </Field>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 6: Availability / Calendar
      ══════════════════════════════════════════════════════════════ */}
      <Section
        title="Availability & Calendar"
        description="Sync external calendars via iCal to prevent double bookings."
      >
        {/* Import iCal */}
        <Field
          label="Import iCal calendar"
          hint="Paste a .ics URL from Airbnb, Booking.com, Google Calendar, etc."
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                className="input-base w-full pl-9"
                placeholder="https://calendar.google.com/…/basic.ics"
                value={form.icalImportUrl}
                onChange={(e) => setField("icalImportUrl", e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleIcalImport}
              className="btn-primary text-sm whitespace-nowrap"
            >
              Validate &amp; import
            </button>
          </div>
        </Field>

        {/* Imported sources list */}
        {form.calendarSources.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Imported calendar sources</p>
            {form.calendarSources.map((source) => (
              <div
                key={source.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20"
              >
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{source.url}</p>
                  {source.lastSynced && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Last synced:{" "}
                      {new Date(source.lastSynced).toLocaleDateString("nl-NL", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    ICAL_STATUS_CLS[source.status] ||
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  )}
                >
                  {source.status}
                </span>
                <button
                  type="button"
                  onClick={() => removeCalendarSource(source.id)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-600 transition-colors"
                  title="Remove calendar source"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Export iCal URL */}
        <Field
          label="Export iCal URL"
          hint="Share this URL with other platforms to keep your calendar in sync."
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                className="input-base w-full pl-9 bg-muted/30 cursor-default"
                readOnly
                value={exportUrl}
              />
            </div>
            <button
              type="button"
              onClick={copyExportUrl}
              disabled={isNew}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Copy to clipboard"
            >
              {icalCopied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {icalCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </Field>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 7: Policies
      ══════════════════════════════════════════════════════════════ */}
      <Section title="Policies" description="Define your rules and check-in/out times.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Cancellation policy">
            <select
              className="input-base w-full"
              value={form.cancellationPolicy}
              onChange={(e) =>
                setField("cancellationPolicy", e.target.value as CancellationPolicy)
              }
            >
              <option value="flexible">Flexible</option>
              <option value="moderate">Moderate</option>
              <option value="strict">Strict</option>
              <option value="non-refundable">Non-refundable</option>
            </select>
          </Field>

          <Field label="Check-in time">
            <input
              className="input-base w-full"
              type="time"
              value={form.checkInTime}
              onChange={(e) => setField("checkInTime", e.target.value)}
            />
          </Field>

          <Field label="Check-out time">
            <input
              className="input-base w-full"
              type="time"
              value={form.checkOutTime}
              onChange={(e) => setField("checkOutTime", e.target.value)}
            />
          </Field>
        </div>

        <Field
          label="House rules"
          hint="Visible to guests before they book."
        >
          <textarea
            className="input-base w-full resize-y"
            rows={5}
            placeholder="e.g. No smoking indoors. Quiet after 22:00. No parties. Pets allowed on request."
            value={form.houseRules}
            onChange={(e) => setField("houseRules", e.target.value)}
          />
        </Field>
      </Section>

      {/* ══════════════════════════════════════════════════════════════
          STICKY BOTTOM BAR
      ══════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 md:left-56 z-40 bg-white border-t border-border shadow-lg">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground hidden sm:block">
            {isNew
              ? "New listing — save as draft or publish directly."
              : `Editing: ${form.title || "Untitled"}`}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-border hover:bg-muted transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="btn-primary text-sm px-6"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
