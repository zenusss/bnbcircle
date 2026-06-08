// ─────────────────────────────────────────────────────────────
// pages/admin/EmailTemplates.tsx
// Admin panel for viewing and editing email notification templates
// ─────────────────────────────────────────────────────────────

import React, {
  useState,
  useRef,
  useCallback,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from "react";
import {
  Save,
  Eye,
  Code2,
  FileText,
  X,
  Send,
  Check,
  ChevronRight,
  Clipboard,
  Mail,
  Clock,
  Tag,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EMAIL_TEMPLATES,
  renderTemplate,
  SAMPLE_VARS,
  type EmailTemplate,
} from "@/features/notifications/emailTemplates";

// ── Category metadata ─────────────────────────────────────────

type Category = EmailTemplate["category"];

const CATEGORY_META: Record<Category, { label: string; color: string; dotColor: string }> = {
  booking:       { label: "Booking",       color: "text-blue-700",   dotColor: "bg-blue-500"   },
  auth:          { label: "Auth",          color: "text-violet-700", dotColor: "bg-violet-500" },
  reviews:       { label: "Reviews",       color: "text-amber-700",  dotColor: "bg-amber-500"  },
  notifications: { label: "Notifications", color: "text-emerald-700",dotColor: "bg-emerald-500"},
};

const CATEGORY_ORDER: Category[] = ["booking", "auth", "reviews", "notifications"];

// ── Helpers ───────────────────────────────────────────────────

/** Group template entries by category in display order */
function groupedTemplates(): Array<{ category: Category; templates: EmailTemplate[] }> {
  const groups = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    templates: Object.values(EMAIL_TEMPLATES).filter((t) => t.category === cat),
  }));
  return groups.filter((g) => g.templates.length > 0);
}

