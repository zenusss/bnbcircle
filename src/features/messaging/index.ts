// ─── Messaging Feature — public exports ──────────────────────────────────────
export { ChatWindow } from "./components/ChatWindow";
export { ConversationList } from "./components/ConversationList";
export { MessageBubble } from "./components/MessageBubble";
export { useMessages, useConversations, DEMO_CONVERSATIONS } from "./hooks/useMessaging";
export type {
  Message,
  Conversation,
  Participant,
  MessageType,
  MessageStatus,
  ConversationStatus,
  EscalationLevel,
  SendMessagePayload,
  EscalatePayload,
} from "./types";
