import React from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Eye, Star, MapPin, Building2 } from "lucide-react";
import { cn, formatEUR, PROPERTY_TYPE_LABELS } from "@/lib/utils";

const DEMO_PROPS = [
  { id: "1", title: "Canal House Amsterdam", city: "Amsterdam", type: "house", status: "active", price: 185, bookings: 23, rating: 4.9, image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=120&h=80&fit=crop" },
  { id: "2", title: "Modern Apartment Vondelpark", city: "Amsterdam", type: "apartment", status: "active", price: 95, bookings: 67, rating: 4.7, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=120&h=80&fit=crop" },
  { id: "3", title: "Zeeland Beach Villa", city: "Middelburg", type: "villa", status: "pending_review", price: 420, bookings: 0, rating: null, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=120&h=80&fit=crop" },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  active: { label: "Active", cls: "badge-green" },
  draft: { label: "Draft", cls: "status-draft" },
  pending_review: { label: "Pending review", cls: "badge-yellow" },
  inactive: { label: "Inactive", cls: "badge-red" },
};

export default function HostProperties() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">My Properties</h1>
          <p className="text-sm text-muted-foreground mt-1">{DEMO_PROPS.length} properties listed</p>
        </div>
        <Link to="/host/properties/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Add property
        </Link>
      </div>

      <div className="space-y-4">
        {DEMO_PROPS.map((p) => {
          const s = STATUS_MAP[p.status] || STATUS_MAP.draft;
          return (
            <div key={p.id} className="card-base p-4 flex items-center gap-4">
              <img src={p.image} alt={p.title} className="w-24 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground text-sm truncate">{p.title}</h3>
                  <span className={cn(s.cls, "flex-shrink-0")}>{s.label}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.city}</span>
                  <span>{PROPERTY_TYPE_LABELS[p.type]}</span>
                  <span>{p.bookings} bookings</span>
                  {p.rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 star-filled" />{p.rating}</span>}
                </div>
                <p className="text-sm font-bold text-primary mt-1">{formatEUR(p.price)}<span className="text-xs font-normal text-muted-foreground">/night</span></p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to={`/listing/${p.id}`} className="p-2 rounded-lg hover:bg-muted transition-colors" title="View">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </Link>
                <Link to={`/host/properties/${p.id}/edit`} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Edit">
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {DEMO_PROPS.length === 0 && (
        <div className="card-base p-16 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-bold text-foreground mb-2">No properties yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Start earning by listing your first property.</p>
          <Link to="/host/properties/new" className="btn-primary">Add your first property</Link>
        </div>
      )}
    </div>
  );
}
