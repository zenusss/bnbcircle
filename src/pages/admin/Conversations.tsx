import React, { useState, useMemo, useCallback } from "react";
import {
  MessageSquare, AlertTriangle, CheckCheck, Search, Download,
  X, Filter, ShieldAlert, UserCheck, Send,
} from "lucide-react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DEMO_CONVERSATIONS,
} from "@/features/messaging/hooks/useMessaging";
import { MessageBubble } from "@/features/messaging/components/MessageBubble";
import type { Conversation, ConversationStatus, EscalationLevel, Message } from "@/features/messaging/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTab = "all" | "needs_attention" | "escalated" | "resolved";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ESCALATION_BADGE: Record<EscalationLevel, string> = {
  none:      "status-draft",
  flagged:   "badge-yellow",
  escalated: "badge-red",
  resolved:  "badge-green",
};

const ESCALATION_LABEL: Record<EscalationLevel, string> = {
  none:      "Normal",
  flagged:   "Needs attention",
  escalated: "Escalated",
  resolved:  "Resolved",
};

const STATUS_BADGE: Record<ConversationStatus, string> = {
  active:           "badge-green",
  needs_attention:  "badge-yellow",
  escalated:        "badge-red",
  resolved:         "status-draft",
  closed:           "status-draft",
};

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return isToday(d) ? format(d, "HH:mm") : format(d, "d MMM");
}

function getGuestName(conv: Conversation): string {
  return conv.participants.find((p) => p.role === "guest")?.name ?? "Unknown Guest";
}

function getHostName(conv: Conversation): string {
  return conv.participants.find((p) => p.role === "host")?.name ?? "Unknown Host";
}

// ─── Demo admin messages per conversation ─────────────────────────────────────
// We reuse the DEMO_MESSAGES from the hook by importing conversations;
// but the admin sees all messages so we inline them here too.

