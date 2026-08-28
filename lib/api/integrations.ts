import type { Integration } from "@/types/integration";
import { apiFetch } from "./client";

export async function listIntegrations(): Promise<Integration[]> {
  return apiFetch<Integration[]>("/integrations", { method: "GET" });
}

export async function connectIntegration(provider: string, label?: string): Promise<Integration> {
  return apiFetch<Integration>(`/integrations/${provider}/connect`, {
    method: "POST",
    body: { label },
  });
}

export async function disconnectIntegration(provider: string): Promise<Integration> {
  return apiFetch<Integration>(`/integrations/${provider}`, { method: "DELETE" });
}