/** Format ISO timestamp to "May 1, 2026 10:00" */
function fmtDate(iso?: string): string {
  if (!iso) return "Never saved";
  return new Intl.DateTimeFormat("en-NL", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

// ── Sub-components ────────────────────────────────────────────

/** Variable chip that inserts {{varName}} at textarea cursor */
interface VarChipProps {
  varName: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onInserted: (html: string) => void;
}

function VarChip({ varName, textareaRef, onInserted }: VarChipProps) {
  const [flash, setFlash] = useState(false);

  const handleClick = () => {
    const ta = textareaRef.current;
    const token = `{{${varName}}}`;
    if (ta) {
      const start = ta.selectionStart;
      const end   = ta.selectionEnd;
      const before = ta.value.slice(0, start);
      const after  = ta.value.slice(end);
      const next   = before + token + after;
      onInserted(next);
      // Restore cursor after token
      requestAnimationFrame(() => {
        ta.focus();
        ta.selectionStart = start + token.length;
        ta.selectionEnd   = start + token.length;
      });
    }
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Insert {{${varName}}}`}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-semibold border transition-all duration-150",
        flash
          ? "bg-accent text-white border-accent"
          : "bg-accent/8 text-accent border-accent/20 hover:bg-accent/15 hover:border-accent/40"
      )}
    >
      <Tag className="w-2.5 h-2.5" />
      {`{{${varName}}}`}
    </button>
  );
}

// ── Preview modal ─────────────────────────────────────────────

interface PreviewModalProps {
  template: EmailTemplate;
  editedHtml: string;
  onClose: () => void;
}

function PreviewModal({ template, editedHtml, onClose }: PreviewModalProps) {
  const rendered = editedHtml.replace(/\{\{(\w+)\}\}/g, (_m, k: string) =>
    SAMPLE_VARS[k] ?? `<span style="background:#fff3cd;color:#856404;padding:0 3px;border-radius:3px;">{{${k}}}</span>`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(11,31,58,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Eye className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="font-bold text-primary text-sm">{template.name}</p>
              <p className="text-xs text-muted-foreground">Preview with sample data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subject preview bar */}
        <div className="px-6 py-3 bg-muted/40 border-b border-border flex items-center gap-2 text-sm">
          <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground font-medium">Subject:</span>
          <span className="text-foreground font-semibold truncate">
            {template.subject.replace(/\{\{(\w+)\}\}/g, (_m, k: string) => SAMPLE_VARS[k] ?? `{{${k}}}`)}
          </span>
        </div>

        {/* Email iframe-like preview */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div
            className="rounded-xl overflow-hidden shadow-lg"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: rendered }}
          />
        </div>

        <div className="px-6 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" />
            Sample data substituted. Unmapped variables shown in yellow.
          </span>
          <button onClick={onClose} className="btn-ghost text-xs py-1.5 px-3">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Test send panel ───────────────────────────────────────────

interface TestSendPanelProps {
  templateId: string;
}

function TestSendPanel({ templateId }: TestSendPanelProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSend = () => {
    if (!email.includes("@")) { setState("error"); return; }
    setState("sending");
    setTimeout(() => { setState("sent"); setTimeout(() => setState("idle"), 3000); }, 1400);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="test@example.com"
          className={cn(
            "input-base pl-9 py-2 text-sm",
            state === "error" && "border-red-400 focus:ring-red-300"
          )}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={state === "sending" || state === "sent"}
        className={cn(
          "flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
          state === "sent"
            ? "bg-emerald-500 text-white"
            : state === "sending"
            ? "bg-muted text-muted-foreground cursor-wait"
            : "bg-primary text-white hover:bg-primary/90"
        )}
      >
        {state === "sent" ? (
          <><Check className="w-4 h-4" />Sent!</>
        ) : state === "sending" ? (
          <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />Sending…</>
        ) : (
          <><Send className="w-4 h-4" />Send test</>
        )}
      </button>
      {state === "error" && (
        <span className="text-xs text-red-500">Enter a valid email</span>
      )}
    </div>
  );
}

// ── Main page component ───────────────────────────────────────

interface EditState {
  subject: string;
  htmlBody: string;
  savedAt: string;
}

export default function AdminEmailTemplates() {
  const allTemplates = Object.values(EMAIL_TEMPLATES);
  const [activeId, setActiveId]   = useState<string>(allTemplates[0].id);
  const [viewMode, setViewMode]   = useState<"html" | "text">("html");
  const [previewOpen, setPreview] = useState(false);
  const [savedIds, setSavedIds]   = useState<Set<string>>(new Set());

  // Per-template editable state (subject + body)
  const [edits, setEdits] = useState<Record<string, EditState>>(() =>
    Object.fromEntries(
      Object.values(EMAIL_TEMPLATES).map((t) => [
        t.id,
        { subject: t.subject, htmlBody: t.htmlBody, savedAt: t.lastSaved ?? "" },
      ])
    )
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activeTemplate = EMAIL_TEMPLATES[activeId];
  const activeEdit     = edits[activeId];

  const setField = useCallback(
    (field: keyof Pick<EditState, "subject" | "htmlBody">, value: string) => {
      setEdits((prev) => ({
        ...prev,
        [activeId]: { ...prev[activeId], [field]: value },
      }));
    },
    [activeId]
  );

  const handleSave = () => {
    const now = new Date().toISOString();
    setEdits((prev) => ({
      ...prev,
      [activeId]: { ...prev[activeId], savedAt: now },
    }));
    setSavedIds((prev) => new Set(prev).add(activeId));
    setTimeout(() => {
      setSavedIds((prev) => { const s = new Set(prev); s.delete(activeId); return s; });
    }, 2500);
  };

  // Copy HTML body to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(activeEdit.htmlBody).catch(() => {});
  };

  const grouped = groupedTemplates();

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Email Templates</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage the 14 transactional email templates sent by Bnb Circle.
          </p>
        </div>
        {savedIds.has(activeId) && (
          <span className="badge-green animate-in fade-in duration-200">
            <Check className="w-3 h-3" /> Saved
          </span>
        )}
      </div>

      <div className="flex gap-6 min-h-0" style={{ alignItems: "flex-start" }}>
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="w-56 flex-shrink-0 sticky top-0">
          <div className="card-base overflow-visible">
            <div className="p-3 border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Templates
              </p>
            </div>
            <nav className="p-2 space-y-4">
              {grouped.map(({ category, templates }) => {
                const meta = CATEGORY_META[category];
                return (
                  <div key={category}>
                    {/* Category heading */}
                    <p className={cn("flex items-center gap-1.5 px-2 py-1 text-xs font-bold uppercase tracking-wider", meta.color)}>
                      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", meta.dotColor)} />
                      {meta.label}
                    </p>
                    {templates.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => setActiveId(tmpl.id)}
                        className={cn(
                          "w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 group",
                          activeId === tmpl.id
                            ? "bg-accent/10 text-accent font-semibold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <span className="truncate">{tmpl.name}</span>
                        <ChevronRight
                          className={cn(
                            "w-3.5 h-3.5 flex-shrink-0 transition-transform",
                            activeId === tmpl.id
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* ── Editor area ──────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Template meta bar */}
          <div className="card-base p-4 flex items-center gap-4 flex-wrap">
            <div
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-bold border",
                CATEGORY_META[activeTemplate.category].color,
                "border-current/30 bg-current/10"
              )}
            >
              {CATEGORY_META[activeTemplate.category].label}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-primary text-base truncate">{activeTemplate.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Trigger: {activeTemplate.trigger}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
              {fmtDate(activeEdit.savedAt)}
            </div>
          </div>

          {/* Subject line */}
          <div className="card-base p-5">
            <label className="block text-sm font-semibold text-primary mb-2">
              Subject line
            </label>
            <input
              type="text"
              value={activeEdit.subject}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setField("subject", e.target.value)}
              className="input-base font-medium"
              placeholder="Email subject…"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Variables in subject:{" "}
              {activeTemplate.variables
                .filter((v) => activeTemplate.subject.includes(`{{${v}}}`))
                .map((v) => (
                  <code key={v} className="mx-0.5 px-1 py-0.5 rounded bg-muted text-accent text-xs font-mono">
                    {`{{${v}}}`}
                  </code>
                ))}
            </p>
          </div>

          {/* HTML/text editor */}
          <div className="card-base p-5">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode("html")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    viewMode === "html"
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Code2 className="w-3.5 h-3.5" /> HTML
                </button>
                <button
                  onClick={() => setViewMode("text")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    viewMode === "text"
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <FileText className="w-3.5 h-3.5" /> Plain text
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="btn-ghost text-xs py-1.5 px-3"
                  title="Copy HTML to clipboard"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  Copy
                </button>
                <button
                  onClick={() => setPreview(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-primary text-primary text-sm font-semibold transition-all hover:bg-primary hover:text-white"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>
            </div>

            {/* Variable chips */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                Available variables — click to insert at cursor
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeTemplate.variables.map((v) => (
                  <VarChip
                    key={v}
                    varName={v}
                    textareaRef={textareaRef}
                    onInserted={(html) => setField("htmlBody", html)}
                  />
                ))}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={viewMode === "html" ? activeEdit.htmlBody : activeEdit.htmlBody.replace(/<[^>]+>/g, "")}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                if (viewMode === "html") setField("htmlBody", e.target.value);
              }}
              readOnly={viewMode === "text"}
              rows={20}
              spellCheck={false}
              className={cn(
                "input-base resize-y font-mono text-xs leading-relaxed",
                viewMode === "text" && "bg-muted/50 cursor-default text-muted-foreground"
              )}
              style={{ tabSize: 2 }}
              placeholder="Email HTML body…"
            />
            {viewMode === "text" && (
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Plain text view is read-only. Switch to HTML to edit.
              </p>
            )}
          </div>

          {/* Test send */}
          <div className="card-base p-5">
            <p className="text-sm font-semibold text-primary mb-3">
              Send test email
            </p>
            <TestSendPanel templateId={activeId} />
            <p className="text-xs text-muted-foreground mt-2">
              Sends this template with sample data to the address above (simulated in demo).
            </p>
          </div>

          {/* Save bar */}
          <div className="flex items-center justify-between gap-4 py-2">
            <p className="text-xs text-muted-foreground">
              {savedIds.has(activeId)
                ? "✓ All changes saved"
                : "Unsaved changes will be lost on navigation"}
            </p>
            <button onClick={handleSave} className="btn-primary">
              <Save className="w-4 h-4" />
              Save template
            </button>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {previewOpen && (
        <PreviewModal
          template={activeTemplate}
          editedHtml={activeEdit.htmlBody}
          onClose={() => setPreview(false)}
        />
      )}
    </div>
  );
}
