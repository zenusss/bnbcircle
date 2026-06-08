import { useState, useCallback, useRef } from "react";
import type { Conversation, Message, ConversationStatus, EscalationLevel } from "../types";

// ─── Demo data ─────────────────────────────────────────────────────────────────

const now = Date.now();
const d = (offsetMs: number) => new Date(now - offsetMs).toISOString();

export const DEMO_CONVERSATIONS: Conversation[] = [
  // Conv 1: Guest Emma <-> Host Sarah, Canal House Amsterdam, 2 unread
  {
    id: "conv-1",
    listing: {
      id: "listing-1",
      title: "Canal House Amsterdam",
      city: "Amsterdam",
      imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=120&h=80&fit=crop",
    },
    participants: [
      { id: "guest-1", name: "Emma van den Berg", role: "guest", isOnline: true },
      { id: "host-sarah", name: "Sarah Visser", role: "host", isOnline: false },
    ],
    lastMessage: {
      id: "m1-5",
      conversationId: "conv-1",
      sender: { id: "guest-1", name: "Emma van den Berg", role: "guest" },
      type: "text",
      content: "Do you have a parking spot nearby? We're bringing a car.",
      status: "delivered",
      isEscalated: false,
      createdAt: d(12 * 60000),
    },
    unreadCount: 2,
    status: "active",
    escalationLevel: "none",
    createdAt: d(2 * 86400000),
    updatedAt: d(12 * 60000),
  },

  // Conv 2: Guest Mark <-> Host Jan, Zeeland Villa, escalated, 1 unread
  {
    id: "conv-2",
    listing: {
      id: "listing-2",
      title: "Zeeland Beach Villa",
      city: "Middelburg",
      imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=120&h=80&fit=crop",
    },
    participants: [
      { id: "guest-mark", name: "Mark Johnson", role: "guest", isOnline: false },
      { id: "host-jan", name: "Jan de Boer", role: "host", isOnline: true },
    ],
    lastMessage: {
      id: "m2-3",
      conversationId: "conv-2",
      sender: { id: "guest-mark", name: "Mark Johnson", role: "guest" },
      type: "text",
      content: "The heating is broken and it's freezing. This is unacceptable!",
      status: "sent",
      isEscalated: true,
      createdAt: d(22 * 60000),
    },
    unreadCount: 1,
    status: "escalated",
    escalationLevel: "escalated",
    escalationReason: "Heating broken — guest reported after 3 hours with no fix",
    escalatedAt: d(20 * 60000),
    createdAt: d(4 * 86400000),
    updatedAt: d(22 * 60000),
  },

  // Conv 3: Guest Lisa <-> Host Sarah, Rotterdam Loft, all read
  {
    id: "conv-3",
    listing: {
      id: "listing-3",
      title: "Rotterdam Loft",
      city: "Rotterdam",
      imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=120&h=80&fit=crop",
    },
    participants: [
      { id: "guest-lisa", name: "Lisa Müller", role: "guest", isOnline: true },
      { id: "host-sarah", name: "Sarah Visser", role: "host", isOnline: false },
    ],
    lastMessage: {
      id: "m3-2",
      conversationId: "conv-3",
      sender: { id: "host-sarah", name: "Sarah Visser", role: "host" },
      type: "text",
      content: "Check-in is at 15:00. I'll send the key code tomorrow morning.",
      status: "read",
      isEscalated: false,
      createdAt: d(3 * 3600000),
    },
    unreadCount: 0,
    status: "active",
    escalationLevel: "none",
    createdAt: d(3 * 86400000),
    updatedAt: d(3 * 3600000),
  },

  // Conv 4: Guest Tom <-> Host Jan, Utrecht House, pending / needs_attention
  {
    id: "conv-4",
    listing: {
      id: "listing-4",
      title: "Utrecht Historic House",
      city: "Utrecht",
      imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=120&h=80&fit=crop",
    },
    participants: [
      { id: "guest-tom", name: "Tom Bakker", role: "guest", isOnline: false },
      { id: "host-jan", name: "Jan de Boer", role: "host", isOnline: true },
    ],
    lastMessage: {
      id: "m4-1",
      conversationId: "conv-4",
      sender: { id: "guest-tom", name: "Tom Bakker", role: "guest" },
      type: "booking_request",
      content: "Booking request submitted — 10 Aug to 14 Aug, 4 guests, €680 total",
      status: "delivered",
      isEscalated: false,
      meta: { checkIn: "2026-08-10", checkOut: "2026-08-14", guests: 4, totalPrice: 680 },
      createdAt: d(45 * 60000),
    },
    unreadCount: 0,
    status: "needs_attention",
    escalationLevel: "none",
    requestId: "req-4",
    createdAt: d(45 * 60000),
    updatedAt: d(45 * 60000),
  },
];

