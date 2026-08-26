import type { ActivityEntry } from "@/types/activity";

export default function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.id} className="activity">
          <span className="avatar">{entry.actorInitials}</span>
          <div className="activity-text">
            <strong>{entry.actorName}</strong> {entry.action} <span className="muted">· {entry.target}</span>
            <div className="activity-time">{entry.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
