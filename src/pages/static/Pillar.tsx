import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  Search,
  Home,
  ShieldCheck,
  Star,
  Map,
  Calendar,
  Banknote,
  CheckCircle,
  ArrowRight,
  Heart,
  Users,
  Camera,
  MessageCircle,
  Globe,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type PillarSlug = "discover" | "book" | "host" | "trust";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface PillarConfig {
  slug: PillarSlug;
  label: string;
  headline: string;
  subheadline: string;
  heroBg: string;
  heroImage: string;
  intro: string;
  features: Feature[];
  ctaLabel: string;
  ctaHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  stats: { value: string; label: string }[];
}

// ─── Pillar Configs ────────────────────────────────────────────────────────────
const pillars: Record<PillarSlug, PillarConfig> = {
  discover: {
    slug: "discover",
    label: "Discover",
    headline: "Discover the Netherlands like never before",
    subheadline: "From canals to coastlines, find your perfect Dutch escape",
    heroBg: "from-sky-900 to-[#0B1F3A]",
    heroImage:
      "https://images.unsplash.com/photo-1548599990-33f0f62a5d01?w=1400&q=80",
    intro:
      "The Netherlands is a country of extraordinary variety—medieval city centres, windmill-dotted polders, wild North Sea dunes, and charming fishing villages. Bnb Circle connects you to 1,200+ unique properties spread across all 12 provinces. Whether you're planning a romantic weekend, a family adventure, or a solo city break, we have the perfect home waiting.",
    features: [
      {
        icon: <Map className="w-6 h-6" />,
        title: "Explore on the map",
        description:
          "Browse interactive maps to find properties exactly where you want to be—within walking distance of museums, near the beach, or deep in the countryside.",
      },
      {
        icon: <Search className="w-6 h-6" />,
        title: "Powerful search filters",
        description:
          "Filter by property type, amenities, price range, pet-friendliness, number of bedrooms, and more. Find exactly what fits your needs.",
      },
      {
        icon: <Heart className="w-6 h-6" />,
        title: "Save your favourites",
        description:
          "Create wishlists to save properties you love and compare them later. Perfect for planning group trips where everyone can weigh in.",
      },
      {
        icon: <Globe className="w-6 h-6" />,
        title: "12 provinces covered",
        description:
          "From Amsterdam and Utrecht to Friesland, Zeeland, and Limburg—discover properties in every corner of the Netherlands.",
      },
      {
        icon: <Camera className="w-6 h-6" />,
        title: "Photo-rich listings",
        description:
          "Every listing features multiple high-quality photos so you know exactly what to expect before you arrive.",
      },
      {
        icon: <Star className="w-6 h-6" />,
        title: "Curated quality",
        description:
          "Our team reviews every listing before it goes live. No low-quality photos or misleading descriptions on our platform.",
      },
    ],
    ctaLabel: "Start Exploring",
    ctaHref: "/search",
    ctaSecondaryLabel: "View All Locations",
    ctaSecondaryHref: "/locations",
    stats: [
      { value: "1,200+", label: "Properties" },
      { value: "12", label: "Provinces" },
      { value: "50+", label: "Destinations" },
      { value: "4.9★", label: "Average rating" },
    ],
  },
  book: {
    slug: "book",
    label: "Book",
    headline: "Book with total confidence",
    subheadline: "Simple checkout, transparent pricing, secure payments",
    heroBg: "from-emerald-900 to-[#0B1F3A]",
    heroImage:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1400&q=80",
    intro:
      "Booking a holiday rental should be the easy part. Bnb Circle makes checkout simple: choose your dates, see a complete price breakdown with no hidden fees, and confirm with your preferred payment method. Whether you book instantly or request a stay, we keep you informed every step of the way.",
    features: [
      {
        icon: <Calendar className="w-6 h-6" />,
        title: "Instant or request",
        description:
          "Choose between Instant Book (confirmed immediately) or Request to Book (host approves within 24 hours). Both are fully protected.",
      },
      {
        icon: <CheckCircle className="w-6 h-6" />,
        title: "No hidden fees",
        description:
          "Every cost—nightly rate, cleaning fee, and our 12% service fee—is shown upfront before you confirm. The total you see is the total you pay.",
      },
      {
        icon: <Lock className="w-6 h-6" />,
        title: "Secure payments",
        description:
          "Pay by card, iDEAL, Bancontact, or SEPA transfer. All payments are PCI-DSS Level 1 compliant. Your financial data is never stored on our servers.",
      },
      {
        icon: <MessageCircle className="w-6 h-6" />,
        title: "Direct host messaging",
        description:
          "Message hosts before and after booking to ask questions, coordinate check-in, or request local tips. No need for external chat apps.",
      },
      {
        icon: <ShieldCheck className="w-6 h-6" />,
        title: "Guest protection",
        description:
          "If a property significantly misrepresents itself, report it within 24 hours of check-in. We'll find you alternatives and refund where applicable.",
      },
      {
        icon: <Star className="w-6 h-6" />,
        title: "Real reviews",
        description:
          "Read honest reviews from verified guests. Our double-blind system ensures every review is genuine and uninfluenced.",
      },
    ],
    ctaLabel: "Find a Stay",
    ctaHref: "/search",
    ctaSecondaryLabel: "How Booking Works",
    ctaSecondaryHref: "/how-it-works/booking",
    stats: [
      { value: "5 min", label: "Average checkout time" },
      { value: "12%", label: "Service fee (guests)" },
      { value: "0", label: "Hidden fees" },
      { value: "24h", label: "Host response window" },
    ],
  },
  host: {
    slug: "host",
    label: "Host",
    headline: "Host your property, keep your profits",
    subheadline: "0% commission. You earn more. We grow together.",
    heroBg: "from-orange-900 to-[#0B1F3A]",
    heroImage:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80",
    intro:
      "Bnb Circle was built for hosts first. We believe property owners deserve a platform that works in their favour—not one that takes a 15% cut. List your property for free, set your own prices, and keep every euro your guests pay. Our tools make managing bookings, calendar, and payouts effortless.",
    features: [
      {
        icon: <Banknote className="w-6 h-6" />,
        title: "0% commission, always",
        description:
          "We charge hosts zero commission. Ever. Our revenue comes from the guest service fee, so our incentives align with yours.",
      },
      {
        icon: <Calendar className="w-6 h-6" />,
        title: "Calendar & iCal sync",
        description:
          "Manage availability with an easy calendar tool and sync with Airbnb, Booking.com, and VRBO via iCal to prevent double bookings.",
      },
      {
        icon: <Users className="w-6 h-6" />,
        title: "Guest screening",
        description:
          "Choose Instant Book or Request to Book. Review guest profiles and message before accepting. Set requirements like verified ID.",
      },
      {
        icon: <Home className="w-6 h-6" />,
        title: "Beautiful listings",
        description:
          "Our listing editor makes it easy to showcase your property with great photos, detailed descriptions, and an amenity checklist guests love.",
      },
      {
        icon: <Star className="w-6 h-6" />,
        title: "Superhost programme",
        description:
          "High-performing hosts earn Superhost status with priority placement, a badge, and access to exclusive host events.",
      },
      {
        icon: <MessageCircle className="w-6 h-6" />,
        title: "Dedicated host support",
        description:
          "Superhosts get priority phone support. All hosts have access to our Help Centre, host community forum, and monthly webinars.",
      },
    ],
    ctaLabel: "Start Hosting Free",
    ctaHref: "/signup",
    ctaSecondaryLabel: "Host Guide",
    ctaSecondaryHref: "/how-it-works/hosting",
    stats: [
      { value: "0%", label: "Host commission" },
      { value: "24h", label: "Payout after check-in" },
      { value: "800+", label: "Active hosts" },
      { value: "€1,400", label: "Avg. monthly earnings" },
    ],
  },
  trust: {
    slug: "trust",
    label: "Trust",
    headline: "Built on trust, protected at every step",
    subheadline: "Verified identities, honest reviews, and secure payments",
    heroBg: "from-slate-900 to-[#0B1F3A]",
    heroImage:
      "https://images.unsplash.com/photo-1563237023-b1e970526dcb?w=1400&q=80",
    intro:
      "Trust is not a feature—it's the foundation of everything we build. Bnb Circle uses multiple overlapping layers of protection to ensure that every host is who they say they are, every listing is what it claims to be, and every payment is fully secure.",
    features: [
      {
        icon: <ShieldCheck className="w-6 h-6" />,
        title: "Biometric ID verification",
        description:
          "Every user verifies their identity with a government-issued ID and live selfie. Verified accounts display a badge and have significantly lower dispute rates.",
      },
      {
        icon: <Star className="w-6 h-6" />,
        title: "Double-blind reviews",
        description:
          "Reviews are hidden until both parties submit or the window closes—so neither party can influence the other. Only verified guests can review.",
      },
      {
        icon: <Lock className="w-6 h-6" />,
        title: "End-to-end encryption",
        description:
          "All platform data uses TLS 1.3 in transit and AES-256 at rest. We conduct regular independent penetration testing.",
      },
      {
        icon: <CheckCircle className="w-6 h-6" />,
        title: "Listing quality checks",
        description:
          "Every listing goes through a quality review before going live. Our team checks photos, descriptions, and legal compliance.",
      },
      {
        icon: <Globe className="w-6 h-6" />,
        title: "Regulatory compliance",
        description:
          "We are GDPR compliant, work with Dutch regulators, and ensure our payment infrastructure meets EU financial regulations.",
      },
      {
        icon: <MessageCircle className="w-6 h-6" />,
        title: "24/7 safety support",
        description:
          "Active guests can reach our emergency line at any time. Our safety team reviews all incident reports within 24 hours.",
      },
    ],
    ctaLabel: "Trust & Safety Details",
    ctaHref: "/trust",
    ctaSecondaryLabel: "Read Our Privacy Policy",
    ctaSecondaryHref: "/privacy",
    stats: [
      { value: "99.8%", label: "Stays without incident" },
      { value: "< 24h", label: "Safety report resolution" },
      { value: "100%", label: "Users ID-verified" },
      { value: "4.9★", label: "Platform trust score" },
    ],
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Pillar() {
  const { slug } = useParams<{ slug: string }>();
  const config = pillars[slug as PillarSlug];

  if (!config) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="pt-16 md:pt-20">
      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={config.heroImage}
            alt={config.label}
            className="w-full h-full object-cover"
          />
          <div className={cn("absolute inset-0 bg-gradient-to-r opacity-80", config.heroBg)} />
        </div>
        <div className="relative z-10 section-container py-20 md:py-32">
          <div className="max-w-2xl">
            <span className="badge-accent mb-4">{config.label}</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6 leading-tight hero-text-shadow">
              {config.headline}
            </h1>
            <p className="text-white/80 text-xl leading-relaxed mb-8">
              {config.subheadline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={config.ctaHref} className="btn-primary">
                {config.ctaLabel} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={config.ctaSecondaryHref}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium text-sm"
              >
                {config.ctaSecondaryLabel} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-[#E8743C]">
        <div className="section-container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {config.stats.map((s) => (
              <div key={s.label} className="text-center text-white">
                <div className="text-3xl md:text-4xl font-bold">{s.value}</div>
                <div className="text-sm text-white/80 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="section-padding">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">{config.intro}</p>
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="section-padding bg-slate-50">
        <div className="section-container">
          <div className="text-center mb-16">
            <span className="section-label">What We Offer</span>
            <h2 className="section-title mt-2 mb-4">Everything you need</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.features.map((feature) => (
              <div
                key={feature.title}
                className="card-base p-6 group hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8743C]/10 flex items-center justify-center text-[#E8743C] mb-4 group-hover:bg-[#E8743C] group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-[#0B1F3A] mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related pillars ── */}
      <section className="section-padding">
        <div className="section-container">
          <div className="text-center mb-12">
            <span className="section-label">Explore More</span>
            <h2 className="section-title mt-2 mb-4">Discover other pillars</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {(Object.values(pillars) as PillarConfig[])
              .filter((p) => p.slug !== config.slug)
              .map((p) => (
                <Link
                  key={p.slug}
                  to={`/pillar/${p.slug}`}
                  className="card-base overflow-hidden group hover:-translate-y-1 transition-transform"
                >
                  <div className="h-32 relative overflow-hidden">
                    <img
                      src={p.heroImage}
                      alt={p.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#0B1F3A]/50" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-white font-bold text-lg">{p.label}</span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {p.subheadline}
                    </p>
                    <ArrowRight className="w-4 h-4 text-[#E8743C] shrink-0 ml-2" />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-padding bg-[#0B1F3A]">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Join 50,000+ guests and 800+ hosts who've made Bnb Circle their
            go-to platform for Dutch vacation rentals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={config.ctaHref} className="btn-primary">
              {config.ctaLabel} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={config.ctaSecondaryHref}
              className="btn-outline border-white/40 text-white hover:bg-white hover:text-[#0B1F3A]"
            >
              {config.ctaSecondaryLabel}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
