import React from "react";

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

// Reusable section heading
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-foreground pt-2">{children}</h2>
  );
}

// Reusable bullet list
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside space-y-2 pl-1">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function Terms() {
  return (
    <SimplePageWrapper title="Terms of Service">
      {/* Last updated */}
      <p className="text-sm text-muted-foreground/80">Last updated: 7 May 2026</p>

      {/* Intro */}
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
        Bnb Circle platform, websites, and services (the &ldquo;Service&rdquo;) operated by
        Bnb Circle (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). By creating an account or using the
        Service, you agree to be bound by these Terms. If you do not agree, do
        not use the Service.
      </p>

      {/* Section 1 */}
      <div className="space-y-2">
        <SectionHeading>1. The Service</SectionHeading>
        <p>
          Bnb Circle is an online marketplace that connects guests looking for
          short-term accommodation with hosts offering vacation rentals,
          primarily in the Netherlands. We are not a party to any rental
          agreement between guests and hosts. Hosts are independent third parties
          responsible for their listings, prices, availability, and the property
          itself.
        </p>
      </div>

      {/* Section 2 */}
      <div className="space-y-2">
        <SectionHeading>2. Eligibility &amp; Accounts</SectionHeading>
        <BulletList
          items={[
            "You must be at least 18 years old to create an account.",
            "You must provide accurate and complete information when registering.",
            "You are responsible for keeping your login credentials secure and for all activity on your account.",
            "We may refuse, suspend, or terminate accounts that violate these Terms or applicable law.",
          ]}
        />
      </div>

      {/* Section 3 */}
      <div className="space-y-2">
        <SectionHeading>3. Bookings</SectionHeading>
        <BulletList
          items={[
            "A booking request becomes a confirmed reservation only when both the host accepts and the guest completes the required confirmation step.",
            "Pending requests automatically expire after 48 hours; host-confirmed requests expire after 24 hours if the guest does not finalize.",
            "The total price displayed at checkout includes the nightly rate, any cleaning fee set by the host, and a Bnb Circle service fee of 12%.",
            "Cancellations are governed by the cancellation policy displayed on the listing at the time of booking.",
          ]}
        />
      </div>

      {/* Section 4 */}
      <div className="space-y-2">
        <SectionHeading>4. Host Responsibilities</SectionHeading>
        <BulletList
          items={[
            "Provide accurate listing information, photos, prices, and availability.",
            "Comply with all applicable local laws, permits, taxes, and safety requirements.",
            "Honor confirmed bookings and provide the property as described.",
            "Communicate respectfully and promptly with guests through our messaging system.",
          ]}
        />
      </div>

      {/* Section 5 */}
      <div className="space-y-2">
        <SectionHeading>5. Guest Responsibilities</SectionHeading>
        <BulletList
          items={[
            "Treat the property, neighbors, and host with respect.",
            "Follow the house rules and check-in/check-out times.",
            "Pay for any damage you or your party cause beyond reasonable wear and tear.",
            "Provide truthful reviews based on your actual stay.",
          ]}
        />
      </div>

      {/* Section 6 */}
      <div className="space-y-2">
        <SectionHeading>6. Fees &amp; Payments</SectionHeading>
        <p>
          Bnb Circle charges a service fee on bookings to cover platform
          operations. Hosts may set their own nightly rates and optional cleaning
          fees. Payment processing, where enabled, is handled by regulated
          third-party providers; we do not store card data.
        </p>
      </div>
    </SimplePageWrapper>
  );
}
