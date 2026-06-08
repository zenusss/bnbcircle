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

export default function Fees() {
  return (
    <SimplePageWrapper title="Fees & Pricing">
      <p>Bnb Circle aims to keep pricing simple and transparent.</p>

      {/* For guests */}
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-foreground">For guests</h2>
        <p>
          The price you see during booking reflects the amount set by the host,
          including any applicable fees.
        </p>
      </div>

      {/* For hosts */}
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-foreground">For hosts</h2>
        <p>
          A service fee may apply for using the platform. This will be clearly
          communicated in your dashboard.
        </p>
      </div>

      <p>
        Cleaning fees and additional charges are set by the host and are always
        shown before confirming a booking.
      </p>
      <p>
        We do not apply hidden fees. All costs are visible before completing a
        reservation.
      </p>
    </SimplePageWrapper>
  );
}
