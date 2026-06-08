import React from "react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { AlertTriangle, MessageSquare } from "lucide-react";
import type { Conversation } from "../types";

// ─── Props ───────────────────────────────────────────────────────────────────

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  currentUserId: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Online dot colour — based on conversation status */
const STATUS_DOT: Record<string, string> = {
  active:           "bg-emerald-400",
  needs_attention:  "bg-yellow-400",
  escalated:        "bg-red-500",
  resolved:         "bg-gray-300",
  closed:           "bg-gray-200",
};

function formatLastTime(isoString: string): string {
  const d = new Date(isoString);
  return isToday(d) ? format(d, "HH:mm") : format(d, "d MMM");
}

function truncate(text: string, max = 40): string {
  return text.length <= max ? text : text.slice(0, max) + "…";
}

// ─── Single conversation row ──────────────────────────────────────────────────

function ConvItem({
  conv,
  isActive,
  onSelect,
  currentUserId,
}: {
  conv: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  currentUserId: string;
}) {
  const isEscalated = conv.escalationLevel === "escalated";
  const isFlagged   = conv.escalationLevel === "flagged";

  // The "other" participant (not me)
  const other = conv.participants.find((p) => p.id !== currentUserId);
  const isOtherOnline = other?.isOnline ?? false;

  const timeLabel = conv.lastMessage ? formatLastTime(conv.lastMessage.createdAt) : "";
  const preview   = conv.lastMessage ? truncate(conv.lastMessage.content) : "No messages yet";

  return (
    <button
      onClick={() => onSelect(conv.id)}
      className={cn(
        "w-full text-left flex items-start gap-3 px-4 py-3.5 transition-all",
        isActive
          ? "bg-accent/8 border-l-2 border-accent"
          : "hover:bg-muted/50 border-l-2 border-transparent",
        isEscalated && !isActive && "bg-red-50/60 border-l-2 border-red-300",
        isFlagged   && !isActive && "bg-yellow-50/60 border-l-2 border-yellow-300"
      )}
    >
      {/* Avatar with online dot */}
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
            isEscalated ? "bg-red-100 text-red-700" :
            isFlagged   ? "bg-yellow-100 text-yellow-700" :
                          "bg-primary/10 text-primary"
          )}
        >
          {other?.name?.[0] ?? "?"}
        </div>

        {/* Online indicator dot */}
        <div
          className={cn(
            "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
            isOtherOnline
              ? "bg-emerald-400"
              : STATUS_DOT[conv.status] ?? "bg-gray-300"
          )}
          title={isOtherOnline ? "Online" : conv.status}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name row */}
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <p
              className={cn(
                "text-sm font-semibold truncate",
                isActive ? "text-accent" : "text-foreground"
              )}
            >
              {other?.name ?? "Unknown"}
            </p>
            {/* Escalation triangle badge */}
            {isEscalated && (
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            )}
            {isFlagged && (
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
            )}
          </div>

          {/* Timestamp + unread badge */}
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
            {conv.unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
              </span>
            )}
            {timeLabel && (
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{timeLabel}</span>
            )}
          </div>
        </div>

        {/* Listing subtitle */}
        <p className="text-xs text-muted-foreground truncate mb-0.5">
          {conv.listing.title} · {conv.listing.city}
        </p>

        {/* Last message preview */}
        <p
          className={cn(
            "text-xs truncate",
            conv.unreadCount > 0 ? "font-semibold text-foreground" : "text-muted-foreground"
          )}
        >
          {preview}
        </p>
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  currentUserId,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <MessageSquare className="w-7 h-7 text-muted-foreground/50" />
        </div>
        <p className="font-semibold text-sm text-foreground mb-1">No conversations yet</p>
        <p className="text-xs text-muted-foreground">Messages with hosts will appear here</p>
      </div>
    );
  }

  // Sort: escalated first, then by updatedAt descending
  const sorted = [...conversations].sort((a, b) => {
    const aScore = a.escalationLevel === "escalated" ? 2 : a.escalationLevel === "flagged" ? 1 : 0;
    const bScore = b.escalationLevel === "escalated" ? 2 : b.escalationLevel === "flagged" ? 1 : 0;
    if (aScore !== bScore) return bScore - aScore;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const escalated = sorted.filter((c) => c.escalationLevel === "escalated");
  const rest      = sorted.filter((c) => c.escalationLevel !== "escalated");

  return (
    <div className="flex-1 overflow-y-auto">
      {escalated.length > 0 && (
        <>
          <div className="px-4 py-2 bg-red-50 border-b border-red-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" /> Escalated ({escalated.length})
            </p>
          </div>
          {escalated.map((conv) => (
            <ConvItem
              key={conv.id}
              conv={conv}
              isActive={conv.id === activeId}
              onSelect={onSelect}
              currentUserId={currentUserId}
            />
          ))}
        </>
      )}

      {rest.length > 0 && (
        <>
          {escalated.length > 0 && (
            <div className="px-4 py-2 bg-muted/30 border-b border-border">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                All conversations
              </p>
            </div>
          )}
          {rest.map((conv) => (
            <ConvItem
              key={conv.id}
              conv={conv}
              isActive={conv.id === activeId}
              onSelect={onSelect}
              currentUserId={currentUserId}
            />
          ))}
        </>
      )}
    </div>
  );
}
