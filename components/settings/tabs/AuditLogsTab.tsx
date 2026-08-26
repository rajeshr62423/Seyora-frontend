import ActivityFeed from "@/components/activity/ActivityFeed";
import { workspaceActivity } from "@/lib/data/activity";

export default function AuditLogsTab() {
  return (
    <div className="settings-content-card">
      <h2>Audit logs</h2>
      <p className="settings-desc">Review security-sensitive workspace changes.</p>
      <ActivityFeed entries={workspaceActivity} />
    </div>
  );
}
