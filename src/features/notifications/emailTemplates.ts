// ─────────────────────────────────────────────────────────────
// features/notifications/emailTemplates.ts
// Email template definitions, rendering engine, and config
// ─────────────────────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────────

export interface EmailTemplate {
  /** Unique snake_case identifier */
  id: string;
  /** Human-readable display name */
  name: string;
  /** UI grouping category */
  category: "booking" | "auth" | "reviews" | "notifications";
  /** Email subject line (may contain {{variables}}) */
  subject: string;
  /** Full HTML body with inline styles */
  htmlBody: string;
  /** List of variable names used in this template */
  variables: string[];
  /** Description of when this email is triggered */
  trigger: string;
  /** ISO timestamp of last save (demo: static) */
  lastSaved?: string;
}

export interface NotificationConfig {
  fromName: string;
  fromEmail: string;
  replyTo: string;
  logoUrl: string;
  siteUrl: string;
  unsubscribeUrl: string;
  supportEmail: string;
  primaryColor: string;
  accentColor: string;
}

// ── Shared layout helpers ─────────────────────────────────────

const ACCENT = "#C96A3E";
const NAVY   = "#0B1F3A";

/**
 * Wraps an inner HTML block in the standard BnbCircle email shell.
 * Uses 100% inline styles so it renders in all major email clients.
 */
