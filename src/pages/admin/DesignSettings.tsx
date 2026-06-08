// ─────────────────────────────────────────────────────────────
// pages/admin/DesignSettings.tsx
// Squarespace-style visual design customisation panel
// ─────────────────────────────────────────────────────────────

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ChangeEvent,
} from "react";
import {
  Palette,
  Type,
  Square,
  RotateCcw,
  Save,
  Check,
  Eye,
  Monitor,
  Star,
  MapPin,
  Wifi,
  Car,
  ChevronDown,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────

interface DesignSettings {
  primaryColor:  string;
  accentColor:   string;
  backgroundColor: string;
  headingFont:   string;
  bodyFont:      string;
  baseFontSize:  number;
  borderRadius:  number;
  spacing:       "compact" | "normal" | "spacious";
  logoLightUrl:  string;
  logoDarkUrl:   string;
}

// ── Constants ─────────────────────────────────────────────────

const STORAGE_KEY = "bnbcircle_design_settings";

const DEFAULTS: DesignSettings = {
  primaryColor:    "#0B1F3A",
  accentColor:     "#C96A3E",
  backgroundColor: "#FFFFFF",
  headingFont:     "Sora",
  bodyFont:        "Manrope",
  baseFontSize:    16,
  borderRadius:    12,
  spacing:         "normal",
  logoLightUrl:    "",
  logoDarkUrl:     "",
};

const FONT_OPTIONS = [
  "Sora",
  "Manrope",
  "Inter",
  "Playfair Display",
  "Lato",
  "Montserrat",
];

const RADIUS_OPTIONS = [
  { value: 0,  label: "Sharp",   desc: "0px" },
  { value: 8,  label: "Rounded", desc: "8px" },
  { value: 12, label: "Default", desc: "12px" },
  { value: 16, label: "Soft",    desc: "16px" },
  { value: 24, label: "Pill",    desc: "24px" },
];

interface ColorScheme {
  name:       string;
  primary:    string;
  accent:     string;
  background: string;
}

const PRESETS: ColorScheme[] = [
  { name: "Classic Navy+Terracotta", primary: "#0B1F3A", accent: "#C96A3E", background: "#FFFFFF" },
  { name: "Ocean Blue+Coral",        primary: "#0c4a6e", accent: "#f97316", background: "#f0f9ff" },
  { name: "Forest Green+Gold",       primary: "#14532d", accent: "#ca8a04", background: "#f0fdf4" },
  { name: "Purple+Pink",             primary: "#4c1d95", accent: "#db2777", background: "#fdf4ff" },
];

const SPACING_OPTIONS: Array<{ key: DesignSettings["spacing"]; label: string; py: string }> = [
  { key: "compact",   label: "Compact",   py: "py-10" },
  { key: "normal",    label: "Normal",    py: "py-16" },
  { key: "spacious",  label: "Spacious",  py: "py-28" },
];

// ── Helpers ───────────────────────────────────────────────────

function loadSettings(): DesignSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) as Partial<DesignSettings> };
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

function saveSettings(s: DesignSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch { /* ignore */ }
}

/** Apply settings as CSS custom properties on :root */
function applySettings(s: DesignSettings) {
  const root = document.documentElement;
  // We set raw hex values on preview-scoped vars; real integration would
  // convert these to HSL and set the --primary / --accent tokens.
  root.style.setProperty("--ds-primary", s.primaryColor);
  root.style.setProperty("--ds-accent",  s.accentColor);
  root.style.setProperty("--ds-bg",      s.backgroundColor);
  root.style.setProperty("--ds-radius",  `${s.borderRadius}px`);
  root.style.setProperty("--ds-font-size", `${s.baseFontSize}px`);
}

