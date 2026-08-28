"use client";

import { Select } from "antd";
import { Filter } from "lucide-react";
import { useMemo, useState } from "react";
import ActivityFeed from "@/components/activity/ActivityFeed";
import { useMessage } from "@/lib/hooks/use-message";
import { fetchMoreActivityRequest } from "@/redux/activity/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function ActivityPage() {
  const dispatch = useAppDispatch();
  const message = useMessage();
  const { items, loading, loadingMore, total } = useAppSelector((state) => state.activity);
  const members = useAppSelector((state) => state.organization.members);
  const [actorId, setActorId] = useState<string | null>(null);
  const hasMore = items.length < total;

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
              options={members.map((m) => ({ value: m.user.id, label: m.user.name }))}
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
        {hasMore ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 4px" }}>
            <button
              type="button"
              className="btn"
              disabled={loadingMore}
              onClick={() => dispatch(fetchMoreActivityRequest())}
            >
              {loadingMore ? "Loading…" : "Load more"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
