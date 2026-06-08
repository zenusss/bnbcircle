import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  Star,
  MessageSquare,
  Shield,
  Lock,
  Headphones,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Trust feature card data
const trustFeatures = [
  {
    icon: UserCheck,
    title: "Verified Profiles",
    description:
      "Hosts and guests go through identity verification. Look for the verified badge.",
  },
  {
    icon: Star,
    title: "Honest Reviews",
    description:
      "Only guests who completed a stay can leave reviews. Read real experiences from real people.",
  },
  {
    icon: MessageSquare,
    title: "Secure Messaging",
    description:
      "All communication happens within the platform. Never share personal info outside Bnb Circle.",
  },
  {
    icon: Shield,
    title: "Admin Moderation",
    description:
      "Our team reviews flagged content, enforces community standards, and resolves disputes.",
  },
  {
    icon: Lock,
    title: "Payment Protection",
    description:
      "Payments are held securely and only released to hosts after successful check-in.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our support team is available around the clock to help with any issues.",
  },
] as const;

export default function Trust() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
          Trust &amp; Support
        </h1>
        <p className="text-[16px] text-muted-foreground max-w-xl mx-auto mb-8">
          Your safety and peace of mind come first. From verified profiles to
          secure payments, we&rsquo;ve built trust into every layer.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="default">
            <a href="/contact">Contact support</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/faq">Read FAQ</a>
          </Button>
        </div>
      </section>

      {/* ── Safety cards ───────────────────────────────────────────── */}
      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <h2 className="text-2xl font-heading font-bold mb-8 text-center">
          How we keep you safe
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trustFeatures.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border">
              <CardContent className="p-6">
                {/* Icon container */}
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Admin CTA ──────────────────────────────────────────────── */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-heading font-bold mb-3">
            Explore moderation tools
          </h2>
          <p className="text-[15px] text-muted-foreground mb-6">
            Switch to Admin mode to explore moderation tools.
          </p>
          <Button onClick={() => navigate("/admin")}>
            Open admin dashboard
          </Button>
        </div>
      </section>
    </div>
  );
}
