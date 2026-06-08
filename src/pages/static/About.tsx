import React from "react";
import { SEO } from "@/components/SEO";

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

export default function About() {
  return (
    <SimplePageWrapper title="About Bnb Circle">
      <SEO title="About BnbCircle" description="We make short-term rentals simpler, more transparent, and more human." />
      <p>
        Bnb Circle is a platform designed to make short-term rentals simpler,
        more transparent, and more human.
      </p>
      <p>
        We are a team of young builders focused on creating a clean and reliable
        experience for both hosts and guests. Our goal is to remove unnecessary
        friction and keep things straightforward: clear listings, real
        communication, and fair booking flows.
      </p>
      <p>
        We believe that trust is built through clarity and consistency. That's
        why we focus on real availability, direct communication between host and
        guest, and simple processes that just work.
      </p>
      <p>
        Whether you are a host looking to manage your property efficiently or a
        guest searching for a place you can rely on, Bnb Circle is built to
        support that experience.
      </p>
    </SimplePageWrapper>
  );
}