const DEMO_MESSAGES: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "m1-1",
      conversationId: "conv-1",
      sender: { id: "guest-1", name: "Emma van den Berg", role: "guest" },
      type: "text",
      content: "Hi Sarah! I'd love to book your canal house for June 20–24. Is it available?",
      status: "read",
      isEscalated: false,
      createdAt: d(2 * 86400000),
    },
    {
      id: "m1-2",
      conversationId: "conv-1",
      sender: { id: "host-sarah", name: "Sarah Visser", role: "host" },
      type: "text",
      content: "Hello Emma! Yes, those dates are free 😊 I'll confirm your booking request right away.",
      status: "read",
      isEscalated: false,
      createdAt: d(2 * 86400000 - 3600000),
    },
    {
      id: "m1-sys",
      conversationId: "conv-1",
      sender: { id: "system", name: "Bnb Circle", role: "system" },
      type: "booking_confirmed",
      content: "Booking confirmed — 20 Jun to 24 Jun 2026, 2 guests, €797 total",
      status: "delivered",
      isEscalated: false,
      meta: { checkIn: "2026-06-20", checkOut: "2026-06-24", guests: 2, totalPrice: 797 },
      createdAt: d(2 * 86400000 - 3550000),
    },
    {
      id: "m1-4",
      conversationId: "conv-1",
      sender: { id: "guest-1", name: "Emma van den Berg", role: "guest" },
      type: "text",
      content: "That's wonderful, thank you so much! Really looking forward to our stay. 🎉",
      status: "read",
      isEscalated: false,
      createdAt: d(86400000),
    },
    {
      id: "m1-5",
      conversationId: "conv-1",
      sender: { id: "guest-1", name: "Emma van den Berg", role: "guest" },
      type: "text",
      content: "Do you have a parking spot nearby? We're bringing a car.",
      status: "delivered",
      isEscalated: false,
      createdAt: d(12 * 60000),
    },
  ],

  "conv-2": [
    {
      id: "m2-1",
      conversationId: "conv-2",
      sender: { id: "guest-mark", name: "Mark Johnson", role: "guest" },
      type: "text",
      content: "Hi Jan, we've just arrived but the heating system doesn't seem to be working.",
      status: "read",
      isEscalated: false,
      createdAt: d(4 * 3600000),
    },
    {
      id: "m2-2",
      conversationId: "conv-2",
      sender: { id: "host-jan", name: "Jan de Boer", role: "host" },
      type: "text",
      content: "I'm really sorry to hear that! Let me contact a technician immediately.",
      status: "read",
      isEscalated: false,
      createdAt: d(3.5 * 3600000),
    },
    {
      id: "m2-3",
      conversationId: "conv-2",
      sender: { id: "guest-mark", name: "Mark Johnson", role: "guest" },
      type: "text",
      content: "The heating is broken and it's freezing. This is unacceptable!",
      status: "sent",
      isEscalated: true,
      createdAt: d(22 * 60000),
    },
    {
      id: "m2-sys",
      conversationId: "conv-2",
      sender: { id: "system", name: "Bnb Circle", role: "system" },
      type: "system",
      content: "This conversation has been escalated for admin review",
      status: "delivered",
      isEscalated: true,
      createdAt: d(20 * 60000),
    },
  ],

  "conv-3": [
    {
      id: "m3-1",
      conversationId: "conv-3",
      sender: { id: "guest-lisa", name: "Lisa Müller", role: "guest" },
      type: "text",
      content: "Hello Sarah! We're very excited about our stay next week. Any tips for the neighbourhood?",
      status: "read",
      isEscalated: false,
      createdAt: d(5 * 3600000),
    },
    {
      id: "m3-2",
      conversationId: "conv-3",
      sender: { id: "host-sarah", name: "Sarah Visser", role: "host" },
      type: "text",
      content: "Check-in is at 15:00. I'll send the key code tomorrow morning.",
      status: "read",
      isEscalated: false,
      createdAt: d(3 * 3600000),
    },
  ],

  "conv-4": [
    {
      id: "m4-1",
      conversationId: "conv-4",
      sender: { id: "guest-tom", name: "Tom Bakker", role: "guest" },
      type: "booking_request",
      content: "Booking request submitted — 10 Aug to 14 Aug, 4 guests, €680 total",
      status: "delivered",
      isEscalated: false,
      meta: { checkIn: "2026-08-10", checkOut: "2026-08-14", guests: 4, totalPrice: 680 },
      createdAt: d(45 * 60000),
    },
  ],
};

