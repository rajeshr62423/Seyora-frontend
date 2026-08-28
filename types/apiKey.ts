export interface ApiKey {
  id: string;
  name: string;
  preview: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}
