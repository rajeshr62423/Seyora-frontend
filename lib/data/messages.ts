import type { ChatChannel, ChatMessage } from "@/types/message";

export const channels: ChatChannel[] = [
  { id: "engineering", name: "engineering", memberCount: 18, unread: 8 },
  { id: "product", name: "product", memberCount: 12, unread: 4 },
  { id: "design", name: "design", memberCount: 9, unread: 2 },
  { id: "random", name: "random", memberCount: 26, unread: 0 },
];

export const initialMessages: ChatMessage[] = [
  { id: "m1", authorName: "John Anderson", authorInitials: "JA", text: "The new analytics endpoint is ready for review.", time: "1h ago" },
  { id: "m2", authorName: "Sarah Wilson", authorInitials: "SW", text: "I pushed the mobile navigation fix.", time: "2h ago" },
  { id: "m3", authorName: "Mike Chen", authorInitials: "MC", text: "Can we align on the release checklist?", time: "3h ago" },
  { id: "m4", authorName: "Alex Morgan", authorInitials: "AM", text: "QA is green for the payment flow.", time: "4h ago" },
];
