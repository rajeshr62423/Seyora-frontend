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
  // Optional deep link — e.g. targetType: "task", targetRef: the task's
  // code ("DEV-42"), ready to drop straight into `/tasks/${targetRef}`.
  // Null on notifications with nothing to link to (e.g. system).
  targetType: string | null;
  targetRef: string | null;
}
