import React, { useState } from "react";
import { Star, CheckCircle, EyeOff, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
const REVIEWS = [
  { id: "rv1", reviewer: "Emma", listing: "Canal House Amsterdam", rating: 5, comment: "Absolutely stunning property! The canal views were breathtaking.", status: "approved", date: "2026-05-15" },
  { id: "rv2", reviewer: "Lars", listing: "Modern Apartment", rating: 2, comment: "Many issues — unclean, broken appliances, host unresponsive.", status: "pending", date: "2026-05-20" },
  { id: "rv3", reviewer: "Sarah", listing: "Zeeland Villa", rating: 5, comment: "Perfect family holiday! The pool was amazing.", status: "approved", date: "2026-04-28" },
  { id: "rv4", reviewer: "Anon", listing: "Cosy Studio", rating: 1, comment: "Terrible.", status: "hidden", date: "2026-05-22" },
];
const STATUS_CLS: Record<string,string> = { approved: "badge-green", pending: "badge-yellow", hidden: "badge-red" };
export default function AdminReviews() {
  const [reviews, setReviews] = useState(REVIEWS);
  const setStatus = (id: string, status: string) => setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Review Moderation</h1>
      <div className="card-base divide-y divide-border">
        {reviews.map((r) => (
          <div key={r.id} className="p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm text-foreground">{r.reviewer}</p>
                  <span className="text-xs text-muted-foreground">·</span>
                  <p className="text-xs text-muted-foreground">{r.listing}</p>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map((s) => <Star key={s} className={cn("w-3 h-3", s <= r.rating ? "star-filled" : "star-empty")} />)}
                </div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={STATUS_CLS[r.status]}>{r.status}</span>
                <button onClick={() => setStatus(r.id, "approved")} title="Approve" className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"><CheckCircle className="w-4 h-4" /></button>
                <button onClick={() => setStatus(r.id, "hidden")} title="Hide" className="p-1.5 rounded-lg hover:bg-yellow-50 text-yellow-600"><EyeOff className="w-4 h-4" /></button>
                <button onClick={() => setReviews((prev) => prev.filter((x) => x.id !== r.id))} title="Delete" className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
