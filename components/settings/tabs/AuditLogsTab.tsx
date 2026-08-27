"use client";

import ActivityFeed from "@/components/activity/ActivityFeed";
import { useAppSelector } from "@/redux/hooks";

export default function AuditLogsTab() {
  const items = useAppSelector((state) => state.activity.items);

  return (
    <div className="settings-content-card">
      <h2>Audit logs</h2>
      <p className="settings-desc">Review security-sensitive workspace changes.</p>
      <ActivityFeed entries={items} />
    </div>
  );
}