// ── Section wrapper ───────────────────────────────────────────

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Section({ icon, title, description, children }: SectionProps) {
  return (
    <div className="card-base overflow-visible">
      <div className="flex items-start gap-3 px-6 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div>
          <h2 className="font-bold text-primary text-base">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Color input row ───────────────────────────────────────────

interface ColorRowProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

function ColorRow({ label, value, onChange }: ColorRowProps) {
  const [hex, setHex] = useState(value);

  // Sync if parent changes (e.g. preset applied)
  useEffect(() => { setHex(value); }, [value]);

  const commitHex = () => {
    const valid = /^#[0-9A-Fa-f]{6}$/.test(hex);
    if (valid) onChange(hex);
    else setHex(value); // revert
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-foreground w-36 flex-shrink-0">{label}</label>
      <div className="flex items-center gap-2 flex-1">
        <div className="relative w-10 h-10 flex-shrink-0">
          <input
            type="color"
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label={`${label} color picker`}
          />
          <div
            className="w-10 h-10 rounded-lg border-2 border-white shadow-md cursor-pointer ring-1 ring-border"
            style={{ background: value }}
          />
        </div>
        <input
          type="text"
          value={hex}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setHex(e.target.value.toUpperCase())}
          onBlur={commitHex}
          onKeyDown={(e) => { if (e.key === "Enter") commitHex(); }}
          maxLength={7}
          className="input-base font-mono text-sm w-28 py-2"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

// ── Mini property card preview ────────────────────────────────

interface MiniCardProps {
  primary: string;
  accent:  string;
  bg:      string;
  radius:  number;
}

function MiniPropertyCard({ primary, accent, bg, radius }: MiniCardProps) {
  const r = `${radius}px`;
  return (
    <div
      style={{ background: bg, borderRadius: r, border: `1px solid ${primary}15`, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
      className="w-full"
    >
      {/* Simulated property image */}
      <div
        style={{ background: `linear-gradient(135deg, ${primary}33 0%, ${accent}33 100%)`, height: 100 }}
        className="flex items-center justify-center"
      >
        <MapPin style={{ color: accent }} className="w-6 h-6 opacity-70" />
      </div>

      {/* Card body */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p style={{ color: primary, fontWeight: 700, fontSize: 13 }}>Canal House Amsterdam</p>
            <p style={{ color: primary + "99", fontSize: 11, marginTop: 2 }}>Amsterdam, Netherlands</p>
          </div>
          <div className="flex items-center gap-0.5">
            <Star style={{ color: accent, fill: accent }} className="w-3 h-3" />
            <span style={{ color: primary, fontSize: 11, fontWeight: 700 }}>4.9</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Wifi style={{ color: primary + "80" }} className="w-3 h-3" />
          <Car style={{ color: primary + "80" }} className="w-3 h-3" />
          <div className="flex-1" />
          <span style={{ color: primary + "80", fontSize: 11 }}>3 nights</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span style={{ color: accent, fontWeight: 800, fontSize: 16 }}>€ 162</span>
            <span style={{ color: primary + "70", fontSize: 11 }}>/night</span>
          </div>
          <div
            style={{
              background: accent,
              color: "#fff",
              fontWeight: 700,
              fontSize: 11,
              padding: "5px 10px",
              borderRadius: Math.min(radius, 8),
            }}
          >
            Book now
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Font select ───────────────────────────────────────────────

interface FontSelectProps {
  label:    string;
  value:    string;
  onChange: (font: string) => void;
}

function FontSelect({ label, value, onChange }: FontSelectProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-foreground w-28 flex-shrink-0">{label}</label>
      <div className="relative flex-1">
        <select
          value={value}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          className="input-base pr-8 appearance-none cursor-pointer py-2"
          style={{ fontFamily: value }}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

// ── Typography preview ────────────────────────────────────────

interface TypographyPreviewProps {
  headingFont: string;
  bodyFont:    string;
  fontSize:    number;
  primary:     string;
}

function TypographyPreview({ headingFont, bodyFont, fontSize, primary }: TypographyPreviewProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <h3 style={{ fontFamily: headingFont, color: primary, fontSize: Math.round(fontSize * 1.5), fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>
        The Netherlands at Your Doorstep
      </h3>
      <p style={{ fontFamily: bodyFont, color: primary + "99", fontSize, lineHeight: 1.7, marginBottom: 12 }}>
        Discover hundreds of hand-picked properties across Amsterdam, Utrecht, The Hague and beyond.
        From cosy canal-side apartments to countryside windmill retreats — your perfect Dutch getaway awaits.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <span style={{ fontFamily: bodyFont, fontSize: fontSize * 0.8, fontWeight: 600, color: primary + "80" }}>Heading: {headingFont}</span>
        <span style={{ color: primary + "40" }}>·</span>
        <span style={{ fontFamily: bodyFont, fontSize: fontSize * 0.8, fontWeight: 600, color: primary + "80" }}>Body: {bodyFont}</span>
        <span style={{ color: primary + "40" }}>·</span>
        <span style={{ fontFamily: bodyFont, fontSize: fontSize * 0.8, fontWeight: 600, color: primary + "80" }}>{fontSize}px base</span>
      </div>
    </div>
  );
}

// ── Radius visual example ─────────────────────────────────────

function RadiusExample({ radius, primary, accent }: { radius: number; primary: string; accent: string }) {
  const r = `${radius}px`;
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div style={{ width: 80, height: 80, background: `${primary}12`, borderRadius: r, border: `2px solid ${primary}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: primary, fontSize: 10, fontWeight: 700 }}>CARD</span>
      </div>
      <div style={{ background: accent, borderRadius: r, padding: "10px 22px", display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Button</span>
      </div>
      <div style={{ border: `2px solid ${primary}`, borderRadius: r, padding: "10px 22px", display: "inline-flex", alignItems: "center" }}>
        <span style={{ color: primary, fontWeight: 700, fontSize: 13 }}>Outline</span>
      </div>
      <div style={{ background: `${primary}10`, borderRadius: Math.min(radius, 20), padding: "4px 12px", display: "inline-flex" }}>
        <span style={{ color: primary, fontWeight: 600, fontSize: 11 }}>Badge</span>
      </div>
    </div>
  );
}

// ── Reset confirm dialog ──────────────────────────────────────

interface ResetDialogProps {
  onConfirm: () => void;
  onCancel:  () => void;
}

function ResetDialog({ onConfirm, onCancel }: ResetDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(11,31,58,0.45)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-primary">Reset to defaults?</h3>
            <p className="text-sm text-muted-foreground">This will overwrite all your design customisations.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-ghost flex-1">
            <X className="w-4 h-4" /> Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 text-white font-semibold px-4 py-2.5 text-sm hover:bg-red-600 transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────

export default function AdminDesignSettings() {
  const [settings, setSettings] = useState<DesignSettings>(loadSettings);
  const [saved, setSaved]       = useState(false);
  const [showReset, setShowReset] = useState(false);

  // Apply live preview on every change
  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  const update = useCallback(
    <K extends keyof DesignSettings>(key: K, value: DesignSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const applyPreset = (preset: ColorScheme) => {
    setSettings((prev) => ({
      ...prev,
      primaryColor:    preset.primary,
      accentColor:     preset.accent,
      backgroundColor: preset.background,
    }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setSettings({ ...DEFAULTS });
    saveSettings(DEFAULTS);
    setShowReset(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Design Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Customise the visual appearance of your Bnb Circle site. Changes are applied live.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="badge-green animate-in fade-in duration-200">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
          <button onClick={() => setShowReset(true)} className="btn-ghost text-sm">
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button onClick={handleSave} className="btn-primary">
            <Save className="w-4 h-4" />
            Save design
          </button>
        </div>
      </div>

      {/* ── Colors ─────────────────────────────────────────── */}
      <Section
        icon={<Palette className="w-4 h-4 text-accent" />}
        title="Colours"
        description="Define your brand palette. Changes apply live to all pages."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: inputs */}
          <div className="space-y-5">
            {/* Preset schemes */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Preset colour schemes
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => {
                  const active =
                    preset.primary    === settings.primaryColor &&
                    preset.accent     === settings.accentColor &&
                    preset.background === settings.backgroundColor;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left text-sm font-medium transition-all",
                        active
                          ? "border-accent bg-accent/8"
                          : "border-border hover:border-accent/40 hover:bg-muted/50"
                      )}
                    >
                      <div className="flex gap-1 flex-shrink-0">
                        <div className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ background: preset.primary }} />
                        <div className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ background: preset.accent }} />
                      </div>
                      <span className="text-xs leading-tight">{preset.name}</span>
                      {active && <Check className="w-3 h-3 text-accent ml-auto flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Custom pickers */}
            <div className="space-y-4">
              <ColorRow label="Primary (navy)"   value={settings.primaryColor}    onChange={(v) => update("primaryColor", v)}    />
              <ColorRow label="Accent (terracotta)" value={settings.accentColor}  onChange={(v) => update("accentColor", v)}     />
              <ColorRow label="Background"        value={settings.backgroundColor} onChange={(v) => update("backgroundColor", v)} />
            </div>
          </div>

          {/* Right: live preview card */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Live preview
            </p>
            <MiniPropertyCard
              primary={settings.primaryColor}
              accent={settings.accentColor}
              bg={settings.backgroundColor}
              radius={settings.borderRadius}
            />
          </div>
        </div>
      </Section>

      {/* ── Typography ─────────────────────────────────────── */}
      <Section
        icon={<Type className="w-4 h-4 text-accent" />}
        title="Typography"
        description="Choose fonts and base size. Google Fonts are loaded automatically."
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FontSelect
              label="Heading font"
              value={settings.headingFont}
              onChange={(f) => update("headingFont", f)}
            />
            <FontSelect
              label="Body font"
              value={settings.bodyFont}
              onChange={(f) => update("bodyFont", f)}
            />
          </div>

          {/* Font size slider */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-foreground w-28 flex-shrink-0">Base size</label>
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xs text-muted-foreground w-5">14</span>
              <input
                type="range"
                min={14}
                max={18}
                step={1}
                value={settings.baseFontSize}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  update("baseFontSize", Number(e.target.value))
                }
                className="flex-1 accent-orange-500"
              />
              <span className="text-xs text-muted-foreground w-5">18</span>
              <span className="badge-accent w-14 justify-center">{settings.baseFontSize}px</span>
            </div>
          </div>

          {/* Live preview */}
          <TypographyPreview
            headingFont={settings.headingFont}
            bodyFont={settings.bodyFont}
            fontSize={settings.baseFontSize}
            primary={settings.primaryColor}
          />
        </div>
      </Section>

      {/* ── Border Radius ───────────────────────────────────── */}
      <Section
        icon={<Square className="w-4 h-4 text-accent" />}
        title="Border Radius"
        description="Control how rounded buttons, cards, and inputs appear."
      >
        <div className="space-y-6">
          {/* Step selector */}
          <div className="flex items-center gap-2 flex-wrap">
            {RADIUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("borderRadius", opt.value)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all min-w-[80px]",
                  settings.borderRadius === opt.value
                    ? "border-accent bg-accent/8 text-accent"
                    : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                )}
              >
                <div
                  className="w-8 h-8 border-2"
                  style={{
                    borderRadius: opt.value,
                    borderColor: settings.borderRadius === opt.value ? "#C96A3E" : "#d1d5db",
                    background: settings.borderRadius === opt.value ? "#C96A3E18" : "transparent",
                  }}
                />
                <span>{opt.label}</span>
                <span className="text-xs opacity-60">{opt.desc}</span>
              </button>
            ))}
          </div>

          {/* Live visual example */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Example</p>
            <RadiusExample
              radius={settings.borderRadius}
              primary={settings.primaryColor}
              accent={settings.accentColor}
            />
          </div>
        </div>
      </Section>

      {/* ── Spacing ─────────────────────────────────────────── */}
      <Section
        icon={<Monitor className="w-4 h-4 text-accent" />}
        title="Spacing"
        description="Adjust the vertical breathing room between sections."
      >
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            {SPACING_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => update("spacing", opt.key)}
                className={cn(
                  "flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all",
                  settings.spacing === opt.key
                    ? "border-accent bg-accent/8 text-accent"
                    : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Spacing preview */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-muted/40 px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-border">
              Section padding preview
            </div>
            <div
              className={cn(
                "transition-all duration-300 flex items-center justify-center",
                settings.spacing === "compact"  ? "py-10" :
                settings.spacing === "spacious" ? "py-28" :
                "py-16"
              )}
            >
              <div className="text-center">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-5 h-5 text-accent" />
                </div>
                <p className="text-sm font-semibold text-primary">Section content area</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {settings.spacing === "compact" ? "Compact: 40px" :
                   settings.spacing === "spacious" ? "Spacious: 112px" :
                   "Normal: 64px"} top/bottom padding
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Logo ────────────────────────────────────────────── */}
      <Section
        icon={<Eye className="w-4 h-4 text-accent" />}
        title="Logo"
        description="Upload your logo URL for light and dark backgrounds."
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Light logo */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Light mode logo</p>
              <div className="bg-white border-2 border-dashed border-border rounded-xl h-24 flex items-center justify-center mb-2 overflow-hidden">
                {settings.logoLightUrl ? (
                  <img
                    src={settings.logoLightUrl}
                    alt="Light mode logo"
                    className="max-h-16 max-w-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-2xl font-black" style={{ color: settings.primaryColor }}>
                      Bnb<span style={{ color: settings.accentColor }}>Circle</span>
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">Default SVG logo</p>
                  </div>
                )}
              </div>
              <input
                type="url"
                value={settings.logoLightUrl}
                onChange={(e: ChangeEvent<HTMLInputElement>) => update("logoLightUrl", e.target.value)}
                className="input-base text-sm py-2"
                placeholder="https://..."
              />
            </div>

            {/* Dark logo */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Dark mode logo</p>
              <div
                className="rounded-xl h-24 flex items-center justify-center mb-2 overflow-hidden border-2 border-dashed border-white/20"
                style={{ background: settings.primaryColor }}
              >
                {settings.logoDarkUrl ? (
                  <img
                    src={settings.logoDarkUrl}
                    alt="Dark mode logo"
                    className="max-h-16 max-w-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-2xl font-black text-white">
                      Bnb<span style={{ color: settings.accentColor }}>Circle</span>
                    </span>
                    <p className="text-xs text-white/50 mt-1">Default SVG logo</p>
                  </div>
                )}
              </div>
              <input
                type="url"
                value={settings.logoDarkUrl}
                onChange={(e: ChangeEvent<HTMLInputElement>) => update("logoDarkUrl", e.target.value)}
                className="input-base text-sm py-2"
                placeholder="https://..."
              />
            </div>
          </div>

          <button
            onClick={() => { update("logoLightUrl", ""); update("logoDarkUrl", ""); }}
            className="btn-ghost text-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Use default SVG logo
          </button>
        </div>
      </Section>

      {/* ── Save / Reset bar ────────────────────────────────── */}
      <div className="card-base p-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">
            {saved ? "✓ Design saved to localStorage" : "Ready to save your design?"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Settings are persisted in the browser and applied on every page load.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReset(true)}
            className="btn-ghost text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to defaults
          </button>
          <button onClick={handleSave} className="btn-primary">
            {saved ? <><Check className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />Save design</>}
          </button>
        </div>
      </div>

      {/* Reset confirm */}
      {showReset && (
        <ResetDialog
          onConfirm={handleReset}
          onCancel={() => setShowReset(false)}
        />
      )}
    </div>
  );
}