// ─── useMessages Hook ─────────────────────────────────────────────────────────

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>(() =>
    conversationId ? (DEMO_MESSAGES[conversationId] ?? []) : []
  );
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const lastConvId = useRef<string | null>(null);

  // Switch conversation when id changes
  if (conversationId !== lastConvId.current) {
    lastConvId.current = conversationId;
    if (conversationId) {
      setMessages(DEMO_MESSAGES[conversationId] ?? []);
    } else {
      setMessages([]);
    }
  }

  const sendMessage = useCallback(
    async (
      content: string,
      currentUserId: string,
      currentUserName: string,
      currentUserRole: "guest" | "host" | "admin"
    ) => {
      if (!conversationId || !content.trim()) return;
      setIsSending(true);

      const optimistic: Message = {
        id: `msg-${Date.now()}`,
        conversationId,
        sender: { id: currentUserId, name: currentUserName, role: currentUserRole },
        type: "text",
        content: content.trim(),
        status: "sending",
        isEscalated: false,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimistic]);

      // Simulate network delay → sent
      await new Promise((r) => setTimeout(r, 600));
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? { ...m, status: "sent" as const } : m))
      );
      setIsSending(false);

      // Show typing indicator for demo reply
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 1200));
      setIsTyping(false);

      // Mark sent message as read after typing stops
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? { ...m, status: "read" as const, readAt: new Date().toISOString() } : m))
      );
    },
    [conversationId]
  );

  return { messages, isSending, isTyping, sendMessage };
}

// ─── useConversations Hook ────────────────────────────────────────────────────

export function useConversations(_filterRole?: "guest" | "host" | "admin") {
  const [conversations, setConversations] = useState<Conversation[]>(DEMO_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(null);

  const markRead = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  /** Cycle escalation: none → needs_attention → escalated → none */
  const cycleEscalation = useCallback((id: string, reason?: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (c.escalationLevel === "none") {
          return {
            ...c,
            escalationLevel: "flagged" as EscalationLevel,
            status: "needs_attention" as ConversationStatus,
            escalationReason: reason ?? "Flagged for attention",
            escalatedAt: new Date().toISOString(),
          };
        }
        if (c.escalationLevel === "flagged") {
          return {
            ...c,
            escalationLevel: "escalated" as EscalationLevel,
            status: "escalated" as ConversationStatus,
            escalationReason: reason ?? c.escalationReason ?? "Escalated",
            escalatedAt: new Date().toISOString(),
          };
        }
        // already escalated → reset
        return {
          ...c,
          escalationLevel: "none" as EscalationLevel,
          status: "active" as ConversationStatus,
          escalationReason: undefined,
        };
      })
    );
  }, []);

  const escalate = useCallback((id: string, reason: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "escalated" as ConversationStatus,
              escalationLevel: "escalated" as EscalationLevel,
              escalationReason: reason,
              escalatedAt: new Date().toISOString(),
            }
          : c
      )
    );
  }, []);

  const resolveEscalation = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "active" as ConversationStatus,
              escalationLevel: "resolved" as EscalationLevel,
              resolvedAt: new Date().toISOString(),
            }
          : c
      )
    );
  }, []);

  const changeStatus = useCallback((id: string, status: ConversationStatus) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  }, []);

  const selectConversation = useCallback(
    (id: string) => {
      setActiveId(id);
      markRead(id);
    },
    [markRead]
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const escalatedCount = conversations.filter((c) => c.escalationLevel === "escalated").length;

  return {
    conversations,
    activeId,
    selectConversation,
    markRead,
    escalate,
    cycleEscalation,
    resolveEscalation,
    changeStatus,
    totalUnread,
    escalatedCount,
  };
}
