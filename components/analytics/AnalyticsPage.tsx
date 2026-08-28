"use client";

import { useEffect, useMemo } from "react";
import Avatar from "@/components/common/Avatar";
import BarChart from "@/components/charts/BarChart";
import Donut from "@/components/charts/Donut";
import type { AnalyticsRange } from "@/lib/api/analytics";
import { fetchOverviewRequest, fetchTeamPerformanceRequest } from "@/redux/analytics/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { TaskStatus } from "@/types/task";

const RANGES: { label: string; value: AnalyticsRange }[] = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

const STATUS_COLOR: Record<TaskStatus, string> = {
  DONE: "#4ADE80",
  IN_REVIEW: "#A7F3D0",
  IN_PROGRESS: "#2DD4BF",
  TODO: "#94A3B8",
  BACKLOG: "#64748B",
};
const STATUS_LABEL: Record<TaskStatus, string> = {
  DONE: "Done",
  IN_REVIEW: "In Review",
  IN_PROGRESS: "In Progress",
  TODO: "Todo",
  BACKLOG: "Backlog",
};

export default function AnalyticsPage() {
  const dispatch = useAppDispatch();
  const { overview, range, overviewLoading, teamPerformance, teamPerformanceLoading } = useAppSelector(
    (state) => state.analytics,
  );

  useEffect(() => {
    dispatch(fetchOverviewRequest(30));
    dispatch(fetchTeamPerformanceRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalTasks = overview ? Object.values(overview.tasksByStatus).reduce((s, n) => s + n, 0) : 0;

  const kpis = [
    { label: "Completion rate", value: overview ? `${overview.completionRate}%` : "—" },
    { label: "Total tasks", value: overview ? String(totalTasks) : "—" },
    { label: "Completed", value: overview ? String(overview.tasksByStatus.DONE) : "—" },
    { label: "Overdue tasks", value: overview ? String(overview.overdueCount) : "—" },
  ];

  const trendData = useMemo(
    () => overview?.completionTrend.map((point) => ({ label: point.date.slice(5), value: point.completed })) ?? [],
    [overview],
  );

  const statusSegments = useMemo(
    () =>
      overview
        ? (Object.keys(overview.tasksByStatus) as TaskStatus[]).map((status) => ({
            label: STATUS_LABEL[status],
            value: overview.tasksByStatus[status],
            color: STATUS_COLOR[status],
          }))
        : [],
    [overview],
  );

  const maxOpenTasks = Math.max(1, ...teamPerformance.map((m) => m.openTasks));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Analytics</h1>
          <div className="page-sub">Engineering delivery and team performance insights.</div>
        </div>
        <div className="actions">
          {RANGES.map((r) => (
            <button
              key={r.value}
              type="button"
              className={`btn ${range === r.value ? "primary" : ""}`}
              onClick={() => dispatch(fetchOverviewRequest(r.value))}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid g4">
        {kpis.map((k) => (
          <div key={k.label} className="card kpi">
            <span className="kpi-label">{k.label}</span>
            <div className="kpi-value">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid g2" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Task completion trend</span>
          </div>
          <div className="panel-body">
            {overviewLoading && !overview ? (
              <div className="empty">
                <strong>Loading…</strong>
              </div>
            ) : (
              <BarChart data={trendData} />
            )}
          </div>
        </div>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Status distribution</span>
          </div>
          <div className="panel-body">
            {overviewLoading && !overview ? (
              <div className="empty">
                <strong>Loading…</strong>
              </div>
            ) : (
              <Donut centerLabel={String(totalTasks)} segments={statusSegments} />
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="panel-head">
          <span className="card-title">Team performance</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Assigned</th>
                <th>Completed</th>
                <th>Completion rate</th>
                <th>Workload</th>
              </tr>
            </thead>
            <tbody>
              {teamPerformanceLoading && teamPerformance.length === 0 ? (
                <tr>
                  <td colSpan={5}>Loading…</td>
                </tr>
              ) : (
                teamPerformance.map((m) => (
                  <tr key={m.userId}>
                    <td>
                      <span style={{ display: "flex", gap: 7, alignItems: "center" }}>
                        <Avatar url={m.avatarUrl} initials={m.initials} />
                        {m.name}
                      </span>
                    </td>
                    <td>{m.assigned}</td>
                    <td>{m.completed}</td>
                    <td>{m.completionRate}%</td>
                    <td>
                      <div className="progress" style={{ width: 120 }}>
                        <span style={{ width: `${Math.round((m.openTasks / maxOpenTasks) * 100)}%` }} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
