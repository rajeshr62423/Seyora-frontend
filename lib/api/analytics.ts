import type { TaskPriority, TaskStatus } from "@/types/task";
import { apiFetch } from "./client";

export type AnalyticsRange = 7 | 30 | 90;

export interface AnalyticsOverview {
  range: AnalyticsRange;
  completionRate: number;
  overdueCount: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByPriority: Record<TaskPriority, number>;
  completionTrend: { date: string; completed: number }[];
}

interface ApiTeamPerformanceRow {
  userId: number;
  name: string;
  initials: string;
  assigned: number;
  completed: number;
  openTasks: number;
  completionRate: number;
}

export interface TeamPerformanceRow {
  userId: string;
  name: string;
  initials: string;
  assigned: number;
  completed: number;
  openTasks: number;
  completionRate: number;
}

export async function getOverview(range: AnalyticsRange): Promise<AnalyticsOverview> {
  return apiFetch<AnalyticsOverview>(`/analytics/overview?range=${range}`, { method: "GET" });
}

export async function getTeamPerformance(): Promise<TeamPerformanceRow[]> {
  const rows = await apiFetch<ApiTeamPerformanceRow[]>("/analytics/team-performance", { method: "GET" });
  return rows.map((row) => ({ ...row, userId: String(row.userId) }));
}
