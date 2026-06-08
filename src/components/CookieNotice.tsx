import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X, Check, Shield, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const COOKIE_KEY = "bnb_cookie_consent";
type ConsentState = "accepted" | "rejected" | "custom" | null;
interface CookiePrefs { necessary: true; analytics: boolean; marketing: boolean; preferences: boolean; }

const COOKIE_TYPES = [
  { key: "necessary" as const,   label: "Necessary",   desc: "Required for the site to function.", locked: true },
  { key: "analytics" as const,   label: "Analytics",   desc: "Help us understand site traffic.", locked: false },
  { key: "marketing" as const,   label: "Marketing",   desc: "Show relevant ads.", locked: false },
  { key: "preferences" as const, label: "Preferences", desc: "Remember your settings.", locked: false },
];

export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({
    necessary: true, analytics: false, marketing: false, preferences: false,
  });

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      const t = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  const save = (state: ConsentState) => {
    const finalPrefs: CookiePrefs =
      state === "accepted"
        ? { necessary: true, analytics: true, marketing: true, preferences: true }
        : state === "rejected"
        ? { necessary: true, analytics: false, marketing: false, preferences: false }
        : { ...prefs };
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ state, prefs: finalPrefs, ts: Date.now() }));
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] max-w-[320px] w-[calc(100vw-2rem)] sm:w-80">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden
        animate-in slide-in-from-bottom-3 duration-300 ease-out">

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <Cookie className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm font-bold text-gray-900">Cookie preferences</p>
          </div>
          <button onClick={() => save("rejected")}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
            aria-label="Decline and close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 pb-4 space-y-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            We use cookies to improve your experience.{" "}
            <Link to="/privacy" className="text-primary hover:underline font-medium">
              Privacy policy
            </Link>
          </p>

          {/* Expanded preferences */}
          {expanded && (
            <div className="space-y-2.5 border border-gray-100 rounded-xl p-3 bg-gray-50">
              {COOKIE_TYPES.map(ct => (
                <div key={ct.key} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                      {ct.label}
                      {ct.locked && <span className="text-[9px] bg-gray-200 text-gray-500 px-1 rounded">on</span>}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">{ct.desc}</p>
                  </div>
                  {ct.locked ? (
                    <div className="w-8 h-4 bg-green-500 rounded-full flex items-center justify-end px-0.5 shrink-0 cursor-not-allowed">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  ) : (
                    <button
                      onClick={() => setPrefs(p => ({ ...p, [ct.key]: !p[ct.key] }))}
                      className={cn(
                        "w-8 h-4 rounded-full flex items-center transition-colors shrink-0",
                        prefs[ct.key] ? "bg-primary justify-end px-0.5" : "bg-gray-300 justify-start px-0.5",
                      )}>
                      <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            <button onClick={() => save("accepted")}
              className="flex-1 bg-primary text-white text-xs font-semibold py-2 px-3 rounded-xl
                hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Accept all
            </button>

            {expanded ? (
              <button onClick={() => save("custom")}
                className="flex-1 border-2 border-primary text-primary text-xs font-semibold py-2 px-3 rounded-xl
                  hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Save
              </button>
            ) : (
              <button onClick={() => setExpanded(true)}
                className="flex-1 border border-gray-200 text-gray-600 text-xs font-semibold py-2 px-3 rounded-xl
                  hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                Customize
                <ChevronDown className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
