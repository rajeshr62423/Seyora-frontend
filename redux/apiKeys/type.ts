import type { ApiKey } from "@/types/apiKey";

export interface ApiKeysState {
  list: ApiKey[];
  loading: boolean;
  error: string | null;

  creating: boolean;
  createError: string | null;
  // The raw key is only ever returned once, on creation — held here so the
  // create modal can display/copy it, cleared when the modal closes.
  createdKey: (ApiKey & { key: string }) | null;
  isCreateModalOpen: boolean;

  revokingIds: string[];
  revokeError: string | null;
}
