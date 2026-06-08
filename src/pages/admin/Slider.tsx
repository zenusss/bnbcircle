/**
 * Slider.tsx  —  Hero Slider CMS (Admin)
 * Professional drag-reorder, live previews, full-screen preview modal,
 * overlay colour + opacity controls, pill toggles, and save toast.
 */

import React, { useState, useRef, useCallback } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Save,
  X,
  ArrowLeft,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Slide {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  overlay_color: string;
  overlay_opacity: number;
  is_active: boolean;
  sort_order: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEMO_SLIDES: Slide[] = [
  {
    id: "s1",
    image_url:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1600&h=800&fit=crop",
    title: "Discover the Netherlands",
    subtitle: "Hundreds of handpicked properties — zero commission for hosts.",
    button_text: "Start exploring",
    button_link: "/search",
    overlay_color: "#0B1F3A",
    overlay_opacity: 0.5,
    is_active: true,
    sort_order: 0,
  },
  {
    id: "s2",
    image_url:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&h=800&fit=crop",
    title: "Become a Host",
    subtitle: "Zero commission. Full earnings. List your property in minutes.",
    button_text: "List your property",
    button_link: "/signup?as=host",
    overlay_color: "#1a0a00",
    overlay_opacity: 0.55,
    is_active: true,
    sort_order: 1,
  },
  {
    id: "s3",
    image_url:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&h=800&fit=crop",
    title: "Luxury Villas Await",
    subtitle: "Exclusive properties with private pools and breathtaking views.",
    button_text: "See villas",
    button_link: "/search?type=villa",
    overlay_color: "#0B1F3A",
    overlay_opacity: 0.45,
    is_active: false,
    sort_order: 2,
  },
];

const UNSPLASH_SUGGESTIONS = [
  {
    label: "Dutch Canal",
    url: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1600&h=800&fit=crop",
    thumb:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=80&h=50&fit=crop",
  },
  {
    label: "Cosy Home",
    url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&h=800&fit=crop",
    thumb:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80&h=50&fit=crop",
  },
  {
    label: "Villa Pool",
    url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&h=800&fit=crop",
    thumb:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=80&h=50&fit=crop",
  },
];

const EMPTY_NEW_SLIDE = {
  image_url: "",
  title: "",
  subtitle: "",
  button_text: "",
  button_link: "",
  overlay_color: "#0B1F3A",
  overlay_opacity: 0.5,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Pill toggle switch */
function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-2 group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
      )}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 transition-all duration-200",
          checked
            ? "bg-emerald-500 border-emerald-500"
            : "bg-muted border-border"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 mt-0.5",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </span>
      {label && (
        <span
          className={cn(
            "text-xs font-semibold transition-colors",
            checked ? "text-emerald-600" : "text-muted-foreground"
          )}
        >
          {checked ? "Active" : "Inactive"}
        </span>
      )}
    </button>
  );
}

