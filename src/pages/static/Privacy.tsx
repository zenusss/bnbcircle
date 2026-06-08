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

export default function Privacy() {
  return (
    <SimplePageWrapper title="Privacy Policy">
      {/* Last updated */}
      <p className="text-sm text-muted-foreground/80">Last updated: 7 May 2026</p>

      {/* Section 1 */}
      <section>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-2">
          1. Information we collect
        </h2>
        <p>
          We collect information you provide when creating an account, making a
          booking, or contacting us. This includes your name, email address,
          phone number, and payment information. We also collect usage data,
          device information, and cookies to improve our service.
        </p>
      </section>

      {/* Section 2 */}
      <section>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-2">
          2. How we use your information
        </h2>
        <p>
          We use your information to process bookings, communicate with you,
          provide customer support, send transactional emails (such as booking
          confirmations), and improve our platform. We do not sell your personal
          data to third parties.
        </p>
      </section>

      {/* Section 3 */}
      <section>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-2">
          3. Data sharing
        </h2>
        <p>
          We share your information with hosts to facilitate bookings, and with
          service providers (such as Stripe for payments and Resend for emails)
          who process data on our behalf under strict data protection agreements.
          We also share:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-1 mt-2">
          <li>
            Between guests and hosts for confirmed bookings (name, contact,
            message history).
          </li>
          <li>Access the personal data we hold about you.</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-2">
          4. Your rights (GDPR)
        </h2>
        <p>
          Under Dutch and EU law, you have the right to access, correct, delete,
          or export your personal data at any time. You may also object to or
          restrict processing. Contact us at{" "}
          <a
            href="mailto:office@bnb-circle.com"
            className="text-[color:var(--accent)] underline underline-offset-2"
          >
            office@bnb-circle.com
          </a>{" "}
          to exercise these rights.
        </p>
      </section>

      {/* Section 5 */}
      <section>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-2">
          5. Cookies
        </h2>
        <p>
          We use essential cookies for authentication and session management, and
          optional analytics cookies (with your consent). You can manage cookie
          preferences in your browser settings.
        </p>
      </section>

      {/* Section 6 */}
      <section>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-2">
          6. Data retention
        </h2>
        <p>
          We keep account data while your account is active and for up to 7
          years after closure to comply with Dutch tax law. Booking records are
          kept for 7 years. You may request earlier deletion where permitted by
          law.
        </p>
      </section>

      {/* Section 7 */}
      <section>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-2">
          7. Contact
        </h2>
        <p>
          For privacy questions, contact us at{" "}
          <a
            href="mailto:office@bnb-circle.com"
            className="text-[color:var(--accent)] underline underline-offset-2"
          >
            office@bnb-circle.com
          </a>
          .
        </p>
      </section>
    </SimplePageWrapper>
  );
}
