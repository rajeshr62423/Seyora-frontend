export type NotificationCategory = "mention" | "assign" | "comment" | "update" | "system";

export interface NotificationEntry {
  id: string;
  actorName: string;
  actorInitials: string;
  verb: string;
  target: string;
  time: string;
  category: NotificationCategory;
  unread: boolean;
}
