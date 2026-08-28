// A real, backend-tracked connection (only "github" is a known provider
// today — see seyora-backend's KNOWN_PROVIDERS). Connection-status only,
// no real OAuth token exchange.
export interface Integration {
  provider: string;
  status: "connected" | "disconnected";
  label: string | null;
  connectedAt: string | null;
}

// Purely presentational — integrations the product shows as planned but
// that have no backend endpoint at all yet, so nothing here can be "real".
export interface ComingSoonIntegration {
  id: string;
  name: string;
  description: string;
}
