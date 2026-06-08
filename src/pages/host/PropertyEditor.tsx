import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronRight, ChevronLeft, CheckCircle, MapPin, Upload, X, DollarSign, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Basics", "Location", "Photos", "Amenities", "Pricing", "Review"];

const AMENITY_OPTIONS = [
  { id: "wifi", icon: "📶", label: "WiFi" }, { id: "parking", icon: "🚗", label: "Parking" },
  { id: "pool", icon: "🏊", label: "Pool" }, { id: "kitchen", icon: "🍳", label: "Kitchen" },
  { id: "ac", icon: "❄️", label: "Air conditioning" }, { id: "washer", icon: "🫧", label: "Washer" },
  { id: "dryer", icon: "🌀", label: "Dryer" }, { id: "tv", icon: "📺", label: "Smart TV" },
  { id: "pets", icon: "🐾", label: "Pets allowed" }, { id: "garden", icon: "🌿", label: "Garden" },
  { id: "bbq", icon: "🔥", label: "BBQ" }, { id: "gym", icon: "💪", label: "Gym" },
];

const PROPERTY_TYPES = ["apartment", "house", "villa", "studio", "cabin", "other"];

export default function PropertyEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const isEditing = !!id;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: "", description: "", property_type: "apartment",
      bedrooms: 1, bathrooms: 1, max_guests: 2,
      city: "", region: "", address: "", postal_code: "", latitude: "", longitude: "",
      price_per_night: 80, cleaning_fee: 20, min_nights: 1, instant_book: false,
    }
  });

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setValue("latitude", pos.coords.latitude.toFixed(6));
      setValue("longitude", pos.coords.longitude.toFixed(6));
    });
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const onSubmit = (data: any) => {
    console.log("Submit", data, selectedAmenities, photos);
    navigate("/host/properties");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">{isEditing ? "Edit property" : "List a new property"}</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete all steps to publish your listing</p>
      </div>

      {/* Progress */}
      <div className="card-base p-4">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <button
                onClick={() => i <= step && setStep(i)}
                className={cn(
                  "flex flex-col items-center gap-1 text-xs font-medium transition-colors",
                  i === step ? "text-accent" : i < step ? "text-primary cursor-pointer" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                  i === step ? "border-accent bg-accent text-white" :
                  i < step ? "border-primary bg-primary text-white" :
                  "border-border bg-background text-muted-foreground"
                )}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className="hidden sm:block">{s}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-1", i < step ? "bg-primary" : "bg-border")} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="card-base p-6">
        {/* Step 0: Basics */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-primary">Tell us about your property</h2>
            <div>
              <label className="block text-sm font-medium mb-1.5">Listing title *</label>
              <input {...register("title", { required: true })} className="input-base" placeholder="e.g. Charming Canal House in Amsterdam" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description *</label>
              <textarea {...register("description", { required: true })} rows={5} className="input-base resize-none" placeholder="Describe your property, its highlights, and nearby attractions..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Property type *</label>
              <select {...register("property_type")} className="input-base">
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: "bedrooms" as const, label: "Bedrooms" },
                { name: "bathrooms" as const, label: "Bathrooms" },
                { name: "max_guests" as const, label: "Max guests" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                  <input {...register(f.name, { valueAsNumber: true })} type="number" min={0} className="input-base" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-primary">Where is your property?</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">City *</label>
                <input {...register("city", { required: true })} className="input-base" placeholder="Amsterdam" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Region</label>
                <input {...register("region")} className="input-base" placeholder="North Holland" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Street address</label>
              <input {...register("address")} className="input-base" placeholder="Keizersgracht 123" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Postal code</label>
              <input {...register("postal_code")} className="input-base" placeholder="1015 AB" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Latitude</label>
                <input {...register("latitude")} className="input-base" placeholder="52.3702" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Longitude</label>
                <input {...register("longitude")} className="input-base" placeholder="4.8952" />
              </div>
            </div>
            <button type="button" onClick={useCurrentLocation} className="btn-outline flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Use current location
            </button>
          </div>
        )}

        {/* Step 2: Photos */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-primary">Add photos</h2>
            <p className="text-sm text-muted-foreground">Upload up to 15 photos. HEIC, JPG, PNG and WebP supported.</p>
            <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-accent transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="font-medium text-foreground mb-1">Drag photos here or click to upload</p>
              <p className="text-xs text-muted-foreground">Max 15 MB per image · Max 15 images</p>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const urls = files.map((f) => URL.createObjectURL(f));
                setPhotos((prev) => [...prev, ...urls].slice(0, 15));
              }} />
            </div>
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {photos.map((url, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-white text-xs font-bold rounded-full">Cover</div>}
                    <button onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Amenities */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-primary">What amenities do you offer?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITY_OPTIONS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleAmenity(a.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border-2 text-sm font-medium transition-all",
                    selectedAmenities.includes(a.id)
                      ? "border-accent bg-accent/5 text-accent"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <span className="text-xl">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Pricing */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-primary">Set your pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Price per night (EUR) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <input {...register("price_per_night", { valueAsNumber: true })} type="number" min={1} className="input-base pl-7" placeholder="80" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Cleaning fee (EUR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                  <input {...register("cleaning_fee", { valueAsNumber: true })} type="number" min={0} className="input-base pl-7" placeholder="20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Minimum nights</label>
                <input {...register("min_nights", { valueAsNumber: true })} type="number" min={1} className="input-base" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div>
                <p className="font-medium text-sm text-foreground">Instant Book</p>
                <p className="text-xs text-muted-foreground">Guests can book without waiting for your approval</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register("instant_book")} className="sr-only peer" />
                <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-accent after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl text-sm text-muted-foreground">
              <strong className="text-primary">Note:</strong> A 12% service fee is charged to guests. You receive 100% of your listed price — Bnb Circle charges no host commission.
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-primary">Review and publish</h2>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm">
              Your listing will be submitted for review. Once approved it will go live on Bnb Circle.
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: "Title", value: watch("title") || "—" },
                { label: "Property type", value: watch("property_type") || "—" },
                { label: "Location", value: `${watch("city") || "—"}, Netherlands` },
                { label: "Bedrooms", value: watch("bedrooms") },
                { label: "Max guests", value: watch("max_guests") },
                { label: "Price per night", value: `€${watch("price_per_night")}` },
                { label: "Cleaning fee", value: `€${watch("cleaning_fee")}` },
                { label: "Photos", value: `${photos.length} uploaded` },
                { label: "Amenities", value: `${selectedAmenities.length} selected` },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium text-foreground">{String(row.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={goBack} disabled={step === 0} className="btn-outline disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={goNext} className="btn-primary">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit(onSubmit)} className="btn-primary">
            <CheckCircle className="w-4 h-4" /> Submit for review
          </button>
        )}
      </div>
    </div>
  );
}
