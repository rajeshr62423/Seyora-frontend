import type { NotificationCategory, NotificationEntry } from "@/types/notification";
import { apiFetch } from "./client";
import { normalizeUser, type ApiUser } from "./users";

type ApiNotificationCategory = "MENTION" | "ASSIGN" | "COMMENT" | "UPDATE" | "SYSTEM";

interface ApiNotification {
  id: number;
  recipientId: number;
  actorId: number | null;
  actor: ApiUser | null;
  verb: string;
  targetLabel: string;
  category: ApiNotificationCategory;
  unread: boolean;
  createdAt: string;
  targetType: string | null;
  targetRef: string | null;
}

const CATEGORY_MAP: Record<ApiNotificationCategory, NotificationCategory> = {
  MENTION: "mention",
  ASSIGN: "assign",
  COMMENT: "comment",
  UPDATE: "update",
  SYSTEM: "system",
};

function normalizeNotification(notification: ApiNotification): NotificationEntry {
  return {
    id: String(notification.id),
    recipientId: String(notification.recipientId),
    actorId: notification.actorId === null ? null : String(notification.actorId),
    actor: notification.actor ? normalizeUser(notification.actor) : null,
    verb: notification.verb,
    target: notification.targetLabel,
    category: CATEGORY_MAP[notification.category],
    unread: notification.unread,
    createdAt: notification.createdAt,
    targetType: notification.targetType,
    targetRef: notification.targetRef,
  };
}

export async function listNotifications(): Promise<NotificationEntry[]> {
  const notifications = await apiFetch<ApiNotification[]>("/notifications", { method: "GET" });
  return notifications.map(normalizeNotification);
}

export async function markNotificationRead(id: string): Promise<NotificationEntry> {
  const notification = await apiFetch<ApiNotification>(`/notifications/${id}`, { method: "PATCH" });
  return normalizeNotification(notification);
}

export async function markAllNotificationsRead(): Promise<{ updated: number }> {
  return apiFetch<{ updated: number }>("/notifications/read-all", { method: "PATCH" });
}
