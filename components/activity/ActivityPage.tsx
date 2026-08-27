"use client";

import { Select } from "antd";
import { Filter } from "lucide-react";
import { useMemo, useState } from "react";
import ActivityFeed from "@/components/activity/ActivityFeed";
import { useMessage } from "@/lib/hooks/use-message";
import { useAppSelector } from "@/redux/hooks";

export default function ActivityPage() {
  const message = useMessage();
  const { items, loading } = useAppSelector((state) => state.activity);
  const users = useAppSelector((state) => state.users.list);
  const [actorId, setActorId] = useState<string | null>(null);

  // Client-side only — never re-fetches into (or otherwise mutates)
  // state.activity.items, which ProjectActivityPage/AuditLogsTab/
  // DashboardPage all assume holds the full, unfiltered feed.
  const filtered = useMemo(
    () => (actorId ? items.filter((entry) => entry.actorId === actorId) : items),
    [items, actorId],
  );

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Activity</h1>
          <div className="page-sub">A live audit trail of everything happening across your workspace.</div>
        </div>
      </div>
      <div className="card">
        <div className="panel-head">
          <span className="card-title">Activity &amp; audit log</span>
          <div className="actions">
            <Select
              allowClear
              placeholder={
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Filter size={14} /> Filter by actor
                </span>
              }
              style={{ width: 180 }}
              value={actorId ?? undefined}
              onChange={(value) => setActorId(value ?? null)}
              options={users.map((u) => ({ value: u.id, label: u.name }))}
            />
            <button type="button" className="btn" onClick={() => message.success("Export started")}>
              Export
            </button>
          </div>
        </div>
        <div className="panel-body">
          {loading && items.length === 0 ? (
            <div className="empty">
              <strong>Loading activity…</strong>
            </div>
          ) : (
            <ActivityFeed entries={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}
