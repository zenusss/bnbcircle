import React, { useState } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

const DEMO_REVIEWS = [
  { id: "r1", guest: "Emma", listing: "Canal House Amsterdam", rating: 5, comment: "Absolutely stunning property! The canal views were breathtaking and the host was incredibly responsive. Would book again without hesitation.", date: "2026-05-15", hasResponse: false },
  { id: "r2", guest: "Lars", listing: "Modern Apartment", rating: 4, comment: "Great location and very clean. The check-in instructions were clear. One small issue with the hot water but otherwise perfect.", date: "2026-05-10", hasResponse: true, response: "Thank you so much Lars! We're sorry about the hot water issue — we've since fixed the boiler. Hope to welcome you again!" },
  { id: "r3", guest: "Sarah", listing: "Zeeland Villa", rating: 5, comment: "The villa exceeded all our expectations. Perfect for a family holiday. Kids loved the pool!", date: "2026-04-28", hasResponse: false },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= count ? "star-filled" : "star-empty"}`} />
      ))}
    </div>
  );
}

export default function HostReviews() {
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">Guest feedback about your properties</p>
      </div>

      <div className="space-y-4">
        {DEMO_REVIEWS.map((r) => (
          <div key={r.id} className="card-base p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{r.guest[0]}</div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{r.guest}</p>
                  <p className="text-xs text-muted-foreground">{r.listing} · {r.date}</p>
                </div>
              </div>
              <StarRow count={r.rating} />
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>

            {r.hasResponse && r.response && (
              <div className="ml-6 p-3 bg-muted/50 rounded-xl border-l-2 border-accent">
                <p className="text-xs font-bold text-accent mb-1">Your response</p>
                <p className="text-sm text-muted-foreground">{r.response}</p>
              </div>
            )}

            {!r.hasResponse && (
              <div>
                <button
                  onClick={() => setReplyOpen(replyOpen === r.id ? null : r.id)}
                  className="text-sm text-accent font-semibold hover:underline flex items-center gap-1"
                >
                  {replyOpen === r.id ? "Cancel" : "Reply to this review"}
                  {replyOpen === r.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {replyOpen === r.id && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={replies[r.id] || ""}
                      onChange={(e) => setReplies((prev) => ({ ...prev, [r.id]: e.target.value }))}
                      rows={3}
                      placeholder="Write a public response to this review..."
                      className="input-base resize-none"
                    />
                    <button className="btn-primary text-sm px-4 py-2">Submit response</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
