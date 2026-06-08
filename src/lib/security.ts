/**
 * security.ts — BnbCircle client-side security utilities
 *
 * Includes:
 *  - HTML & URL sanitization
 *  - In-memory rate limiter (client-side demo)
 *  - CSRF token generator (Supabase JWT-based apps don't need CSRF, but
 *    this is kept as a future hook for any server-rendered endpoints)
 *  - Content Security Policy directive hints (for meta-csp or server headers)
 *  - Password strength checker
 *  - XSS-safe text truncation
 *  - Email format validation
 *  - Suspicious content detection (off-platform contact prevention)
 */

// ─── HTML Sanitization ────────────────────────────────────────────────────────

/**
 * Strip dangerous HTML from user-generated content.
 * Removes: <script>, <iframe>, <object>, <embed>, on* event attributes,
 *          javascript: / data: href values.
 * Returns plain text (no HTML tags) safe for rendering via textContent.
 */
export function sanitizeHtml(input: string): string {
  if (!input) return "";

  let safe = input
    // Remove script blocks (with content)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove iframe, object, embed, form, base blocks
    .replace(/<(iframe|object|embed|form|base)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, "")
    // Remove all remaining HTML tags
    .replace(/<[^>]+>/g, "")
    // Remove javascript: and data: URIs in plain text
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:/gi, "")
    // Remove on* event handler remnants (e.g. onclick=, onerror=)
    .replace(/\bon\w+\s*=/gi, "")
    // Trim excess whitespace
    .trim();

  return safe;
}

// ─── URL Sanitization ─────────────────────────────────────────────────────────

/**
 * Validate and sanitize a URL, allowing only http:// and https:// schemes.
 * Returns an empty string if the URL is unsafe or malformed.
 */
export function sanitizeUrl(url: string): string {
  if (!url) return "";

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    // Allowlist safe schemes only
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    return parsed.toString();
  } catch {
    // Relative URLs or malformed — reject
    return "";
  }
}

// ─── In-memory Rate Limiter ───────────────────────────────────────────────────

type RateLimitRecord = { timestamps: number[] };
const _rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Client-side, in-memory rate limiter. Useful for throttling form submissions,
 * search calls, or chat messages without a backend round-trip.
 *
 * @param key          - Unique action key (e.g. "contact-form", "search")
 * @param maxPerMinute - Maximum allowed calls per 60-second sliding window
 * @returns true if the action is allowed, false if rate-limited
 */
export const rateLimiter = {
  check(key: string, maxPerMinute: number): boolean {
    const now = Date.now();
    const windowMs = 60_000; // 1 minute
    const record = _rateLimitStore.get(key) ?? { timestamps: [] };

    // Prune timestamps older than the window
    record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

    if (record.timestamps.length >= maxPerMinute) {
      _rateLimitStore.set(key, record);
      return false; // Rate-limited
    }

    record.timestamps.push(now);
    _rateLimitStore.set(key, record);
    return true; // Allowed
  },

  /** Reset the counter for a specific key (e.g. after successful auth) */
  reset(key: string): void {
    _rateLimitStore.delete(key);
  },
};

// ─── CSRF Token ───────────────────────────────────────────────────────────────

/**
 * Generate a random CSRF token string (hex).
 * NOTE: Supabase JWT-based SPAs don't require CSRF tokens for API calls,
 * but this is kept as a hook for future server-rendered endpoints or
 * non-Supabase API integrations.
 */
export function generateCsrfToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Content Security Policy Directive Hints ─────────────────────────────────

/**
 * CSP_DIRECTIVES provides a structured reference for the recommended
 * Content-Security-Policy header values for BnbCircle.
 *
 * Usage (Vite dev server plugin / Netlify _headers / server middleware):
 *   const cspHeader = Object.entries(CSP_DIRECTIVES)
 *     .map(([dir, sources]) => `${dir} ${sources.join(' ')}`)
 *     .join('; ');
 */
export const CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'", // Required for Vite HMR in dev; tighten in production with nonces
    "https://maps.googleapis.com",
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'", // Tailwind CSS injects styles inline
    "https://fonts.googleapis.com",
  ],
  "img-src": [
    "'self'",
    "data:",
    "https:",
    "blob:", // Blob URLs for local image previews
  ],
  "connect-src": [
    "'self'",
    "https://*.supabase.co", // Supabase REST + Realtime
    "https://maps.googleapis.com",
  ],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "frame-src": ["'none'"], // No iframes allowed
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
} as const;

