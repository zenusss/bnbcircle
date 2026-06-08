import React from "react";
import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";
import { Check, CheckCheck, Clock, AlertTriangle, Info, CalendarCheck, CalendarX } from "lucide-react";
import type { Message } from "../types";

// ─── Props ───────────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  showAvatar?: boolean;
  /** Needed to detect read receipts for outgoing messages */
  currentUserId?: string;
}

// ─── Status icons ─────────────────────────────────────────────────────────────

const STATUS_ICONS: Record<Message["status"], React.ReactNode> = {
  sending:   <Clock     className="w-3 h-3 text-muted-foreground" />,
  sent:      <Check     className="w-3 h-3 text-muted-foreground" />,
  delivered: <CheckCheck className="w-3 h-3 text-muted-foreground" />,
  read:      <CheckCheck className="w-3 h-3 text-accent" />,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** HH:mm if today, 'd MMM' otherwise */
function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return isToday(d) ? format(d, "HH:mm") : format(d, "d MMM");
}

// ─── System / booking message ─────────────────────────────────────────────────

function SystemMessageBubble({ message }: { message: Message }) {
  const isBookingConfirmed = message.type === "booking_confirmed";
  const isBookingDeclined  = message.type === "booking_declined";
  const isBookingRequest   = message.type === "booking_request";
  const isEscalated        = message.isEscalated;

  return (
    <div className="flex justify-center my-3">
      <div
        className={cn(
          "flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-medium max-w-sm text-center",
          isBookingConfirmed && "bg-emerald-50 border border-emerald-200 text-emerald-800",
          isBookingDeclined  && "bg-red-50 border border-red-200 text-red-700",
          isBookingRequest   && "bg-blue-50 border border-blue-200 text-blue-800",
          isEscalated        && !isBookingConfirmed && !isBookingDeclined && !isBookingRequest &&
            "bg-orange-50 border border-orange-300 text-orange-800",
          !isBookingConfirmed && !isBookingDeclined && !isBookingRequest && !isEscalated &&
            "bg-muted border border-border text-muted-foreground"
        )}
      >
        {isBookingConfirmed && <CalendarCheck className="w-4 h-4 flex-shrink-0 text-emerald-600" />}
        {isBookingDeclined  && <CalendarX     className="w-4 h-4 flex-shrink-0 text-red-500" />}
        {isBookingRequest   && <Info          className="w-4 h-4 flex-shrink-0 text-blue-600" />}
        {isEscalated && !isBookingConfirmed && !isBookingDeclined && !isBookingRequest && (
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-orange-600" />
        )}
        {!isBookingConfirmed && !isBookingDeclined && !isBookingRequest && !isEscalated && (
          <Info className="w-4 h-4 flex-shrink-0" />
        )}
        <span>{message.content}</span>
      </div>
    </div>
  );
}

// ─── Main bubble ──────────────────────────────────────────────────────────────

export function MessageBubble({
  message,
  isMine,
  showAvatar = true,
  currentUserId: _currentUserId,
}: MessageBubbleProps) {
  if (message.type !== "text") {
    return <SystemMessageBubble message={message} />;
  }

  const timeLabel = formatTime(message.createdAt);

  return (
    <div className={cn("flex gap-2.5 mb-3", isMine ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      {showAvatar ? (
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 self-end",
            isMine ? "bg-accent text-white" : "bg-primary/10 text-primary"
          )}
        >
          {message.sender.name[0]}
        </div>
      ) : (
        <div className="w-8 flex-shrink-0" />
      )}

      {/* Bubble */}
      <div className={cn("flex flex-col gap-1 max-w-[75%]", isMine && "items-end")}>
        {showAvatar && (
          <span className="text-xs text-muted-foreground px-1">
            {isMine ? "You" : message.sender.name}
          </span>
        )}

        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
            isMine
              ? "bg-accent text-white rounded-br-sm"
              : "bg-white border border-border text-foreground rounded-bl-sm",
            message.isEscalated && !isMine && "border-orange-200 bg-orange-50"
          )}
        >
          {message.content}
        </div>

        {/* Timestamp + read receipt */}
        <div className={cn("flex items-center gap-1 px-1", isMine ? "flex-row-reverse" : "flex-row")}>
          <span className="text-[10px] text-muted-foreground">{timeLabel}</span>
          {/* Read receipt tick: only for my outgoing text messages */}
          {isMine && (
            <span title={message.status}>
              {STATUS_ICONS[message.status]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
