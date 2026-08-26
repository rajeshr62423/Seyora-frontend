"use client";

import { useState } from "react";
import BarChart from "@/components/charts/BarChart";
import Donut from "@/components/charts/Donut";
import { useProjects } from "@/lib/context/projects-context";
import { useAppSelector } from "@/redux/hooks";

const TREND = [32, 44, 39, 61, 57, 74, 68, 82, 76, 88, 79, 92].map((v, i) => ({ label: String(i + 1), value: v }));
const RANGES = ["7 days", "30 days", "90 days"] as const;

export default function AnalyticsPage() {
  const { projects } = useProjects();
  const users = useAppSelector((state) => state.users.list);
  const [range, setRange] = useState<(typeof RANGES)[number]>("30 days");

  const totalTasks = projects.reduce((s, p) => s + p.taskCount, 0);
  const avgCompletion = projects.length ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0;

  const kpis = [
    { label: "Completion rate", value: `${avgCompletion}%`, trend: "+7.2% vs previous" },
    { label: "Velocity", value: "38 pts", trend: "+12% vs previous" },
    { label: "Avg. completion", value: "2.8d", trend: "-0.4d vs previous" },
    { label: "Overdue tasks", value: "14", trend: "-5 vs previous" },
  ];

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
              key={r}
              type="button"
              className={`btn ${range === r ? "primary" : ""}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid g4">
        {kpis.map((k) => (
          <div key={k.label} className="card kpi">
            <span className="kpi-label">{k.label}</span>
            <div className="kpi-value">{k.value}</div>
            <div className="trend up">{k.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid g2" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Task completion trend</span>
          </div>
          <div className="panel-body">
            <BarChart data={TREND} />
          </div>
        </div>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Status distribution</span>
          </div>
          <div className="panel-body">
            <Donut
              centerLabel={String(totalTasks)}
              segments={[
                { label: "Done", value: Math.round(totalTasks * 0.62), color: "#4ADE80" },
                { label: "In Progress", value: Math.round(totalTasks * 0.19), color: "#2DD4BF" },
                { label: "In Review", value: Math.round(totalTasks * 0.11), color: "#A7F3D0" },
                { label: "Todo", value: Math.round(totalTasks * 0.08), color: "#94A3B8" },
              ]}
            />
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
                <th>Avg. time</th>
                <th>Workload</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const memberProjects = projects.filter((p) => p.team.some((m) => m.id === u.id));
                const assigned = memberProjects.reduce((s, p) => s + Math.max(1, Math.round(p.taskCount / p.team.length)), 0);
                const completed = Math.round(assigned * 0.82);
                const workload = memberProjects.length
                  ? Math.round(memberProjects.reduce((s, p) => s + p.progress, 0) / memberProjects.length)
                  : 0;
                return (
                  <tr key={u.id}>
                    <td>
                      <span style={{ display: "flex", gap: 7, alignItems: "center" }}>
                        <span className="avatar">{u.initials}</span>
                        {u.name}
                      </span>
                    </td>
                    <td>{assigned}</td>
                    <td>{completed}</td>
                    <td>{assigned ? Math.round((completed / assigned) * 100) : 0}%</td>
                    <td>{(1.8 + i * 0.3).toFixed(1)}d</td>
                    <td>
                      <div className="progress" style={{ width: 120 }}>
                        <span style={{ width: `${workload}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
