import React from "react";
import { useParams, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// ─── Data ────────────────────────────────────────────────────────────────────

interface Step {
  number: number;
  title: string;
  description: string;
}

const GUEST_STEPS: Step[] = [
  {
    number: 1,
    title: "Check availability",
    description:
      "Select your dates and see real-time availability on the calendar.",
  },
  {
    number: 2,
    title: "Send a request",
    description:
      "Submit an availability request. The host will confirm or decline within 48 hours.",
  },
  {
    number: 3,
    title: "Get confirmed",
    description:
      "Once confirmed, you receive booking details and contact info.",
  },
  {
    number: 4,
    title: "Leave a review",
    description:
      "After your stay, leave an honest review to help future guests.",
  },
];

const HOST_STEPS: Step[] = [
  {
    number: 1,
    title: "Share your property details",
    description:
      "Tell us about your property — location, size, amenities, and what makes it special.",
  },
  {
    number: 2,
    title: "We check compliance & set up management",
    description:
      "Our team verifies your listing meets local regulations and prepares everything for guests.",
  },
  {
    number: 3,
    title: "We manage everything for you",
    description:
      "From guest communication and check-ins to reviews and payouts — we handle it all.",
  },
];

// ─── Step card ────────────────────────────────────────────────────────────────

function StepCard({ step, isLast }: { step: Step; isLast: boolean }) {
  return (
    <div className="flex gap-6">
      {/* Left: number + connector line */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-[color:var(--accent)] text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-sm">
          {step.number}
        </div>
        {!isLast && (
          <div className="flex-1 w-0.5 bg-border mt-2 min-h-8" />
        )}
      </div>

      {/* Right: content */}
      <div className={cn("flex-1", isLast ? "pb-0" : "pb-8")}>
        <h3 className="text-base font-semibold text-foreground mb-1">
          {step.title}
        </h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {step.description}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Section = "booking" | "hosting";

export default function HowItWorks() {
  const { section } = useParams<{ section?: string }>();
  const activeSection: Section =
    section === "hosting" ? "hosting" : "booking";

  const steps = activeSection === "booking" ? GUEST_STEPS : HOST_STEPS;

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">

        {/* ── Page heading ── */}
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          How it works
        </h1>

        {/* ── Tab switcher ── */}
        <div className="flex gap-2 mb-10 border-b border-border">
          <Link
            to="/how-it-works/booking"
            className={cn(
              "px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px",
              activeSection === "booking"
                ? "border-[color:var(--accent)] text-[color:var(--accent)]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            For Guests
          </Link>
          <Link
            to="/how-it-works/hosting"
            className={cn(
              "px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px",
              activeSection === "hosting"
                ? "border-[color:var(--accent)] text-[color:var(--accent)]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            For Hosts
          </Link>
        </div>

        {/* ── Steps ── */}
        <div>
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} isLast={i === steps.length - 1} />
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="mt-12 pt-8 border-t border-border">
          {activeSection === "booking" ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="text-muted-foreground text-[15px]">
                Ready to find your perfect stay?
              </p>
              <Link
                to="/search"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[color:var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Browse properties
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="text-muted-foreground text-[15px]">
                Ready to list your property?
              </p>
              <Link
                to="/signup?role=host"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[color:var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Become a host
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
