import { Activity, Bell, Building2, CreditCard, KeyRound, Lock, Plug, ShieldAlert, User, Users } from "lucide-react";

export interface SettingsTabDef {
  slug: string;
  label: string;
  icon: typeof User;
}

export const SETTINGS_TABS: SettingsTabDef[] = [
  { slug: "profile", label: "Profile", icon: User },
  { slug: "account", label: "Account", icon: User },
  { slug: "security", label: "Security", icon: Lock },
  { slug: "notifications", label: "Notifications", icon: Bell },
  { slug: "organization", label: "Organization", icon: Building2 },
  { slug: "members", label: "Members & Roles", icon: Users },
  { slug: "api", label: "API", icon: KeyRound },
  { slug: "webhooks", label: "Webhooks", icon: Plug },
  { slug: "billing", label: "Billing", icon: CreditCard },
  { slug: "audit-logs", label: "Audit Logs", icon: Activity },
  { slug: "danger-zone", label: "Danger Zone", icon: ShieldAlert },
];

export const SETTINGS_SLUGS = SETTINGS_TABS.map((t) => t.slug);

export function isSettingsSlug(slug: string): boolean {
  return SETTINGS_SLUGS.includes(slug);
}
