import type { Webhook } from "@/types/webhook";
import { apiFetch } from "./client";

interface ApiWebhook {
  id: number;
  url: string;
  events: string[];
  secret: string;
  lastDeliveryAt: string | null;
  createdAt: string;
}

export interface CreateWebhookInput {
  url: string;
  events: string[];
}

export interface TestWebhookResult {
  success: boolean;
  statusCode: number | null;
  error?: string;
}

function normalizeWebhook(webhook: ApiWebhook): Webhook {
  return {
    id: String(webhook.id),
    url: webhook.url,
    events: webhook.events,
    secret: webhook.secret,
    lastDeliveryAt: webhook.lastDeliveryAt,
    createdAt: webhook.createdAt,
  };
}

export async function listWebhooks(): Promise<Webhook[]> {
  const webhooks = await apiFetch<ApiWebhook[]>("/webhooks", { method: "GET" });
  return webhooks.map(normalizeWebhook);
}

export async function createWebhook(input: CreateWebhookInput): Promise<Webhook> {
  const webhook = await apiFetch<ApiWebhook>("/webhooks", { method: "POST", body: input });
  return normalizeWebhook(webhook);
}

export async function deleteWebhook(id: string): Promise<void> {
  await apiFetch(`/webhooks/${id}`, { method: "DELETE" });
}

export async function testWebhook(id: string): Promise<TestWebhookResult> {
  return apiFetch<TestWebhookResult>(`/webhooks/${id}/test`, { method: "POST" });
}
