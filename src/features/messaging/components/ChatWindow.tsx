import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Send, Flag, X, MoreVertical, CheckCheck, AlertTriangle,
  Zap, Smile, ShieldAlert,
} from "lucide-react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { useMessages } from "../hooks/useMessaging";
import { MessageBubble } from "./MessageBubble";
import type { Conversation, EscalationLevel } from "../types";

// ─── Constants ──────────────────────────────────────────────────────────────

const QUICK_REPLIES_HOST = [
  "Yes, those dates are available! Feel free to send a booking request.",
  "I'm sorry, those dates are already taken.",
  "I'll confirm availability within 24 hours.",
  "Check-in is at 15:00. I'll send you the key code the morning of arrival.",
  "Welcome! Please let me know if you need anything.",
];

const QUICK_REPLIES_GUEST = [
  "Thank you for the quick reply!",
  "That works perfectly for us.",
  "We look forward to our stay!",
  "Could you clarify check-in instructions?",
];

const COMMON_EMOJIS = [
  "😊","😂","❤️","👍","🙏","😍","🎉","😅",
  "✨","🔥","😭","🤔","👏","💪","🌟","😎",
  "🏠","🛏️","🗓️","✅",
];

// ─── Suspicious content detection ───────────────────────────────────────────

const PHONE_RE = /[\d\s\-()]{7,}/;
const EMAIL_RE = /@/;
const LINK_RE = /https?:\/\//i;

function hasSuspiciousContent(text: string): boolean {
  return PHONE_RE.test(text) || EMAIL_RE.test(text) || LINK_RE.test(text);
}

// ─── Escalation helpers ──────────────────────────────────────────────────────