const ADMIN_MESSAGES: Record<string, Message[]> = {
  "conv-1": [
    { id: "a1-1", conversationId: "conv-1", sender: { id: "guest-1", name: "Emma van den Berg", role: "guest" }, type: "text", content: "Hi Sarah! I'd love to book your canal house for June 20–24. Is it available?", status: "read", isEscalated: false, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: "a1-2", conversationId: "conv-1", sender: { id: "host-sarah", name: "Sarah Visser", role: "host" }, type: "text", content: "Hello Emma! Yes, those dates are free 😊 I'll confirm your booking request right away.", status: "read", isEscalated: false, createdAt: new Date(Date.now() - 2 * 86400000 + 3600000).toISOString() },
    { id: "a1-sys", conversationId: "conv-1", sender: { id: "system", name: "Bnb Circle", role: "system" }, type: "booking_confirmed", content: "Booking confirmed — 20 Jun to 24 Jun 2026, 2 guests, €797 total", status: "delivered", isEscalated: false, createdAt: new Date(Date.now() - 2 * 86400000 + 3700000).toISOString() },
    { id: "a1-4", conversationId: "conv-1", sender: { id: "guest-1", name: "Emma van den Berg", role: "guest" }, type: "text", content: "Do you have a parking spot nearby? We're bringing a car.", status: "delivered", isEscalated: false, createdAt: new Date(Date.now() - 12 * 60000).toISOString() },
  ],
  "conv-2": [
    { id: "a2-1", conversationId: "conv-2", sender: { id: "guest-mark", name: "Mark Johnson", role: "guest" }, type: "text", content: "Hi Jan, we've just arrived but the heating system doesn't seem to be working.", status: "read", isEscalated: false, createdAt: new Date(Date.now() - 4 * 3600000).toISOString() },
    { id: "a2-2", conversationId: "conv-2", sender: { id: "host-jan", name: "Jan de Boer", role: "host" }, type: "text", content: "I'm really sorry to hear that! Let me contact a technician immediately.", status: "read", isEscalated: false, createdAt: new Date(Date.now() - 3.5 * 3600000).toISOString() },
    { id: "a2-3", conversationId: "conv-2", sender: { id: "guest-mark", name: "Mark Johnson", role: "guest" }, type: "text", content: "The heating is broken and it's freezing. This is unacceptable!", status: "sent", isEscalated: true, createdAt: new Date(Date.now() - 22 * 60000).toISOString() },
    { id: "a2-sys", conversationId: "conv-2", sender: { id: "system", name: "Bnb Circle", role: "system" }, type: "system", content: "This conversation has been escalated for admin review", status: "delivered", isEscalated: true, createdAt: new Date(Date.now() - 20 * 60000).toISOString() },
  ],
  "conv-3": [
    { id: "a3-1", conversationId: "conv-3", sender: { id: "guest-lisa", name: "Lisa Müller", role: "guest" }, type: "text", content: "Hello Sarah! We're very excited about our stay next week. Any tips for the neighbourhood?", status: "read", isEscalated: false, createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: "a3-2", conversationId: "conv-3", sender: { id: "host-sarah", name: "Sarah Visser", role: "host" }, type: "text", content: "Check-in is at 15:00. I'll send the key code tomorrow morning.", status: "read", isEscalated: false, createdAt: new Date(Date.now() - 3 * 3600000).toISOString() },
  ],
  "conv-4": [
    { id: "a4-1", conversationId: "conv-4", sender: { id: "guest-tom", name: "Tom Bakker", role: "guest" }, type: "booking_request", content: "Booking request submitted — 10 Aug to 14 Aug, 4 guests, €680 total", status: "delivered", isEscalated: false, meta: { checkIn: "2026-08-10", checkOut: "2026-08-14", guests: 4, totalPrice: 680 }, createdAt: new Date(Date.now() - 45 * 60000).toISOString() },
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** A small toast notification */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-white px-5 py-3 rounded-2xl shadow-xl animate-in slide-in-from-bottom-4 duration-300">
      <CheckCheck className="w-4 h-4 text-emerald-300" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Detail panel ─────────────────────────────────────────────────────────────

interface DetailPanelProps {
  conv: Conversation;
  onClose: () => void;
  onChangeStatus: (id: string, status: ConversationStatus) => void;
  onResolve: (id: string) => void;
  onJoin: (id: string, message: string) => void;
}

function DetailPanel({ conv, onClose, onChangeStatus, onResolve, onJoin }: DetailPanelProps) {
  const [joinMessage, setJoinMessage] = useState("");
  const [showJoin, setShowJoin] = useState(false);

  const messages = ADMIN_MESSAGES[conv.id] ?? [];
  const guestName = getGuestName(conv);
  const hostName  = getHostName(conv);

  const handleJoin = () => {
    if (!joinMessage.trim()) return;
    onJoin(conv.id, joinMessage.trim());
    setJoinMessage("");
    setShowJoin(false);
  };

  return (
    <div className="flex flex-col h-full border-l border-border bg-white">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="font-bold text-sm text-foreground">{conv.listing.title}</p>
          <p className="text-xs text-muted-foreground">
            {guestName} ↔ {hostName}
          </p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Status row */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <span className={cn(ESCALATION_BADGE[conv.escalationLevel], "capitalize text-[11px]")}>
            {ESCALATION_LABEL[conv.escalationLevel]}
          </span>
          <span className={cn(STATUS_BADGE[conv.status], "capitalize text-[11px]")}>
            {conv.status.replace("_", " ")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Mark as OK */}
          <button
            onClick={() => onChangeStatus(conv.id, "active")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            title="Mark as OK"
          >
            <UserCheck className="w-3.5 h-3.5" /> OK
          </button>
          {/* Resolve */}
          {conv.escalationLevel === "escalated" && (
            <button
              onClick={() => onResolve(conv.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Resolve
            </button>
          )}
        </div>
      </div>

      {/* Escalation reason */}
      {conv.escalationReason && (
        <div className="mx-4 mt-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-700 mb-0.5">Escalation reason</p>
              <p className="text-xs text-red-600">{conv.escalationReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages (read-only) */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1">
          Conversation transcript
        </p>
        {messages.map((msg, idx) => {
          const showAvatar = idx === 0 || messages[idx - 1].sender.id !== msg.sender.id;
          // From admin's view: no message is "mine" (read-only)
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isMine={false}
              showAvatar={showAvatar}
            />
          );
        })}
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No messages</p>
        )}
      </div>

      {/* Join conversation */}
      <div className="border-t border-border px-4 py-3 bg-white">
        {!showJoin ? (
          <button
            onClick={() => setShowJoin(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-primary/30 text-primary text-sm font-semibold hover:border-primary/60 hover:bg-primary/5 transition-all"
          >
            <ShieldAlert className="w-4 h-4" /> Join conversation as mediator
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-primary" />
              Message as admin mediator
            </p>
            <textarea
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
              placeholder="Type your mediation message…"
              rows={2}
              className="input-base resize-none text-sm w-full"
            />
            <div className="flex gap-2">
              <button
                onClick={handleJoin}
                disabled={!joinMessage.trim()}
                className="btn-primary flex-1 justify-center disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
              <button onClick={() => { setShowJoin(false); setJoinMessage(""); }} className="btn-ghost text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(DEMO_CONVERSATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  // ── Filtering / search ────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let list = [...conversations];

    // Filter by tab
    if (activeFilter === "needs_attention") {
      list = list.filter((c) => c.status === "needs_attention" || c.escalationLevel === "flagged");
    } else if (activeFilter === "escalated") {
      list = list.filter((c) => c.escalationLevel === "escalated");
    } else if (activeFilter === "resolved") {
      list = list.filter((c) => c.status === "resolved" || c.escalationLevel === "resolved");
    }

    // Search by guest, host, listing
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          getGuestName(c).toLowerCase().includes(q) ||
          getHostName(c).toLowerCase().includes(q) ||
          c.listing.title.toLowerCase().includes(q)
      );
    }

    // Sort: escalated first, then by updatedAt desc
    list.sort((a, b) => {
      const aScore = a.escalationLevel === "escalated" ? 2 : a.escalationLevel === "flagged" ? 1 : 0;
      const bScore = b.escalationLevel === "escalated" ? 2 : b.escalationLevel === "flagged" ? 1 : 0;
      if (aScore !== bScore) return bScore - aScore;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return list;
  }, [conversations, activeFilter, search]);

  const selectedConv = conversations.find((c) => c.id === selectedId) ?? null;

  // ── Tab counts ────────────────────────────────────────────────────────────

  const counts = useMemo(() => ({
    all:              conversations.length,
    needs_attention:  conversations.filter((c) => c.status === "needs_attention" || c.escalationLevel === "flagged").length,
    escalated:        conversations.filter((c) => c.escalationLevel === "escalated").length,
    resolved:         conversations.filter((c) => c.status === "resolved" || c.escalationLevel === "resolved").length,
  }), [conversations]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const changeStatus = useCallback((id: string, status: ConversationStatus) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c))
    );
    showToast("Status updated");
  }, [showToast]);

  const resolveEscalation = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "resolved" as ConversationStatus, escalationLevel: "resolved" as EscalationLevel, resolvedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          : c
      )
    );
    showToast("Conversation resolved");
  }, [showToast]);

  const handleJoin = useCallback((_id: string, _message: string) => {
    // In a real app: send admin message to the conversation
    showToast("Message sent as mediator");
  }, [showToast]);

  const handleExportCSV = () => {
    showToast("Export started — CSV will download shortly");
  };

  // ── Tab definitions ───────────────────────────────────────────────────────

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all",             label: "All" },
    { key: "needs_attention", label: "Needs attention" },
    { key: "escalated",       label: "Escalated" },
    { key: "resolved",        label: "Resolved" },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* ── Page header ── */}
      <div className="px-6 pt-6 pb-4 border-b border-border bg-white flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Conversations</h1>
            <p className="text-sm text-muted-foreground">Monitor all guest–host communications</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="btn-outline flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                activeFilter === tab.key
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span
                  className={cn(
                    "text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center",
                    activeFilter === tab.key ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guest, host, or listing…"
            className="input-base pl-9 text-sm w-full max-w-md"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Main content (table + panel) ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Table */}
        <div className={cn("flex-1 overflow-y-auto", selectedConv && "border-r border-border")}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <Filter className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="font-semibold text-sm text-foreground mb-1">No conversations found</p>
              <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white border-b border-border z-10">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Guest</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Host</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Listing</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Last message</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((conv) => {
                  const isSelected = conv.id === selectedId;
                  const isEsc = conv.escalationLevel === "escalated";
                  const isFlag = conv.escalationLevel === "flagged";
                  const preview = conv.lastMessage
                    ? (conv.lastMessage.content.length > 55
                        ? conv.lastMessage.content.slice(0, 55) + "…"
                        : conv.lastMessage.content)
                    : "—";

                  return (
                    <tr
                      key={conv.id}
                      onClick={() => setSelectedId(isSelected ? null : conv.id)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isSelected ? "bg-primary/5" : "hover:bg-muted/40",
                        isEsc && !isSelected && "bg-red-50/70",
                        isFlag && !isSelected && "bg-yellow-50/50"
                      )}
                    >
                      {/* Guest */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {getGuestName(conv)[0]}
                          </div>
                          <span className="font-medium text-foreground">{getGuestName(conv)}</span>
                        </div>
                      </td>

                      {/* Host */}
                      <td className="px-4 py-3.5 text-muted-foreground">{getHostName(conv)}</td>

                      {/* Listing */}
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-medium text-foreground text-xs">{conv.listing.title}</p>
                          <p className="text-[11px] text-muted-foreground">{conv.listing.city}</p>
                        </div>
                      </td>

                      {/* Last message */}
                      <td className="px-4 py-3.5 text-muted-foreground text-xs max-w-[220px]">
                        <div className="flex items-start gap-1.5">
                          {(isEsc || isFlag) && (
                            <AlertTriangle
                              className={cn("w-3.5 h-3.5 flex-shrink-0 mt-0.5", isEsc ? "text-red-500" : "text-yellow-500")}
                            />
                          )}
                          <span className={cn(conv.unreadCount > 0 && "font-semibold text-foreground")}>
                            {preview}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={cn(ESCALATION_BADGE[conv.escalationLevel], "capitalize text-[11px]")}>
                          {ESCALATION_LABEL[conv.escalationLevel]}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="px-5 py-3.5 text-right text-xs text-muted-foreground whitespace-nowrap">
                        {conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {selectedConv && (
          <div className="w-[420px] flex-shrink-0 flex flex-col overflow-hidden">
            <DetailPanel
              conv={selectedConv}
              onClose={() => setSelectedId(null)}
              onChangeStatus={changeStatus}
              onResolve={resolveEscalation}
              onJoin={handleJoin}
            />
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
