import type { ActivityEntry } from "@/types/activity";

export interface ActivityState {
  items: ActivityEntry[];
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  error: string | null;
}
