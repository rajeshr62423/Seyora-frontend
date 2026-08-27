import type { User } from "./user";

export type NotificationCategory = "mention" | "assign" | "comment" | "update" | "system";

export interface NotificationEntry {
  id: string;
  recipientId: string;
  actorId: string | null;
  actor: User | null;
  verb: string;
  target: string;
  category: NotificationCategory;
  unread: boolean;
  createdAt: string; // full ISO timestamp — see lib/format.ts#formatRelativeTime
}