function emailShell(innerHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Bnb Circle</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(11,31,58,0.08);">

          <!-- Header / Logo -->
          <tr>
            <td style="background:${NAVY};padding:28px 40px;text-align:center;">
              <span style="font-size:26px;font-weight:800;color:${ACCENT};letter-spacing:-0.5px;">Bnb</span>
              <span style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Circle</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              ${innerHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8f8f9;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#6b7280;">
                You received this email from Bnb Circle &mdash; the Dutch vacation rental marketplace.
              </p>
              <p style="margin:0;font-size:12px;color:#6b7280;">
                <a href="{{unsubscribe_link}}" style="color:${ACCENT};text-decoration:none;">Unsubscribe</a>
                &nbsp;&middot;&nbsp;
                <a href="https://bnb-circle.com/privacy" style="color:${ACCENT};text-decoration:none;">Privacy policy</a>
                &nbsp;&middot;&nbsp;
                <a href="https://bnb-circle.com" style="color:${ACCENT};text-decoration:none;">bnb-circle.com</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;">© 2026 Bnb Circle B.V. &mdash; Amsterdam, Netherlands</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Standard CTA button for email */
function ctaButton(text: string, href: string): string {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
  <tr>
    <td align="center" style="border-radius:10px;background:${ACCENT};">
      <a href="${href}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;font-family:'Segoe UI',Arial,sans-serif;">${text}</a>
    </td>
  </tr>
</table>`;
}

/** Info row used in booking summary boxes */
function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;font-size:14px;color:#6b7280;width:140px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;font-size:14px;color:${NAVY};font-weight:600;">${value}</td>
  </tr>`;
}

/** Booking summary table */
function bookingTable(rows: Array<[string, string]>): string {
  return `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f8f9fc;border-radius:12px;padding:20px 24px;margin:24px 0;">
  ${rows.map(([l, v]) => infoRow(l, v)).join("\n")}
</table>`;
}

// ── Template bodies ───────────────────────────────────────────

const BOOKING_REQUEST_GUEST_BODY = emailShell(`
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${NAVY};">Your booking request was sent! 🎉</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
  Hi {{guest_name}},<br/><br/>
  Great news — your booking request for <strong>{{listing_title}}</strong> has been sent to the host.
  You'll receive a confirmation once they respond, usually within 24 hours.
</p>
${bookingTable([
  ["Property", "{{listing_title}}"],
  ["Location", "{{city}}, Netherlands"],
  ["Check-in", "{{check_in}}"],
  ["Check-out", "{{check_out}}"],
  ["Guests", "{{guests}}"],
  ["Total price", "{{total_price}}"],
])}
<p style="margin:0 0 4px;font-size:14px;color:#6b7280;">Want to review your request or send a message to the host?</p>
${ctaButton("View booking request", "{{login_link}}")}
<p style="margin:0;font-size:13px;color:#9ca3af;">If you have questions, reply to this email or contact us at <a href="mailto:hello@bnb-circle.com" style="color:${ACCENT};">hello@bnb-circle.com</a>.</p>
`);

const BOOKING_REQUEST_HOST_BODY = emailShell(`
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${NAVY};">You have a new booking request! 🏠</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
  Hi {{host_name}},<br/><br/>
  <strong>{{guest_name}}</strong> has sent a booking request for your property <strong>{{listing_title}}</strong>.
  Please respond within 24 hours to keep your response rate high.
</p>
${bookingTable([
  ["Guest", "{{guest_name}}"],
  ["Check-in", "{{check_in}}"],
  ["Check-out", "{{check_out}}"],
  ["Guests", "{{guests}}"],
  ["Payout", "{{host_payout}}"],
])}
<p style="margin:0 0 4px;font-size:14px;color:#6b7280;">Review the guest profile and decide whether to accept or decline.</p>
${ctaButton("Review request", "{{login_link}}")}
<p style="margin:0;font-size:13px;color:#9ca3af;">You have <strong>24 hours</strong> to respond before the request expires automatically.</p>
`);

const BOOKING_CONFIRMED_GUEST_BODY = emailShell(`
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${NAVY};">Your stay is confirmed! ✅</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
  Hi {{guest_name}},<br/><br/>
  Wonderful news — <strong>{{host_name}}</strong> has confirmed your booking at <strong>{{listing_title}}</strong>.
  We can't wait for your stay!
</p>
${bookingTable([
  ["Property", "{{listing_title}}"],
  ["Host", "{{host_name}}"],
  ["Check-in", "{{check_in}}"],
  ["Check-out", "{{check_out}}"],
  ["Guests", "{{guests}}"],
  ["Total paid", "{{total_price}}"],
  ["Booking ref", "{{booking_ref}}"],
])}
<p style="margin:0 0 4px;font-size:14px;color:#6b7280;">View your booking details, access check-in instructions, and message your host.</p>
${ctaButton("View my booking", "{{login_link}}")}
<p style="margin:0;font-size:13px;color:#9ca3af;">Need to make changes? Contact your host directly through our messaging system.</p>
`);

const BOOKING_CONFIRMED_HOST_BODY = emailShell(`
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${NAVY};">You accepted a booking 🎊</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
  Hi {{host_name}},<br/><br/>
  You've confirmed the booking from <strong>{{guest_name}}</strong>. Here's a summary to prepare for their arrival.
</p>
${bookingTable([
  ["Guest", "{{guest_name}}"],
  ["Check-in", "{{check_in}}"],
  ["Check-out", "{{check_out}}"],
  ["Guests", "{{guests}}"],
  ["Your payout", "{{host_payout}}"],
  ["Payout date", "{{payout_date}}"],
])}
<p style="margin:0 0 4px;font-size:14px;color:#6b7280;">Send check-in instructions and prepare your property for a great stay.</p>
${ctaButton("Manage booking", "{{login_link}}")}
<p style="margin:0;font-size:13px;color:#9ca3af;">Your payout will be processed the day after check-in via your registered bank account.</p>
`);

const BOOKING_DECLINED_GUEST_BODY = emailShell(`
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${NAVY};">Your booking request was declined</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
  Hi {{guest_name}},<br/><br/>
  Unfortunately, <strong>{{host_name}}</strong> was unable to accommodate your request for <strong>{{listing_title}}</strong> on the dates you chose.
  Don't worry — there are hundreds of other great properties available!
</p>
${bookingTable([
  ["Property", "{{listing_title}}"],
  ["Check-in", "{{check_in}}"],
  ["Check-out", "{{check_out}}"],
])}
<p style="margin:0 0 4px;font-size:14px;color:#6b7280;">No charges have been made to your payment method. Browse similar properties below.</p>
${ctaButton("Find similar properties", "{{login_link}}")}
<p style="margin:0;font-size:13px;color:#9ca3af;">Questions? Email us at <a href="mailto:hello@bnb-circle.com" style="color:${ACCENT};">hello@bnb-circle.com</a>.</p>
`);

const BOOKING_REMINDER_GUEST_BODY = emailShell(`
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${NAVY};">Your trip is in 2 days! 🗓️</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
  Hi {{guest_name}},<br/><br/>
  Just a friendly reminder — your stay at <strong>{{listing_title}}</strong> begins in <strong>2 days</strong>!
  Here's everything you need to know.
</p>
${bookingTable([
  ["Property", "{{listing_title}}"],
  ["Check-in", "{{check_in}}"],
  ["Check-out", "{{check_out}}"],
  ["Address", "{{property_address}}"],
  ["Host", "{{host_name}}"],
])}
<p style="margin:0 0 4px;font-size:14px;color:#6b7280;">Check-in instructions and house rules are available in your booking details.</p>
${ctaButton("View check-in details", "{{login_link}}")}
<p style="margin:0;font-size:13px;color:#9ca3af;">Have a wonderful trip! ✈️</p>
`);

const BOOKING_REMINDER_HOST_BODY = emailShell(`
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${NAVY};">Guest arriving tomorrow! 🏡</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
  Hi {{host_name}},<br/><br/>
  <strong>{{guest_name}}</strong> arrives at your property <strong>tomorrow</strong>.
  Make sure everything is ready for their arrival!
</p>
${bookingTable([
  ["Guest", "{{guest_name}}"],
  ["Guests", "{{guests}}"],
  ["Check-in", "{{check_in}}"],
  ["Check-out", "{{check_out}}"],
  ["Property", "{{listing_title}}"],
])}
<p style="margin:0 0 4px;font-size:14px;color:#6b7280;">Send your guest a welcome message or any last-minute instructions.</p>
${ctaButton("Message your guest", "{{login_link}}")}
<p style="margin:0;font-size:13px;color:#9ca3af;">Your payout will be processed the day after check-in.</p>
`);

const REVIEW_REQUEST_GUEST_BODY = emailShell(`
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${NAVY};">How was your stay? ⭐</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
  Hi {{guest_name}},<br/><br/>
  We hope you had a wonderful time at <strong>{{listing_title}}</strong>!
  Your feedback helps other guests make the best choices — and it helps great hosts get the recognition they deserve.
</p>
${bookingTable([
  ["Property", "{{listing_title}}"],
  ["Host", "{{host_name}}"],
  ["Checked out", "{{check_out}}"],
])}
<p style="margin:0 0 4px;font-size:14px;color:#6b7280;">It only takes 2 minutes. Your review expires in <strong>14 days</strong>.</p>
${ctaButton("Write a review", "{{review_link}}")}
<p style="margin:0;font-size:13px;color:#9ca3af;">Thank you for being part of the Bnb Circle community!</p>
`);

const PASSWORD_RESET_BODY = emailShell(`
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${NAVY};">Reset your password 🔐</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
  Hi {{guest_name}},<br/><br/>
  We received a request to reset the password for your Bnb Circle account.
  Click the button below to create a new password.
</p>
${ctaButton("Reset my password", "{{reset_link}}")}
<p style="margin:24px 0 0;font-size:13px;color:#6b7280;">
  This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email — your account is still secure.
</p>
<p style="margin:12px 0 0;font-size:12px;color:#9ca3af;">
  If the button doesn't work, copy and paste this URL into your browser:<br/>
  <span style="color:${ACCENT};">{{reset_link}}</span>
</p>
`);

const WELCOME_GUEST_BODY = emailShell(`
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${NAVY};">Welcome to Bnb Circle! 🌷</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
  Hi {{guest_name}},<br/><br/>
  You're now part of the Netherlands' favourite vacation rental community.
  Discover hundreds of hand-picked properties — from cosy Amsterdam canal houses to windmill cottages and coastal retreats.
</p>
<table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:24px 0;">
  <tr>
    <td style="padding:12px;background:#f8f9fc;border-radius:10px;text-align:center;width:30%;">
      <div style="font-size:24px;">🔍</div>
      <div style="font-size:13px;font-weight:700;color:${NAVY};margin-top:6px;">Browse listings</div>
    </td>
    <td style="width:5%;"></td>
    <td style="padding:12px;background:#f8f9fc;border-radius:10px;text-align:center;width:30%;">
      <div style="font-size:24px;">📅</div>
      <div style="font-size:13px;font-weight:700;color:${NAVY};margin-top:6px;">Book instantly</div>
    </td>
    <td style="width:5%;"></td>
    <td style="padding:12px;background:#f8f9fc;border-radius:10px;text-align:center;width:30%;">
      <div style="font-size:24px;">⭐</div>
      <div style="font-size:13px;font-weight:700;color:${NAVY};margin-top:6px;">Leave reviews</div>
    </td>
  </tr>
</table>
${ctaButton("Start exploring", "{{login_link}}")}
<p style="margin:0;font-size:13px;color:#9ca3af;">Happy travels from the Bnb Circle team 🇳🇱</p>
`);

const WELCOME_HOST_BODY = emailShell(`
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${NAVY};">You're now a Bnb Circle host! 🏠</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
  Hi {{host_name}},<br/><br/>
  Welcome aboard! You've taken the first step to earning extra income from your property.
  List your space, set your own prices, and welcome guests from across the world.
</p>
<table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:24px 0;">
  <tr>
    <td style="padding:16px;background:#f0f9f4;border-left:4px solid #34d399;border-radius:0 10px 10px 0;margin-bottom:12px;">
      <div style="font-size:13px;font-weight:700;color:${NAVY};">Step 1: Complete your listing</div>
      <div style="font-size:13px;color:#6b7280;">Add photos, amenities, and a great description.</div>
    </td>
  </tr>
  <tr><td style="height:8px;"></td></tr>
  <tr>
    <td style="padding:16px;background:#fff7ed;border-left:4px solid ${ACCENT};border-radius:0 10px 10px 0;">
      <div style="font-size:13px;font-weight:700;color:${NAVY};">Step 2: Set your availability</div>
      <div style="font-size:13px;color:#6b7280;">Open your calendar and configure pricing.</div>
    </td>
  </tr>
  <tr><td style="height:8px;"></td></tr>
  <tr>
    <td style="padding:16px;background:#eff6ff;border-left:4px solid #60a5fa;border-radius:0 10px 10px 0;">
      <div style="font-size:13px;font-weight:700;color:${NAVY};">Step 3: Publish &amp; earn</div>
      <div style="font-size:13px;color:#6b7280;">Go live and start receiving booking requests.</div>
    </td>
  </tr>
</table>
${ctaButton("Go to host dashboard", "{{login_link}}")}
<p style="margin:0;font-size:13px;color:#9ca3af;">Need help? Our host support team is at <a href="mailto:hosts@bnb-circle.com" style="color:${ACCENT};">hosts@bnb-circle.com</a>.</p>
`);

const MESSAGE_NOTIFICATION_BODY = emailShell(`
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${NAVY};">You have a new message 💬</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
  Hi {{recipient_name}},<br/><br/>
  <strong>{{sender_name}}</strong> sent you a message regarding <strong>{{listing_title}}</strong>.
</p>
<table cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f8f9fc;border-radius:12px;padding:20px 24px;margin:0 0 24px;">
  <tr>
    <td>
      <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;">{{sender_name}} &mdash; {{message_time}}</div>
      <div style="font-size:15px;color:${NAVY};font-style:italic;line-height:1.6;">"{{message_preview}}"</div>
    </td>
  </tr>
</table>
${ctaButton("Reply to message", "{{login_link}}")}
<p style="margin:0;font-size:13px;color:#9ca3af;">You're receiving this because you have email notifications enabled. You can manage preferences in your account settings.</p>
`);

const ESCALATION_ADMIN_BODY = emailShell(`
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#dc2626;">⚠️ Conversation escalated to admin</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
  Hi Admin,<br/><br/>
  A conversation has been escalated and requires your attention. Please review the thread and take appropriate action.
</p>
${bookingTable([
  ["Guest", "{{guest_name}}"],
  ["Host", "{{host_name}}"],
  ["Booking ref", "{{booking_ref}}"],
  ["Property", "{{listing_title}}"],
  ["Escalated by", "{{escalated_by}}"],
  ["Reason", "{{escalation_reason}}"],
])}
<p style="margin:0 0 4px;font-size:14px;color:#6b7280;">Please respond within <strong>4 hours</strong> during business hours.</p>
${ctaButton("Open conversation", "{{login_link}}")}
<p style="margin:0;font-size:13px;color:#9ca3af;">This is an automated admin alert from the Bnb Circle platform.</p>
`);

const PAYOUT_HOST_BODY = emailShell(`
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${NAVY};">Your payout is on its way! 💸</h1>
<p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
  Hi {{host_name}},<br/><br/>
  Great news — your payout for the recent booking has been processed and is on its way to your bank account.
</p>
${bookingTable([
  ["Property", "{{listing_title}}"],
  ["Guest", "{{guest_name}}"],
  ["Stay dates", "{{check_in}} → {{check_out}}"],
  ["Gross amount", "{{gross_amount}}"],
  ["Platform fee", "{{platform_fee}}"],
  ["Payout amount", "{{host_payout}}"],
  ["Bank account", "{{bank_last4}}"],
  ["Arrival by", "{{payout_date}}"],
])}
<p style="margin:0 0 4px;font-size:14px;color:#6b7280;">Payouts typically arrive within 1–3 business days depending on your bank.</p>
${ctaButton("View payout details", "{{login_link}}")}
<p style="margin:0;font-size:13px;color:#9ca3af;">Questions about this payout? Contact <a href="mailto:payouts@bnb-circle.com" style="color:${ACCENT};">payouts@bnb-circle.com</a>.</p>
`);

// ── Template registry ─────────────────────────────────────────

export const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  booking_request_guest: {
    id: "booking_request_guest",
    name: "Booking Request (Guest)",
    category: "booking",
    subject: "Booking request sent — {{listing_title}}",
    htmlBody: BOOKING_REQUEST_GUEST_BODY,
    variables: ["guest_name", "listing_title", "city", "check_in", "check_out", "guests", "total_price", "login_link", "unsubscribe_link"],
    trigger: "Sent to guest immediately after they submit a booking request",
    lastSaved: "2026-05-01T10:00:00Z",
  },

  booking_request_host: {
    id: "booking_request_host",
    name: "Booking Request (Host)",
    category: "booking",
    subject: "New booking request from {{guest_name}} — {{listing_title}}",
    htmlBody: BOOKING_REQUEST_HOST_BODY,
    variables: ["host_name", "guest_name", "listing_title", "check_in", "check_out", "guests", "host_payout", "login_link", "unsubscribe_link"],
    trigger: "Sent to host immediately when a guest submits a booking request",
    lastSaved: "2026-05-01T10:00:00Z",
  },

  booking_confirmed_guest: {
    id: "booking_confirmed_guest",
    name: "Booking Confirmed (Guest)",
    category: "booking",
    subject: "Your booking is confirmed! — {{listing_title}}",
    htmlBody: BOOKING_CONFIRMED_GUEST_BODY,
    variables: ["guest_name", "host_name", "listing_title", "check_in", "check_out", "guests", "total_price", "booking_ref", "login_link", "unsubscribe_link"],
    trigger: "Sent to guest when host accepts the booking request",
    lastSaved: "2026-05-01T10:00:00Z",
  },

  booking_confirmed_host: {
    id: "booking_confirmed_host",
    name: "Booking Confirmed (Host)",
    category: "booking",
    subject: "Booking confirmed — {{guest_name}} is staying at {{listing_title}}",
    htmlBody: BOOKING_CONFIRMED_HOST_BODY,
    variables: ["host_name", "guest_name", "listing_title", "check_in", "check_out", "guests", "host_payout", "payout_date", "login_link", "unsubscribe_link"],
    trigger: "Sent to host after they accept a booking (confirmation receipt)",
    lastSaved: "2026-05-01T10:00:00Z",
  },

  booking_declined_guest: {
    id: "booking_declined_guest",
    name: "Booking Declined (Guest)",
    category: "booking",
    subject: "Your booking request was declined — {{listing_title}}",
    htmlBody: BOOKING_DECLINED_GUEST_BODY,
    variables: ["guest_name", "host_name", "listing_title", "check_in", "check_out", "login_link", "unsubscribe_link"],
    trigger: "Sent to guest when host declines their booking request",
    lastSaved: "2026-05-01T10:00:00Z",
  },

  booking_reminder_guest: {
    id: "booking_reminder_guest",
    name: "Check-in Reminder (Guest)",
    category: "booking",
    subject: "Your trip to {{listing_title}} is in 2 days!",
    htmlBody: BOOKING_REMINDER_GUEST_BODY,
    variables: ["guest_name", "listing_title", "check_in", "check_out", "property_address", "host_name", "login_link", "unsubscribe_link"],
    trigger: "Sent to guest 48 hours before their check-in date",
    lastSaved: "2026-05-01T10:00:00Z",
  },

  booking_reminder_host: {
    id: "booking_reminder_host",
    name: "Arrival Reminder (Host)",
    category: "booking",
    subject: "{{guest_name}} arrives tomorrow at {{listing_title}}",
    htmlBody: BOOKING_REMINDER_HOST_BODY,
    variables: ["host_name", "guest_name", "listing_title", "check_in", "check_out", "guests", "login_link", "unsubscribe_link"],
    trigger: "Sent to host 24 hours before guest check-in",
    lastSaved: "2026-05-01T10:00:00Z",
  },

  review_request_guest: {
    id: "review_request_guest",
    name: "Review Request (Guest)",
    category: "reviews",
    subject: "How was your stay at {{listing_title}}? Leave a review ⭐",
    htmlBody: REVIEW_REQUEST_GUEST_BODY,
    variables: ["guest_name", "listing_title", "host_name", "check_out", "review_link", "unsubscribe_link"],
    trigger: "Sent to guest 2 hours after their check-out date",
    lastSaved: "2026-05-01T10:00:00Z",
  },

  password_reset: {
    id: "password_reset",
    name: "Password Reset",
    category: "auth",
    subject: "Reset your Bnb Circle password",
    htmlBody: PASSWORD_RESET_BODY,
    variables: ["guest_name", "reset_link", "unsubscribe_link"],
    trigger: "Sent when a user requests a password reset",
    lastSaved: "2026-05-01T10:00:00Z",
  },

  welcome_guest: {
    id: "welcome_guest",
    name: "Welcome (Guest)",
    category: "auth",
    subject: "Welcome to Bnb Circle, {{guest_name}}! 🌷",
    htmlBody: WELCOME_GUEST_BODY,
    variables: ["guest_name", "login_link", "unsubscribe_link"],
    trigger: "Sent to new guest after email verification",
    lastSaved: "2026-05-01T10:00:00Z",
  },

  welcome_host: {
    id: "welcome_host",
    name: "Welcome (Host)",
    category: "auth",
    subject: "You're now a Bnb Circle host, {{host_name}}!",
    htmlBody: WELCOME_HOST_BODY,
    variables: ["host_name", "login_link", "unsubscribe_link"],
    trigger: "Sent to new host after host account activation",
    lastSaved: "2026-05-01T10:00:00Z",
  },

  message_notification: {
    id: "message_notification",
    name: "New Message",
    category: "notifications",
    subject: "New message from {{sender_name}} about {{listing_title}}",
    htmlBody: MESSAGE_NOTIFICATION_BODY,
    variables: ["recipient_name", "sender_name", "listing_title", "message_preview", "message_time", "login_link", "unsubscribe_link"],
    trigger: "Sent when a user receives a new chat message and is not actively online",
    lastSaved: "2026-05-01T10:00:00Z",
  },

  escalation_admin: {
    id: "escalation_admin",
    name: "Escalation (Admin)",
    category: "notifications",
    subject: "⚠️ Conversation escalated — {{booking_ref}}",
    htmlBody: ESCALATION_ADMIN_BODY,
    variables: ["guest_name", "host_name", "booking_ref", "listing_title", "escalated_by", "escalation_reason", "login_link", "unsubscribe_link"],
    trigger: "Sent to admins when a conversation is flagged/escalated",
    lastSaved: "2026-05-01T10:00:00Z",
  },

  payout_host: {
    id: "payout_host",
    name: "Payout Processed (Host)",
    category: "notifications",
    subject: "Your payout of {{host_payout}} is on its way!",
    htmlBody: PAYOUT_HOST_BODY,
    variables: ["host_name", "listing_title", "guest_name", "check_in", "check_out", "gross_amount", "platform_fee", "host_payout", "bank_last4", "payout_date", "login_link", "unsubscribe_link"],
    trigger: "Sent to host when a payout is initiated after guest check-in",
    lastSaved: "2026-05-01T10:00:00Z",
  },
};

// ── Rendering engine ──────────────────────────────────────────

/**
 * Renders an email template by substituting all {{variable}} placeholders.
 * Unknown variables are left as-is so they are visible in previews.
 *
 * @param templateKey - Key into EMAIL_TEMPLATES
 * @param vars        - Map of variable name → value
 * @returns Rendered HTML string, or empty string if template not found
 */
export function renderTemplate(
  templateKey: string,
  vars: Record<string, string>
): string {
  const template = EMAIL_TEMPLATES[templateKey];
  if (!template) {
    console.warn(`[emailTemplates] Unknown template key: "${templateKey}"`);
    return "";
  }

  return template.htmlBody.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    return vars[key] !== undefined ? vars[key] : `{{${key}}}`;
  });
}

