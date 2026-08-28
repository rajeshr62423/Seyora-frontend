import type { ComingSoonIntegration } from "@/types/integration";

// Purely presentational — none of these have a backend endpoint yet
// (only "github" does, see lib/api/integrations.ts). Shown as non-
// interactive "coming soon" cards rather than pretending to connect.
export const comingSoonIntegrations: ComingSoonIntegration[] = [
  { id: "gitlab", name: "GitLab", description: "Repositories and merge requests" },
  { id: "slack", name: "Slack", description: "Team notifications and alerts" },
  { id: "google-calendar", name: "Google Calendar", description: "Sync project deadlines" },
  { id: "email", name: "Email", description: "Transactional notifications" },
];
