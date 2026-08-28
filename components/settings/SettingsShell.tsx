"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { useAppSelector } from "@/redux/hooks";
import AccountTab from "./tabs/AccountTab";
import ApiTab from "./tabs/ApiTab";
import AuditLogsTab from "./tabs/AuditLogsTab";
import BillingTab from "./tabs/BillingTab";
import DangerZoneTab from "./tabs/DangerZoneTab";
import MembersTab from "./tabs/MembersTab";
import NotificationsTab from "./tabs/NotificationsTab";
import OrganizationTab from "./tabs/OrganizationTab";
import ProfileTab from "./tabs/ProfileTab";
import SecurityTab from "./tabs/SecurityTab";
import WebhooksTab from "./tabs/WebhooksTab";
import { isSettingsSlug, SETTINGS_TABS } from "./settingsTabs";

const TAB_CONTENT: Record<string, ComponentType> = {
  profile: ProfileTab,
  account: AccountTab,
  security: SecurityTab,
  notifications: NotificationsTab,
  organization: OrganizationTab,
  members: MembersTab,
  api: ApiTab,
  webhooks: WebhooksTab,
  billing: BillingTab,
  "audit-logs": AuditLogsTab,
  "danger-zone": DangerZoneTab,
};

export default function SettingsShell({ activeTab }: { activeTab: string }) {
  const { myPermissions, current } = useAppSelector((state) => state.organization);
  // Before the organization fetch resolves, myPermissions is empty for
  // every role (including a real owner) — enforcing the gate against that
  // transient empty state would 404 an owner on a hard refresh. Wait for
  // `current` (populated by the same fetch) before treating "missing
  // permission" as real.
  const permissionsLoaded = current !== null;
  const visibleTabs = SETTINGS_TABS.filter(
    (tab) => !tab.permission || !permissionsLoaded || myPermissions.includes(tab.permission),
  );

  if (!isSettingsSlug(activeTab)) notFound();
  // Blocks direct navigation to a gated tab's URL, not just hiding it from
  // the nav list above — a Member typing /settings/danger-zone shouldn't
  // see it just because the link itself is hidden.
  const activeTabDef = SETTINGS_TABS.find((tab) => tab.slug === activeTab);
  if (
    activeTabDef?.permission &&
    permissionsLoaded &&
    !myPermissions.includes(activeTabDef.permission)
  ) {
    notFound();
  }

  const Content = TAB_CONTENT[activeTab];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <div className="page-sub">Manage your account, organization and developer settings.</div>
        </div>
      </div>
      <div className="settings">
        <nav className="settings-nav">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.slug}
                href={`/settings/${tab.slug}`}
                className={`settings-link ${activeTab === tab.slug ? "active" : ""}`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="settings-panel">
          <Content />
        </div>
      </div>
    </div>
  );
}