// ── Sample data for preview ───────────────────────────────────

/**
 * Sample variable values used when rendering live previews in the admin UI.
 */
export const SAMPLE_VARS: Record<string, string> = {
  guest_name: "Sophie van den Berg",
  host_name: "Pieter de Vries",
  listing_title: "Cosy Amsterdam Canal House",
  city: "Amsterdam",
  check_in: "Friday 6 June 2026",
  check_out: "Monday 9 June 2026",
  guests: "2 guests",
  total_price: "€ 486",
  host_payout: "€ 437",
  gross_amount: "€ 486",
  platform_fee: "€ 49 (10%)",
  booking_ref: "BC-2026-08741",
  property_address: "Prinsengracht 123, Amsterdam",
  payout_date: "7 June 2026",
  bank_last4: "••• 4821",
  reset_link: "https://bnb-circle.com/reset?token=demo-token",
  login_link: "https://bnb-circle.com/dashboard",
  review_link: "https://bnb-circle.com/reviews/new?booking=BC-2026-08741",
  unsubscribe_link: "https://bnb-circle.com/unsubscribe?token=demo",
  recipient_name: "Sophie van den Berg",
  sender_name: "Pieter de Vries",
  message_preview: "Hi! Just wanted to confirm that early check-in at 12:00 should be fine. Looking forward to your stay!",
  message_time: "Today at 09:41",
  escalated_by: "Sophie van den Berg",
  escalation_reason: "Host unresponsive for 48 hours after booking confirmation",
};

// ── Notification config ───────────────────────────────────────

/**
 * Returns the global notification/email sending configuration.
 * In production this would be fetched from the backend / admin settings.
 */
export function getNotificationConfig(): NotificationConfig {
  return {
    fromName: "Bnb Circle",
    fromEmail: "hello@bnb-circle.com",
    replyTo: "hello@bnb-circle.com",
    logoUrl: "https://bnb-circle.com/logo.svg",
    siteUrl: "https://bnb-circle.com",
    unsubscribeUrl: "https://bnb-circle.com/unsubscribe",
    supportEmail: "hello@bnb-circle.com",
    primaryColor: NAVY,
    accentColor: ACCENT,
  };
}
