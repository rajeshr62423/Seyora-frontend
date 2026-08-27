import type { ActivityEntry } from "@/types/activity";
import { apiFetch } from "./client";
import { normalizeUser, type ApiUser } from "./users";

interface ApiActivityEntry {
  id: number;
  organizationId: number;
  actorId: number;
  actor: ApiUser;
  action: string;
  targetType: string;
  targetId: number;
  targetLabel: string;
  createdAt: string;
}

interface ApiActivityPage {
  items: ApiActivityEntry[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ListActivityParams {
  actorId?: number;
  targetType?: string;
  targetId?: number;
  page?: number;
  pageSize?: number;
}

export interface ActivityPage {
  items: ActivityEntry[];
  page: number;
  pageSize: number;
  total: number;
}

function normalizeActivityEntry(entry: ApiActivityEntry): ActivityEntry {
  return {
    id: String(entry.id),
    organizationId: String(entry.organizationId),
    actorId: String(entry.actorId),
    actor: normalizeUser(entry.actor),
    action: entry.action,
    targetType: entry.targetType,
    targetId: String(entry.targetId),
    target: entry.targetLabel,
    createdAt: entry.createdAt,
  };
}

export async function listActivity(params: ListActivityParams = {}): Promise<ActivityPage> {
  const query = new URLSearchParams();
  if (params.actorId !== undefined) query.set("actorId", String(params.actorId));
  if (params.targetType !== undefined) query.set("targetType", params.targetType);
  if (params.targetId !== undefined) query.set("targetId", String(params.targetId));
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
  const qs = query.toString();

  const result = await apiFetch<ApiActivityPage>(`/activity${qs ? `?${qs}` : ""}`, { method: "GET" });
  return {
    items: result.items.map(normalizeActivityEntry),
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
  };
}
