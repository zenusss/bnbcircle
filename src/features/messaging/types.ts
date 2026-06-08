// ─── Messaging Feature Types ──────────────────────────────────────────────────

export type MessageType = "text" | "system" | "booking_request" | "booking_confirmed" | "booking_declined";

export type EscalationLevel = "none" | "flagged" | "escalated" | "resolved";

export type ConversationStatus = "active" | "needs_attention" | "escalated" | "resolved" | "closed";

export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export interface MessageSender {
  id: string;
  name: string;
  avatar?: string;
  role: "guest" | "host" | "admin" | "system";
}

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  type: MessageType;
  content: string;
  /** Optional metadata for system/booking messages */
  meta?: {
    bookingId?: string;
    listingId?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    totalPrice?: number;
    action?: string;
  };
  status: MessageStatus;
  isEscalated: boolean;
  createdAt: string;
  readAt?: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: "guest" | "host" | "admin";
  isOnline?: boolean;
}

export interface ConversationListing {
  id: string;
  title: string;
  city: string;
  imageUrl: string;
}

export interface Conversation {
  id: string;
  listing: ConversationListing;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  status: ConversationStatus;
  escalationLevel: EscalationLevel;
  escalationReason?: string;
  escalatedAt?: string;
  resolvedAt?: string;
  /** Optional linked booking/request */
  bookingId?: string;
  requestId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  type?: MessageType;
  meta?: Message["meta"];
}

export interface EscalatePayload {
  conversationId: string;
  reason: string;
  level: EscalationLevel;
}
