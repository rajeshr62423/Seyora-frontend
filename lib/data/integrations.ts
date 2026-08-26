import type { Integration } from "@/types/integration";

export const integrations: Integration[] = [
  { id: "github", name: "GitHub", description: "Source control, pull requests and deployments", connected: true, href: "/github" },
  { id: "gitlab", name: "GitLab", description: "Repositories and merge requests", connected: false },
  { id: "slack", name: "Slack", description: "Team notifications and alerts", connected: true },
  { id: "google-calendar", name: "Google Calendar", description: "Sync project deadlines", connected: false },
  { id: "email", name: "Email", description: "Transactional notifications", connected: true },
  { id: "webhooks", name: "Webhooks", description: "Custom event delivery", connected: true },
];