// ─── Password Strength Checker ────────────────────────────────────────────────

export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4;

export interface PasswordStrengthResult {
  score: PasswordStrengthScore;
  label: "Very weak" | "Weak" | "Fair" | "Strong" | "Very strong";
  color: string; // Tailwind CSS color class for the progress bar / badge
  suggestions: string[];
}

/**
 * Evaluate password strength based on common heuristics.
 *
 * Scoring criteria (each adds 1 point):
 *  1. Length ≥ 8 characters
 *  2. Contains uppercase letter (A-Z)
 *  3. Contains a number (0-9)
 *  4. Contains a symbol (!@#$% etc.)
 *  5. Length ≥ 12 characters (bonus point over criterion 1)
 */
export function checkPasswordStrength(password: string): PasswordStrengthResult {
  const suggestions: string[] = [];
  let score = 0;

  const hasLength8 = password.length >= 8;
  const hasLength12 = password.length >= 12;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (hasLength8) score++;
  if (hasUppercase) score++;
  if (hasNumber) score++;
  if (hasSymbol) score++;
  if (hasLength12) score++; // replaces the base length point → max 5, cap at 4

  // Cap at 4
  score = Math.min(score, 4) as PasswordStrengthScore;

  // Build suggestions for what's missing
  if (!hasLength8) suggestions.push("Use at least 8 characters");
  if (!hasUppercase) suggestions.push("Add an uppercase letter");
  if (!hasNumber) suggestions.push("Include at least one number");
  if (!hasSymbol) suggestions.push("Add a special character (!, @, #, …)");
  if (hasLength8 && !hasLength12) suggestions.push("Use 12+ characters for a stronger password");

  const labels: PasswordStrengthResult["label"][] = [
    "Very weak",
    "Weak",
    "Fair",
    "Strong",
    "Very strong",
  ];

  const colors: string[] = [
    "text-red-500",
    "text-orange-500",
    "text-yellow-500",
    "text-green-500",
    "text-emerald-600",
  ];

  return {
    score: score as PasswordStrengthScore,
    label: labels[score],
    color: colors[score],
    suggestions,
  };
}

// ─── XSS-safe Text Truncation ─────────────────────────────────────────────────

/**
 * Sanitize and truncate user-generated text for safe display.
 * Strips HTML tags first, then truncates to maxLen characters with an ellipsis.
 */
export function safeUserText(text: string, maxLen = 500): string {
  const clean = sanitizeHtml(text);
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen).trimEnd() + "…";
}

// ─── Email Validation ─────────────────────────────────────────────────────────

/**
 * Validate email format using a robust but readable regex.
 * Intentionally not 100% RFC 5322 complete — covers 99%+ of real addresses.
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  // Basic structure: local@domain.tld
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email.trim());
}

// ─── Suspicious Content Detection ────────────────────────────────────────────

/**
 * Detect off-platform contact attempts in guest/host messages.
 * Returns true if the message contains:
 *  - Phone numbers (various formats)
 *  - External URLs (http/https/www links)
 *  - Email addresses
 *
 * Used to WARN users (not to block messages outright), preserving platform
 * transaction integrity while avoiding a heavy-handed approach.
 */
export function containsSuspiciousContent(text: string): boolean {
  if (!text) return false;

  const patterns = [
    // Phone numbers: +31 6 12345678 / 06-12345678 / (020) 123 4567 / 10+ digit strings
    /(\+?\d[\d\s\-().]{7,}\d)/,
    // External URLs
    /https?:\/\/[^\s]+/i,
    /www\.[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}/i,
    // Email addresses in message body
    /[^\s@]+@[^\s@]+\.[^\s@]{2,}/,
    // WhatsApp / Telegram / Signal mentions
    /\b(whatsapp|telegram|signal|viber|wechat)\b/i,
  ];

  return patterns.some((pattern) => pattern.test(text));
}

// ─── Utility: build CSP header string (for use in Vite plugins / middleware) ──

/**
 * Serialize CSP_DIRECTIVES into a single Content-Security-Policy header value.
 * Example output:
 *   "default-src 'self'; script-src 'self' 'unsafe-inline' https://..."
 */
export function buildCspHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${(sources as readonly string[]).join(" ")}`)
    .join("; ");
}
