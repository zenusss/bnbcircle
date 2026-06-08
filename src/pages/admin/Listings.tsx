import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit2,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatEUR, PROPERTY_TYPE_LABELS } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ListingStatus = "active" | "pending_review" | "inactive" | "draft";

interface Listing {
  id: string;
  title: string;
  host: string;
  city: string;
  type: string;
  price: number;
  reviews: number;
  status: ListingStatus;
  image: string;
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMO_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Canal House Amsterdam",
    host: "Sarah van der Berg",
    city: "Amsterdam",
    type: "house",
    price: 185,
    reviews: 47,
    status: "active",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=80&h=80&fit=crop",
  },
  {
    id: "2",
    title: "Modern Apartment Vondelpark",
    host: "John Dekker",
    city: "Amsterdam",
    type: "apartment",
    price: 95,
    reviews: 89,
    status: "active",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=80&h=80&fit=crop",
  },
  {
    id: "3",
    title: "Zeeland Beach Villa",
    host: "Maria Bakker",
    city: "Middelburg",
    type: "villa",
    price: 420,
    reviews: 0,
    status: "pending_review",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=80&h=80&fit=crop",
  },
  {
    id: "4",
    title: "Cosy Studio The Hague",
    host: "Peter Kooij",
    city: "The Hague",
    type: "studio",
    price: 75,
    reviews: 134,
    status: "inactive",
    image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=80&h=80&fit=crop",
  },
  {
    id: "5",
    title: "Luxury Cabin Veluwe Forest",
    host: "Elena Smit",
    city: "Apeldoorn",
    type: "cabin",
    price: 210,
    reviews: 28,
    status: "active",
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=80&h=80&fit=crop",
  },
  {
    id: "6",
    title: "Boutique Room City Centre",
    host: "Tom Visser",
    city: "Rotterdam",
    type: "room",
    price: 60,
    reviews: 61,
    status: "active",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=80&h=80&fit=crop",
  },
  {
    id: "7",
    title: "Maastricht Heritage Apartment",
    host: "Anna Janssen",
    city: "Maastricht",
    type: "apartment",
    price: 115,
    reviews: 0,
    status: "draft",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=80&h=80&fit=crop",
  },
  {
    id: "8",
    title: "Pet-Friendly Country House",
    host: "Dirk Mulder",
    city: "Arnhem",
    type: "house",
    price: 155,
    reviews: 15,
    status: "pending_review",
    image: "https://images.unsplash.com/photo-1430285561322-7808604715df?w=80&h=80&fit=crop",
  },
];

const STATUS_LABELS: Record<ListingStatus, string> = {
  active: "Active",
  pending_review: "Pending Review",
  inactive: "Inactive",
  draft: "Draft",
};

const STATUS_CLS: Record<ListingStatus, string> = {
  active: "badge-green",
  pending_review: "badge-yellow",
  inactive: "badge-red",
  draft: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700",
};

const ALL_CITIES = [...new Set(DEMO_LISTINGS.map((l) => l.city))].sort();

const PAGE_SIZE = 10;

// ─── Delete confirmation dialog ───────────────────────────────────────────────

interface DeleteDialogProps {
  listing: Listing;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteDialog({ listing, onConfirm, onCancel }: DeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative card-base p-6 max-w-md w-full space-y-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-primary text-lg">Delete listing?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">"{listing.title}"</span>?
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-border hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Delete listing
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminListings() {
  const navigate = useNavigate();

  const [listings, setListings] = useState<Listing[]>(DEMO_LISTINGS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);

  // ── Filtering ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchSearch =
        !search ||
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.host.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      const matchCity = cityFilter === "all" || l.city === cityFilter;
      return matchSearch && matchStatus && matchCity;
    });
  }, [listings, search, statusFilter, cityFilter]);

  // ── Pagination ───────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearchChange(val: string) {
    setSearch(val);
    setPage(1);
  }
  function handleStatusChange(val: string) {
    setStatusFilter(val);
    setPage(1);
  }
  function handleCityChange(val: string) {
    setCityFilter(val);
    setPage(1);
  }

  // ── Status inline change ─────────────────────────────────────────────────
  function handleStatusUpdate(id: string, newStatus: ListingStatus) {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    toast.success(`Status updated to "${STATUS_LABELS[newStatus]}"`);
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  function confirmDelete() {
    if (!deleteTarget) return;
    setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.title}" has been deleted.`);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary">Listings</h1>
        <button
          onClick={() => navigate("/admin/listings/new")}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add listing
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            className="input-base pl-9 w-full"
            placeholder="Search listings or host…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <select
          className="input-base w-auto"
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending_review">Pending Review</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>
        <select
          className="input-base w-auto"
          value={cityFilter}
          onChange={(e) => handleCityChange(e.target.value)}
        >
          <option value="all">All cities</option>
          {ALL_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* ── Table ── */}
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {[
                  "Image",
                  "Title",
                  "Host",
                  "City",
                  "Type",
                  "Price/night",
                  "Reviews",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 opacity-30" />
                      <p className="font-medium">No listings found</p>
                      <p className="text-xs">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageItems.map((listing) => (
                  <tr key={listing.id} className="hover:bg-muted/30 transition-colors">
                    {/* Image */}
                    <td className="px-4 py-3">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://placehold.co/40x40/f0f0f0/999?text=?";
                        }}
                      />
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3 max-w-[180px]">
                      <button
                        onClick={() => navigate(`/admin/listings/${listing.id}/edit`)}
                        className="font-medium text-primary hover:underline text-left truncate block max-w-full"
                        title={listing.title}
                      >
                        {listing.title}
                      </button>
                    </td>

                    {/* Host */}
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {listing.host}
                    </td>

                    {/* City */}
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {listing.city}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {PROPERTY_TYPE_LABELS[listing.type] ?? listing.type}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 font-semibold text-primary whitespace-nowrap">
                      {formatEUR(listing.price)}
                    </td>

                    {/* Reviews */}
                    <td className="px-4 py-3 text-muted-foreground text-center">
                      {listing.reviews}
                    </td>

                    {/* Status chip */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={STATUS_CLS[listing.status]}>
                        {STATUS_LABELS[listing.status]}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Edit */}
                        <button
                          onClick={() => navigate(`/admin/listings/${listing.id}/edit`)}
                          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                          title="Edit listing"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>

                        {/* View */}
                        <a
                          href={`/listing/${listing.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                          title="View public listing"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </a>

                        {/* Status dropdown */}
                        <select
                          value={listing.status}
                          onChange={(e) =>
                            handleStatusUpdate(listing.id, e.target.value as ListingStatus)
                          }
                          className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-accent/40 transition-colors"
                          title="Change status"
                        >
                          <option value="active">Active</option>
                          <option value="pending_review">Pending Review</option>
                          <option value="inactive">Inactive</option>
                          <option value="draft">Draft</option>
                        </select>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget(listing)}
                          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filtered.length}</span> listings
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={cn(
                    "w-7 h-7 rounded-lg text-xs font-medium transition-colors",
                    n === currentPage
                      ? "bg-accent text-white"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Results count (no pagination case) ── */}
      {filtered.length <= PAGE_SIZE && filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* ── Delete confirmation dialog ── */}
      {deleteTarget && (
        <DeleteDialog
          listing={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