/** Live slide preview card (160px tall) */
function SlidePreview({
  slide,
  mini = false,
}: {
  slide: Pick<
    Slide,
    | "image_url"
    | "title"
    | "subtitle"
    | "button_text"
    | "overlay_color"
    | "overlay_opacity"
  >;
  mini?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-muted",
        mini ? "h-24" : "h-40"
      )}
    >
      {slide.image_url ? (
        <img
          src={slide.image_url}
          alt={slide.title || "Slide"}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop&auto=format";
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
          <span className="text-xs text-slate-400">No image</span>
        </div>
      )}
      {/* Colour overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: slide.overlay_color,
          opacity: slide.overlay_opacity,
        }}
      />
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        {slide.title && (
          <p
            className={cn(
              "font-bold leading-tight",
              mini ? "text-xs" : "text-sm"
            )}
          >
            {slide.title}
          </p>
        )}
        {slide.subtitle && !mini && (
          <p className="text-[10px] opacity-80 mt-0.5 line-clamp-2">
            {slide.subtitle}
          </p>
        )}
        {slide.button_text && !mini && (
          <span className="mt-2 px-3 py-1 rounded-lg bg-[#C96A3E] text-white text-[10px] font-bold">
            {slide.button_text}
          </span>
        )}
      </div>
    </div>
  );
}

/** Full-screen preview modal */
function PreviewModal({
  slide,
  total,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  slide: Slide;
  total: number;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4 rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
        {/* Background image */}
        <img
          src={slide.image_url}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&h=900&fit=crop";
          }}
        />

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: slide.overlay_color,
            opacity: slide.overlay_opacity,
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
          <p className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {slide.title || "Slide Title"}
          </p>
          <p className="text-lg md:text-2xl opacity-90 max-w-2xl mb-8 drop-shadow">
            {slide.subtitle || "Slide subtitle goes here"}
          </p>
          {slide.button_text && (
            <span className="px-8 py-3 rounded-xl bg-[#C96A3E] text-white font-bold text-lg shadow-lg">
              {slide.button_text}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {/* Slide counter */}
          <span className="px-3 py-1.5 rounded-full bg-black/40 text-white/80 text-sm font-medium backdrop-blur-sm">
            {currentIndex + 1} / {total}
          </span>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prev / Next */}
        {total > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Active badge */}
        <div className="absolute bottom-4 left-4">
          {slide.is_active ? (
            <span className="px-3 py-1 rounded-full bg-emerald-500/80 text-white text-xs font-bold backdrop-blur-sm">
              ● Active
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-white/20 text-white/80 text-xs font-medium backdrop-blur-sm">
              ○ Inactive
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/** Delete confirmation popover */
function DeleteConfirm({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="absolute right-0 top-full mt-1 z-50 w-52 bg-white border border-border rounded-xl shadow-card-hover p-3 space-y-3">
      <p className="text-xs font-semibold text-foreground">Delete this slide?</p>
      <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="flex-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/** Add slide form */
function AddSlideForm({
  onAdd,
  onCancel,
}: {
  onAdd: (slide: Omit<Slide, "id" | "sort_order" | "is_active">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(EMPTY_NEW_SLIDE);
  const [testImageUrl, setTestImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  const update = (field: keyof typeof form, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleTestImage = () => {
    setTestImageUrl(form.image_url);
    setImageError(false);
  };

  const isValid = form.title.trim() && form.image_url.trim();

  return (
    <div className="border-2 border-dashed border-accent/50 rounded-2xl p-6 space-y-5 bg-accent/[0.02]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-primary">Add New Slide</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fill in the details below — the preview updates as you type.
          </p>
        </div>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form fields */}
        <div className="space-y-4">
          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Image URL <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                value={form.image_url}
                onChange={(e) => {
                  update("image_url", e.target.value);
                  setTestImageUrl("");
                }}
                className="input-base flex-1 text-sm"
                placeholder="https://images.unsplash.com/..."
              />
              <button
                type="button"
                onClick={handleTestImage}
                className="px-3 py-2 rounded-xl border-2 border-border text-xs font-semibold text-foreground hover:border-accent hover:text-accent transition-all flex-shrink-0"
              >
                Test
              </button>
            </div>

            {/* Quick-pick chips */}
            <div className="flex flex-wrap gap-2 mt-2">
              {UNSPLASH_SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    update("image_url", s.url);
                    setTestImageUrl(s.url);
                    setImageError(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-white hover:border-accent text-xs text-foreground transition-all group"
                >
                  <img
                    src={s.thumb}
                    alt={s.label}
                    className="w-8 h-5 rounded object-cover"
                  />
                  {s.label}
                </button>
              ))}
            </div>

            {/* Test image preview */}
            {testImageUrl && (
              <div className="mt-2 rounded-xl overflow-hidden border border-border">
                <img
                  src={testImageUrl}
                  alt="Preview"
                  className="w-full h-28 object-cover"
                  onError={() => setImageError(true)}
                />
                {imageError && (
                  <p className="text-xs text-red-500 p-2">
                    ⚠ Could not load image. Check the URL.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Title + Subtitle */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className="input-base text-sm"
                placeholder="e.g. Discover the Netherlands"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Subtitle
              </label>
              <input
                value={form.subtitle}
                onChange={(e) => update("subtitle", e.target.value)}
                className="input-base text-sm"
                placeholder="Short supporting text"
              />
            </div>
          </div>

          {/* Button */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Button text
              </label>
              <input
                value={form.button_text}
                onChange={(e) => update("button_text", e.target.value)}
                className="input-base text-sm"
                placeholder="Start exploring"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Button link
              </label>
              <input
                value={form.button_link}
                onChange={(e) => update("button_link", e.target.value)}
                className="input-base text-sm"
                placeholder="/search"
              />
            </div>
          </div>

          {/* Overlay */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Overlay colour
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.overlay_color}
                  onChange={(e) => update("overlay_color", e.target.value)}
                  className="w-10 h-9 rounded-lg border border-border cursor-pointer p-0.5 bg-white"
                />
                <span className="text-xs text-muted-foreground font-mono">
                  {form.overlay_color}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Opacity —{" "}
                <span className="text-accent font-bold">
                  {Math.round(form.overlay_opacity * 100)}%
                </span>
              </label>
              <input
                type="range"
                min={0.2}
                max={0.9}
                step={0.05}
                value={form.overlay_opacity}
                onChange={(e) => update("overlay_opacity", +e.target.value)}
                className="w-full accent-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Live preview */}
        <div>
          <p className="text-xs font-semibold text-foreground mb-1.5">
            Live Preview
          </p>
          <SlidePreview slide={form} />
          <p className="text-[11px] text-muted-foreground mt-2 text-center">
            Preview updates as you type
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <button
          onClick={() => onAdd(form)}
          disabled={!isValid}
          className={cn(
            "btn-primary",
            !isValid && "opacity-40 cursor-not-allowed hover:brightness-100 hover:translate-y-0"
          )}
        >
          <Plus className="w-4 h-4" />
          Add slide
        </button>
        <button onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
        {!isValid && (
          <p className="text-xs text-muted-foreground ml-2">
            Title and image URL are required.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminSlider() {
  const [slides, setSlides] = useState<Slide[]>(DEMO_SLIDES);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const updateSlide = useCallback(
    <K extends keyof Slide>(id: string, field: K, value: Slide[K]) => {
      setSlides((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      );
    },
    []
  );

  const moveSlide = (id: string, dir: "up" | "down") => {
    setSlides((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const newIdx = dir === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr.map((s, i) => ({ ...s, sort_order: i }));
    });
  };

  const deleteSlide = (id: string) => {
    setSlides((prev) =>
      prev
        .filter((s) => s.id !== id)
        .map((s, i) => ({ ...s, sort_order: i }))
    );
    setDeleteConfirm(null);
  };

  const addSlide = (
    data: Omit<Slide, "id" | "sort_order" | "is_active">
  ) => {
    setSlides((prev) => [
      ...prev,
      {
        id: `s${Date.now()}`,
        ...data,
        is_active: true,
        sort_order: prev.length,
      },
    ]);
    setShowAddForm(false);
  };

  const handleSave = () => {
    // In production this would call an API
    setSaved(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaved(false), 3000);
  };

  // ── Preview navigation ────────────────────────────────────────────────────────

  const previewSlide =
    previewIndex !== null ? slides[previewIndex] : null;

  const prevPreview = () =>
    setPreviewIndex((i) =>
      i !== null ? (i - 1 + slides.length) % slides.length : null
    );
  const nextPreview = () =>
    setPreviewIndex((i) =>
      i !== null ? (i + 1) % slides.length : null
    );

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Full-screen Preview Modal */}
      {previewSlide !== null && previewIndex !== null && (
        <PreviewModal
          slide={previewSlide}
          total={slides.length}
          currentIndex={previewIndex}
          onClose={() => setPreviewIndex(null)}
          onPrev={prevPreview}
          onNext={nextPreview}
        />
      )}

      <div className="space-y-6 pb-16">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">Hero Slider</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage homepage hero slides — drag to reorder, toggle active state, live-preview.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Save success toast */}
            {saved && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold animate-fade-in">
                ✓ Changes saved
              </span>
            )}
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-outline"
            >
              <Plus className="w-4 h-4" />
              Add slide
            </button>
            <button onClick={handleSave} className="btn-primary">
              <Save className="w-4 h-4" />
              Save all
            </button>
          </div>
        </div>

        {/* ── Slides List ── */}
        <div className="space-y-4">
          {slides.length === 0 && (
            <div className="card-base p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground mb-1">No slides yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first hero slide to get started.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                Add first slide
              </button>
            </div>
          )}

          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={cn(
                "card-base overflow-visible transition-all duration-200",
                !slide.is_active && "opacity-60"
              )}
            >
              {/* ── Card header (sort order indicator + drag handle) ── */}
              <div className="flex items-center gap-2 px-4 pt-3 pb-0">
                <GripVertical className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 cursor-grab" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Slide {idx + 1}
                </span>
                <div className="flex-1" />
                {/* Active toggle */}
                <ToggleSwitch
                  checked={slide.is_active}
                  onChange={(v) => updateSlide(slide.id, "is_active", v)}
                  label="Active"
                />
              </div>

              {/* ── Card body ── */}
              <div className="p-4 flex flex-col xl:flex-row gap-5">
                {/* Large live preview */}
                <div className="xl:w-72 flex-shrink-0 space-y-2">
                  <SlidePreview slide={slide} />
                  {/* Preview + reorder controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewIndex(idx)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:border-accent hover:text-accent transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>
                    <button
                      onClick={() => moveSlide(slide.id, "up")}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-border text-muted-foreground hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveSlide(slide.id, "down")}
                      disabled={idx === slides.length - 1}
                      className="p-1.5 rounded-lg border border-border text-muted-foreground hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* ── Editable fields ── */}
                <div className="flex-1 space-y-4">
                  {/* Image URL */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Image URL
                    </label>
                    <input
                      value={slide.image_url}
                      onChange={(e) =>
                        updateSlide(slide.id, "image_url", e.target.value)
                      }
                      className="input-base text-sm"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  {/* Title + Subtitle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Title
                      </label>
                      <input
                        value={slide.title}
                        onChange={(e) =>
                          updateSlide(slide.id, "title", e.target.value)
                        }
                        className="input-base text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Subtitle
                      </label>
                      <input
                        value={slide.subtitle}
                        onChange={(e) =>
                          updateSlide(slide.id, "subtitle", e.target.value)
                        }
                        className="input-base text-sm"
                      />
                    </div>
                  </div>

                  {/* Button text + link */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Button text
                      </label>
                      <input
                        value={slide.button_text}
                        onChange={(e) =>
                          updateSlide(slide.id, "button_text", e.target.value)
                        }
                        className="input-base text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Button link
                      </label>
                      <input
                        value={slide.button_link}
                        onChange={(e) =>
                          updateSlide(slide.id, "button_link", e.target.value)
                        }
                        className="input-base text-sm"
                        placeholder="/search"
                      />
                    </div>
                  </div>

                  {/* Overlay controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 border-t border-border">
                    {/* Colour picker */}
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Overlay colour
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={slide.overlay_color}
                          onChange={(e) =>
                            updateSlide(
                              slide.id,
                              "overlay_color",
                              e.target.value
                            )
                          }
                          className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5 bg-white"
                        />
                        <div>
                          <p className="text-xs font-mono text-foreground">
                            {slide.overlay_color.toUpperCase()}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Click to pick colour
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Opacity slider */}
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">
                        Overlay opacity —{" "}
                        <span className="text-accent">
                          {Math.round(slide.overlay_opacity * 100)}%
                        </span>
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={0.2}
                          max={0.9}
                          step={0.05}
                          value={slide.overlay_opacity}
                          onChange={(e) =>
                            updateSlide(
                              slide.id,
                              "overlay_opacity",
                              +e.target.value
                            )
                          }
                          className="flex-1 accent-orange-500"
                        />
                        <span className="text-xs font-bold text-foreground w-8 text-right">
                          {Math.round(slide.overlay_opacity * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                        <span>Light</span>
                        <span>Dark</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Delete button (relative container for popover) ── */}
                <div className="relative flex-shrink-0 xl:self-start">
                  <button
                    onClick={() =>
                      setDeleteConfirm(
                        deleteConfirm === slide.id ? null : slide.id
                      )
                    }
                    className={cn(
                      "p-2.5 rounded-xl border-2 transition-all",
                      deleteConfirm === slide.id
                        ? "border-red-300 bg-red-50 text-red-500"
                        : "border-border text-muted-foreground hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                    )}
                    title="Delete slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {deleteConfirm === slide.id && (
                    <DeleteConfirm
                      onConfirm={() => deleteSlide(slide.id)}
                      onCancel={() => setDeleteConfirm(null)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Add Slide Form ── */}
        {showAddForm && (
          <AddSlideForm
            onAdd={addSlide}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* ── Quick stats footer ── */}
        <div className="flex items-center gap-6 px-1 text-sm text-muted-foreground">
          <span>
            <strong className="text-foreground">{slides.length}</strong> total
            slides
          </span>
          <span>
            <strong className="text-emerald-600">
              {slides.filter((s) => s.is_active).length}
            </strong>{" "}
            active
          </span>
          <span>
            <strong className="text-muted-foreground">
              {slides.filter((s) => !s.is_active).length}
            </strong>{" "}
            inactive
          </span>
        </div>
      </div>
    </>
  );
}
