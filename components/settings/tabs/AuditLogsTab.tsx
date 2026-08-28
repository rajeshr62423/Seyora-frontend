"use client";

import ActivityFeed from "@/components/activity/ActivityFeed";
import { fetchMoreActivityRequest } from "@/redux/activity/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function AuditLogsTab() {
  const dispatch = useAppDispatch();
  const { items, loadingMore, total } = useAppSelector((state) => state.activity);
  const hasMore = items.length < total;

  return (
    <div className="settings-content-card">
      <h2>Audit logs</h2>
      <p className="settings-desc">Review security-sensitive workspace changes.</p>
      <ActivityFeed entries={items} />
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
  );
}
