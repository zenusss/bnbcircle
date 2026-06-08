import React from "react";
import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.png";

// ─── Settings stub ────────────────────────────────────────────────────────────
// No useSettings hook exists in this project yet.
// Replace with: const settings = useSettings(); when the hook is available.
const settings: {
  logo_url?: string;
  logo_dark_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  tiktok_url?: string;
} | null = null;

// ─── Inline SVG icons for social platforms ────────────────────────────────────
// lucide-react doesn't include Instagram, Facebook or TikTok brand icons.

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.83 1.55V6.78a4.85 4.85 0 0 1-1.06-.09z" />
    </svg>
  );
}

// ─── Social button ─────────────────────────────────────────────────────────────

interface SocialButtonProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function SocialButton({ href, label, icon }: SocialButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-8 h-8 rounded-full flex items-center justify-center text-secondary-foreground/60 bg-secondary-foreground/10 hover:bg-orange-500 hover:text-white transition-all duration-200"
    >
      {icon}
    </a>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function SiteFooter() {
  const year = new Date().getFullYear();

  // Resolve logo: prefer dark logo, then regular logo, then real asset
  const logoSrc = settings?.logo_dark_url ?? settings?.logo_url ?? logoImg;

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8">

        {/* ── Single row: logo + nav + social ───────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" aria-label="Bnb Circle – home" className="flex-shrink-0">
            <img
              src={logoSrc}
              alt="Bnb Circle"
              className="h-7 max-w-[140px] object-contain"
            />
          </Link>

          {/* Nav links — exact match with original bundle */}
          <nav
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-secondary-foreground/70"
            aria-label="Footer navigation"
          >
            <Link to="/about"   className="hover:text-secondary-foreground transition-colors">About</Link>
            <Link to="/contact" className="hover:text-secondary-foreground transition-colors">Contact</Link>
            <Link to="/faq"     className="hover:text-secondary-foreground transition-colors">Help</Link>
            <Link to="/fees"    className="hover:text-secondary-foreground transition-colors">Fees</Link>
            <Link to="/trust"   className="hover:text-secondary-foreground transition-colors">Safety</Link>
            <Link to="/terms"   className="hover:text-secondary-foreground transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-secondary-foreground transition-colors">Privacy</Link>
          </nav>

          {/* Social icons — only rendered if a URL is configured in settings */}
          <div className="flex items-center gap-2.5">
            {settings?.instagram_url && (
              <SocialButton
                href={settings.instagram_url}
                label="Instagram"
                icon={<InstagramIcon className="w-4 h-4" />}
              />
            )}
            {settings?.facebook_url && (
              <SocialButton
                href={settings.facebook_url}
                label="Facebook"
                icon={<FacebookIcon className="w-4 h-4" />}
              />
            )}
            {settings?.linkedin_url && (
              <SocialButton
                href={settings.linkedin_url}
                label="LinkedIn"
                icon={<LinkedInIcon className="w-4 h-4" />}
              />
            )}
            {settings?.tiktok_url && (
              <SocialButton
                href={settings.tiktok_url}
                label="TikTok"
                icon={<TikTokIcon className="w-4 h-4" />}
              />
            )}
          </div>
        </div>

        {/* ── Copyright line ────────────────────────────────────────────── */}
        <p className="mt-6 pt-6 border-t border-secondary-foreground/10 text-center text-xs text-secondary-foreground/50">
          © {year} Bnb Circle. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
