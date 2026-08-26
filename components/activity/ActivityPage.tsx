"use client";

import { Filter } from "lucide-react";
import ActivityFeed from "@/components/activity/ActivityFeed";
import { useMessage } from "@/lib/hooks/use-message";
import { workspaceActivity } from "@/lib/data/activity";

export default function ActivityPage() {
  const message = useMessage();

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
            <button type="button" className="btn" onClick={() => message.info("Filters are not part of this demo.")}>
              <Filter size={14} /> Filters
            </button>
            <button type="button" className="btn" onClick={() => message.success("Export started")}>
              Export
            </button>
          </div>
        </div>
        <div className="panel-body">
          <ActivityFeed entries={workspaceActivity} />
        </div>
      </div>
    </div>
  );
}