const ESCALATION_NEXT: Record<EscalationLevel, { label: string; colorCls: string } | null> = {
  none:             { label: "Flag conversation",     colorCls: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" },
  flagged:          { label: "Escalate to admin",     colorCls: "bg-red-50 text-red-700 hover:bg-red-100" },
  escalated:        null, // admin resolves
  resolved:         { label: "Flag conversation",     colorCls: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" },
};

const ESCALATION_BADGE: Record<EscalationLevel, string | null> = {
  none:      null,
  flagged:   "badge-yellow",
  escalated: "badge-red",
  resolved:  "status-draft",
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface ChatWindowProps {
  conversation: Conversation;
  currentUserId: string;
  currentUserName: string;
  currentUserRole: "guest" | "host" | "admin";
  onEscalate?: (conversationId: string, reason: string) => void;
  onCycleEscalation?: (conversationId: string) => void;
  onResolve?: (conversationId: string) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ChatWindow({
  conversation,
  currentUserId,
  currentUserName,
  currentUserRole,
  onEscalate,
  onCycleEscalation,
  onResolve,
}: ChatWindowProps) {
  const { messages, isSending, isTyping, sendMessage } = useMessages(conversation.id);

  const [input, setInput] = useState("");
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateReason, setEscalateReason] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const escalationLevel = conversation.escalationLevel;
  const isEscalated = escalationLevel === "escalated";
  const isFlagged = escalationLevel === "flagged";
  const suspiciousWarning = hasSuspiciousContent(input);
  const quickReplies = currentUserRole === "host" ? QUICK_REPLIES_HOST : QUICK_REPLIES_GUEST;
  const nextEscalation = ESCALATION_NEXT[escalationLevel];
  const escalationBadge = ESCALATION_BADGE[escalationLevel];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    await sendMessage(input, currentUserId, currentUserName, currentUserRole);
    setInput("");
    setShowEmojiPicker(false);
  }, [input, sendMessage, currentUserId, currentUserName, currentUserRole]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (text: string) => {
    setInput(text);
    setShowQuickReplies(false);
    textareaRef.current?.focus();
  };

  const insertEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleEscalate = () => {
    if (!escalateReason.trim()) return;
    onEscalate?.(conversation.id, escalateReason);
    setShowEscalateModal(false);
    setEscalateReason("");
  };

  const handleCycleEscalation = () => {
    setShowMenu(false);
    if (escalationLevel === "none" || escalationLevel === "resolved") {
      // For first flag we just cycle (no reason required)
      onCycleEscalation?.(conversation.id);
    } else if (escalationLevel === "flagged") {
      // Going to escalated — show reason modal
      setShowEscalateModal(true);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-muted/20">
      {/* ── Header ── */}
      <div
        className={cn(
          "flex items-center justify-between px-5 py-4 border-b border-border bg-white",
          isEscalated && "border-b-red-300",
          isFlagged && "border-b-yellow-300"
        )}
      >
        <div className="flex items-center gap-3">
          <img
            src={conversation.listing.imageUrl}
            alt={conversation.listing.title}
            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm text-foreground leading-tight">
                {conversation.listing.title}
              </p>
              {escalationBadge && (
                <span className={cn(escalationBadge, "capitalize text-[10px]")}>
                  {escalationLevel}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{conversation.listing.city}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Admin resolve button */}
          {currentUserRole === "admin" && isEscalated && (
            <button
              onClick={() => onResolve?.(conversation.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark resolved
            </button>
          )}

          {/* ⋮ More menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-border rounded-xl shadow-lg z-20 overflow-hidden">
                {/* Flag / escalation cycling */}
                {nextEscalation && (
                  <button
                    onClick={handleCycleEscalation}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors",
                      nextEscalation.colorCls
                    )}
                  >
                    {escalationLevel === "none" || escalationLevel === "resolved"
                      ? <Flag className="w-4 h-4" />
                      : <ShieldAlert className="w-4 h-4" />}
                    {nextEscalation.label}
                  </button>
                )}
                <button
                  onClick={() => { setShowMenu(false); setShowQuickReplies((v) => !v); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Zap className="w-4 h-4 text-muted-foreground" /> Quick replies
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Escalation banner ── */}
      {(isEscalated || isFlagged) && (
        <div
          className={cn(
            "flex items-center gap-3 px-5 py-3 border-b",
            isEscalated ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"
          )}
        >
          <AlertTriangle
            className={cn("w-5 h-5 flex-shrink-0", isEscalated ? "text-red-500" : "text-yellow-500")}
          />
          <div className="flex-1">
            <p className={cn("text-sm font-bold", isEscalated ? "text-red-700" : "text-yellow-700")}>
              {isEscalated ? "This conversation is escalated" : "This conversation needs attention"}
            </p>
            {conversation.escalationReason && (
              <p className={cn("text-xs", isEscalated ? "text-red-600" : "text-yellow-600")}>
                {conversation.escalationReason}
              </p>
            )}
          </div>
          {conversation.escalatedAt && (
            <p className={cn("text-xs flex-shrink-0", isEscalated ? "text-red-500" : "text-yellow-500")}>
              {format(new Date(conversation.escalatedAt), "d MMM, HH:mm")}
            </p>
          )}
        </div>
      )}

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
        {messages.map((message, idx) => {
          const isMine = message.sender.id === currentUserId;
          const showAvatar = idx === 0 || messages[idx - 1].sender.id !== message.sender.id;
          return (
            <MessageBubble
              key={message.id}
              message={message}
              isMine={isMine}
              showAvatar={showAvatar}
              currentUserId={currentUserId}
            />
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 self-end">
              {conversation.participants.find((p) => p.id !== currentUserId)?.name?.[0] ?? "?"}
            </div>
            <div className="flex flex-col gap-1">
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-border shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Quick Replies ── */}
      {showQuickReplies && (
        <div className="px-4 pb-2 flex flex-wrap gap-2 border-t border-border bg-white pt-3">
          <p className="w-full text-xs font-semibold text-muted-foreground mb-1">Quick replies</p>
          {quickReplies.map((r, i) => (
            <button
              key={i}
              onClick={() => handleQuickReply(r)}
              className="px-3 py-1.5 rounded-full border border-border text-xs text-foreground hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
            >
              {r.length > 50 ? r.slice(0, 50) + "…" : r}
            </button>
          ))}
        </div>
      )}

      {/* ── Emoji Picker ── */}
      {showEmojiPicker && (
        <div className="border-t border-border bg-white px-4 pt-3 pb-2">
          <div className="grid grid-cols-10 gap-1">
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="text-xl leading-none p-1.5 rounded-lg hover:bg-muted transition-colors"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input area ── */}
      <div className="border-t border-border bg-white px-4 py-3">
        {/* Suspicious content warning */}
        {suspiciousWarning && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl bg-yellow-50 border border-yellow-200">
            <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <p className="text-xs text-yellow-700 font-medium">
              Tip: Keep communication on BnbCircle for your safety.
            </p>
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Emoji button */}
          <button
            onClick={() => { setShowEmojiPicker((v) => !v); setShowQuickReplies(false); }}
            className={cn(
              "p-2 rounded-xl transition-colors flex-shrink-0",
              showEmojiPicker ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted"
            )}
            title="Emoji"
          >
            <Smile className="w-4 h-4" />
          </button>

          {/* Quick replies button */}
          <button
            onClick={() => { setShowQuickReplies((v) => !v); setShowEmojiPicker(false); }}
            className={cn(
              "p-2 rounded-xl transition-colors flex-shrink-0",
              showQuickReplies ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-muted"
            )}
            title="Quick replies"
          >
            <Zap className="w-4 h-4" />
          </button>

          {/* Textarea */}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="w-full input-base resize-none text-sm min-h-[44px] max-h-32 overflow-auto"
              style={{ height: "auto" }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 128) + "px";
              }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            className="btn-primary px-4 py-2.5 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
          Messages are monitored for safety. Report issues using the ⋮ menu.
        </p>
      </div>

      {/* ── Escalate modal ── */}
      {showEscalateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                Escalate to admin
              </h3>
              <button onClick={() => setShowEscalateModal(false)} className="p-2 rounded-xl hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Escalating sends this conversation to an admin mediator. Use for urgent issues, safety concerns, or disputes that can't be resolved directly.
            </p>
            <textarea
              value={escalateReason}
              onChange={(e) => setEscalateReason(e.target.value)}
              placeholder="Describe the issue (e.g. 'Maintenance problem not resolved after 3 hours')"
              rows={3}
              className="input-base resize-none text-sm mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleEscalate}
                disabled={!escalateReason.trim()}
                className="btn-primary flex-1 justify-center disabled:opacity-50"
              >
                <ShieldAlert className="w-4 h-4" /> Escalate to admin
              </button>
              <button onClick={() => setShowEscalateModal(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers re-exported ──────────────────────────────────────────────────────

/** Format a message timestamp: HH:mm if today, otherwise 'd MMM' */
export function formatMessageTime(isoString: string): string {
  const date = new Date(isoString);
  return isToday(date) ? format(date, "HH:mm") : format(date, "d MMM");
}
