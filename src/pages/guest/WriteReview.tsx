import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Star, ChevronLeft, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_BOOKINGS: Record<string, { property: string; city: string; dates: string; image: string }> = {
  "bk1": { property: "Canal House Amsterdam", city: "Amsterdam", dates: "May 15–18, 2025", image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600&h=400&fit=crop" },
  "bk2": { property: "Modern Loft Vondelpark", city: "Amsterdam", dates: "Apr 10–13, 2025", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop" },
};

const CATEGORIES = [
  { key: "cleanliness", label: "Cleanliness" },
  { key: "communication", label: "Communication" },
  { key: "location", label: "Location" },
  { key: "value", label: "Value for money" },
];

function StarRating({ value, onChange, size = "md" }: { value: number; onChange: (v: number) => void; size?: "sm" | "md" | "lg" }) {
  const [hover, setHover] = useState(0);
  const sz = size === "lg" ? "w-10 h-10" : size === "md" ? "w-7 h-7" : "w-5 h-5";
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 active:scale-95">
          <Star className={cn(sz, "transition-colors", i <= (hover || value) ? "fill-primary text-primary" : "text-border fill-border")} />
        </button>
      ))}
    </div>
  );
}

export default function WriteReview() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const booking = DEMO_BOOKINGS[bookingId ?? "bk1"] ?? DEMO_BOOKINGS["bk1"];
  const [overall, setOverall] = useState(0);
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const setCat = (key: string, val: number) => setCategories(c => ({ ...c, [key]: val }));
  const avgCat = Object.values(categories).length > 0
    ? (Object.values(categories).reduce((a, b) => a + b, 0) / Object.values(categories).length).toFixed(1)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (overall === 0) { toast.error("Please select an overall rating"); return; }
    if (comment.length < 50) { toast.error("Review must be at least 50 characters"); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    toast.success("Review submitted! Thank you.");
    navigate("/app/trips");
  };

  return (
    <div className="min-h-screen bg-background pt-6 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link to="/app/trips" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to trips
        </Link>

        <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">Write a review</h1>
        <p className="text-muted-foreground text-sm mb-8">Your honest feedback helps other travelers make better decisions.</p>

        {/* Property card */}
        <div className="card-base p-4 flex gap-4 mb-8">
          <img src={booking.image} alt={booking.property} className="w-20 h-16 rounded-xl object-cover shrink-0" />
          <div>
            <p className="font-semibold text-foreground">{booking.property}</p>
            <p className="text-sm text-muted-foreground">{booking.city} · {booking.dates}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Overall rating */}
          <div className="card-base p-6">
            <h2 className="font-bold text-lg mb-1">Overall rating</h2>
            <p className="text-sm text-muted-foreground mb-4">How was your overall experience?</p>
            <StarRating value={overall} onChange={setOverall} size="lg" />
            {overall > 0 && (
              <p className="mt-2 text-sm font-medium text-primary">
                {["", "Poor", "Fair", "Good", "Great", "Exceptional"][overall]}
              </p>
            )}
          </div>

          {/* Category ratings */}
          <div className="card-base p-6">
            <h2 className="font-bold text-lg mb-1">Category ratings</h2>
            <p className="text-sm text-muted-foreground mb-5">Rate each category separately</p>
            <div className="space-y-5">
              {CATEGORIES.map(cat => (
                <div key={cat.key} className="flex items-center justify-between gap-4">
                  <label className="text-sm font-medium text-foreground w-32 shrink-0">{cat.label}</label>
                  <StarRating value={categories[cat.key] ?? 0} onChange={v => setCat(cat.key, v)} size="md" />
                  {categories[cat.key] > 0 && (
                    <span className="text-sm font-bold text-primary w-6 text-right">{categories[cat.key]}</span>
                  )}
                </div>
              ))}
            </div>
            {avgCat && (
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average category score</span>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-bold text-primary">{avgCat}</span>
                </div>
              </div>
            )}
          </div>

          {/* Written review */}
          <div className="card-base p-6">
            <h2 className="font-bold text-lg mb-1">Your review</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Share your experience — what did you love? What could be improved?{" "}
              <span className="text-xs">(minimum 50 characters)</span>
            </p>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={6}
              placeholder="We had an amazing stay at this beautiful canal house. The host was very welcoming and the location was perfect..."
              className={cn("input-base w-full resize-none",
                comment.length > 0 && comment.length < 50 ? "border-amber-400 focus:ring-amber-200" : "")}
            />
            <div className="flex items-center justify-between mt-2">
              <span className={cn("text-xs", comment.length < 50 ? "text-amber-500" : "text-green-600")}>
                {comment.length}/50 minimum
              </span>
              {comment.length >= 50 && <span className="text-xs text-green-600 font-medium">✓ Good to go</span>}
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting
              ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
              : <><Send className="w-5 h-5" /> Submit review</>}
          </button>
        </form>
      </div>
    </div>
  );
}
