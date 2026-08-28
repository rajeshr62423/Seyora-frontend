import type { ActivityEntry } from "@/types/activity";

export interface ActivityState {
  items: ActivityEntry[];
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  error: string | null;
  loadingMore: boolean;
  loadMoreError: string | null;

  taskActivityItems: ActivityEntry[];
  taskActivityTaskId: string | null;
  taskActivityLoading: boolean;
  taskActivityError: string | null;
}
