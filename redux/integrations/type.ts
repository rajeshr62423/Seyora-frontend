import type { Integration } from "@/types/integration";

export interface IntegrationsState {
  list: Integration[];
  loading: boolean;
  error: string | null;

  connectingProviders: string[];
  connectError: string | null;

  disconnectingProviders: string[];
  disconnectError: string | null;
}
