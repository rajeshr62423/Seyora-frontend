import type { ApiKey } from "@/types/apiKey";
import { apiFetch } from "./client";

interface ApiApiKey {
  id: number;
  name: string;
  preview: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

interface ApiApiKeyCreated extends ApiApiKey {
  key: string;
}

function normalizeApiKey(key: ApiApiKey): ApiKey {
  return {
    id: String(key.id),
    name: key.name,
    preview: key.preview,
    lastUsedAt: key.lastUsedAt,
    revokedAt: key.revokedAt,
    createdAt: key.createdAt,
  };
}

export async function listApiKeys(): Promise<ApiKey[]> {
  const keys = await apiFetch<ApiApiKey[]>("/api-keys", { method: "GET" });
  return keys.map(normalizeApiKey);
}

export async function createApiKey(name: string): Promise<ApiKey & { key: string }> {
  const created = await apiFetch<ApiApiKeyCreated>("/api-keys", { method: "POST", body: { name } });
  return { ...normalizeApiKey(created), key: created.key };
}

export async function revokeApiKey(id: string): Promise<ApiKey> {
  const key = await apiFetch<ApiApiKey>(`/api-keys/${id}`, { method: "DELETE" });
  return normalizeApiKey(key);
}
