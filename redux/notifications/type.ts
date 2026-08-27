import type { NotificationEntry } from "@/types/notification";

export interface NotificationsState {
  list: NotificationEntry[];
  loading: boolean;
  error: string | null;
  markingReadIds: string[];
  markingAllRead: boolean;
}
