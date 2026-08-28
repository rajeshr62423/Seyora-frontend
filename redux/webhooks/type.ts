import type { TestWebhookResult } from "@/lib/api/webhooks";
import type { Webhook } from "@/types/webhook";

export interface WebhooksState {
  list: Webhook[];
  loading: boolean;
  error: string | null;

  creating: boolean;
  createError: string | null;
  isCreateModalOpen: boolean;

  deletingIds: string[];
  deleteError: string | null;

  testingIds: string[];
  testResults: Record<string, TestWebhookResult>;
}
