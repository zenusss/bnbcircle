import React, { useState } from "react";
import { Search, MessageSquare, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConversationList } from "@/features/messaging/components/ConversationList";
import { ChatWindow } from "@/features/messaging/components/ChatWindow";
import { useConversations } from "@/features/messaging/hooks/useMessaging";

// Demo current user (host)
const CURRENT_USER = {
  id: "host-1",
  name: "Sarah Visser",
  role: "host" as const,
};

export default function HostMessages() {
  const { conversations, activeId, selectConversation, escalate, resolveEscalation, totalUnread, escalatedCount } = useConversations("host");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "escalated">("all");

  const activeConversation = conversations.find((c) => c.id === activeId);

  const filtered = conversations.filter((c) => {
    const matchesSearch =
      search === "" ||
      c.listing.title.toLowerCase().includes(search.toLowerCase()) ||
      c.participants.some((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && c.unreadCount > 0) ||
      (filter === "escalated" && c.escalationLevel === "escalated");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-[calc(100vh-80px)] -m-4 md:-m-8 overflow-hidden">
      {/* ── Sidebar ── */}
      <div className={cn(
        "flex flex-col bg-white border-r border-border",
        activeId ? "hidden md:flex w-80 flex-shrink-0" : "flex w-full md:w-80 md:flex-shrink-0"
      )}>
        {/* Header */}
        <div className="px-4 py-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-primary">Messages</h1>
            <div className="flex items-center gap-2">
              {escalatedCount > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-bold">
                  <AlertTriangle className="w-3 h-3" /> {escalatedCount}
                </span>
              )}
              {totalUnread > 0 && (
                <span className="badge-accent">{totalUnread} new</span>
              )}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="input-base pl-9 text-sm py-2"
            />
          </div>

          <div className="flex gap-1">
            {(["all", "unread", "escalated"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all",
                  filter === f
                    ? f === "escalated" ? "bg-red-50 text-red-700" : "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <ConversationList
          conversations={filtered}
          activeId={activeId}
          onSelect={selectConversation}
          currentUserId={CURRENT_USER.id}
        />
      </div>

      {/* ── Chat ── */}
      <div className={cn("flex-1 flex flex-col", !activeId && "hidden md:flex")}>
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            currentUserId={CURRENT_USER.id}
            currentUserName={CURRENT_USER.name}
            currentUserRole={CURRENT_USER.role}
            onEscalate={escalate}
            onResolve={resolveEscalation}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-5">
              <MessageSquare className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">Select a conversation</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Conversations with your guests appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
