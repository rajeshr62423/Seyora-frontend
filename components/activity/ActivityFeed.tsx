import { formatRelativeTime } from "@/lib/format";
import type { ActivityEntry } from "@/types/activity";

export default function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="empty">
        <strong>No activity yet</strong>
      </div>
    );
  }

  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.id} className="activity">
          <span className="avatar">{entry.actor.initials}</span>
          <div className="activity-text">
            <strong>{entry.actor.name}</strong> {entry.action} <span className="muted">· {entry.target}</span>
            <div className="activity-time">{formatRelativeTime(entry.createdAt)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
