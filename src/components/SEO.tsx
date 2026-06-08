import { useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

// ─── Helper: set or create a <meta> tag in <head> ────────────────────────────
// isProperty=true → property="og:..." ; isProperty=false → name="..."
function setMeta(key: string, value: string, isProperty = false): void {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(
    `meta[${attr}='${key}']`
  ) as HTMLMetaElement | null;

  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }

  el.setAttribute("content", value);
}

// ─── Helper: remove a <meta> tag (used for cleanup) ──────────────────────────
function removeMeta(key: string, isProperty = false): void {
  const attr = isProperty ? "property" : "name";
  const el = document.querySelector(
    `meta[${attr}='${key}']`
  ) as HTMLMetaElement | null;
  if (el) el.removeAttribute("content");
}

// ─── SEO Component ───────────────────────────────────────────────────────────
/**
 * Drop-in SEO component. Renders nothing to the DOM but imperatively manages
 * <title> and <meta> tags for both standard SEO and Open Graph/Twitter cards.
 *
 * Usage:
 *   <SEO title="Page Title" description="Page description." />
 */
export function SEO({
  title,
  description,
  image,
  url,
  type = "website",
  noIndex = false,
}: SEOProps) {
  const siteName = "BnbCircle";
  const defaultDesc =
    "Book unique short-term rentals across the Netherlands. Verified properties, 0% host commission.";

  const fullTitle = title
    ? `${title} — ${siteName}`
    : `${siteName} — Vacation Rentals in the Netherlands`;

  const resolvedDesc = description || defaultDesc;
  const resolvedUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    // ── Document title ────────────────────────────────────────────────────
    document.title = fullTitle;

    // ── Standard meta ─────────────────────────────────────────────────────
    setMeta("description", resolvedDesc);
    setMeta("robots", noIndex ? "noindex,nofollow" : "index,follow");

    // ── Open Graph ────────────────────────────────────────────────────────
    setMeta("og:site_name", siteName, true);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", resolvedDesc, true);
    setMeta("og:type", type, true);
    setMeta("og:url", resolvedUrl, true);
    if (image) {
      setMeta("og:image", image, true);
      setMeta("og:image:alt", fullTitle, true);
    }

    // ── Twitter / X card ─────────────────────────────────────────────────
    setMeta("twitter:card", image ? "summary_large_image" : "summary");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", resolvedDesc);
    if (image) setMeta("twitter:image", image);

    // ── Cleanup: restore title when component unmounts ────────────────────
    return () => {
      document.title = `${siteName} — Vacation Rentals in the Netherlands`;
      removeMeta("robots");
    };
  }, [fullTitle, resolvedDesc, resolvedUrl, image, type, noIndex]);

  // Renders nothing — all work is done via useEffect
  return null;
}
