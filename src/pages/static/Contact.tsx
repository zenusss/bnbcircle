import React from "react";
import { SEO } from "@/components/SEO";
import { Mail } from "lucide-react";

// SimplePageWrapper mirrors the layout used in the original bnb-circle.com bundle
function SimplePageWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8">
          {title}
        </h1>
        <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <SimplePageWrapper title="Contact & Help">
      <SEO title="Contact & Help" description="Get in touch with the BnbCircle team." />
      <p>
        If you need help or have any questions, you can reach us directly.
      </p>

      {/* Email contact row */}
      <a
        href="mailto:office@bnb-circle.com"
        className="inline-flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
      >
        <Mail className="w-4 h-4 shrink-0" />
        office@bnb-circle.com
      </a>

      <p>
        We aim to respond as quickly as possible. For booking-related questions,
        please include your booking details in your message.
      </p>
      <p>
        For general inquiries, partnerships, or technical issues, feel free to
        contact us anytime.
      </p>
    </SimplePageWrapper>
  );
}
