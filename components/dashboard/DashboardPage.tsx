"use client";

import {
  Activity,
  Calendar,
  CheckSquare,
  Folder,
  Plus,
  Users as UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import BarChart from "@/components/charts/BarChart";
import Donut from "@/components/charts/Donut";
import { useProjects } from "@/lib/context/projects-context";
import { useSelectedTask } from "@/lib/context/selected-task-context";
import { workspaceActivity } from "@/lib/data/activity";
import { workspaceTasks } from "@/lib/data/global-tasks";
import { formatDisplayDate } from "@/lib/format";
import { useAppSelector } from "@/redux/hooks";

const PRIORITY_WEEK = [
  { label: "M", value: 34 },
  { label: "T", value: 57 },
  { label: "W", value: 81 },
  { label: "T", value: 46 },
  { label: "F", value: 67 },
  { label: "S", value: 74 },
  { label: "S", value: 55 },
];

export default function DashboardPage() {
  const { projects, openCreateModal } = useProjects();
  const users = useAppSelector((state) => state.users.list);
  const { openTask } = useSelectedTask();

  const totals = useMemo(() => {
    const totalTasks = projects.reduce((sum, p) => sum + p.taskCount, 0);
    let completed = 0;
    let inProgress = 0;
    let inReview = 0;
    let todo = 0;
    for (const p of projects) {
      const done = Math.round((p.progress / 100) * p.taskCount);
      completed += done;
      const remaining = p.taskCount - done;
      if (p.status === "in-review") inReview += remaining;
      else if (p.status === "in-progress") inProgress += remaining;
      else todo += remaining;
    }
    const overdue = workspaceTasks.filter(
      (t) => t.status !== "Done" && t.dueDate < "2026-08-26",
    ).length;
    return { totalTasks, completed, inProgress, inReview, todo, overdue };
  }, [projects]);

  const kpis = [
    {
      label: "Total projects",
      value: String(projects.length),
      trend: "+2 this month",
      icon: Folder,
    },
    {
      label: "Total tasks",
      value: String(totals.totalTasks),
      trend: "+18% from last month",
      icon: CheckSquare,
    },
    {
      label: "Completed",
      value: String(totals.completed),
      trend: "+12% from last month",
      icon: Activity,
    },
    {
      label: "Overdue",
      value: String(totals.overdue),
      trend: `${totals.overdue} need attention`,
      icon: Calendar,
    },
    {
      label: "Active members",
      value: String(users.length || 5),
      trend: "+4 this month",
      icon: UsersIcon,
    },
  ];

  const workloadFor = (userId: string) => {
    const memberProjects = projects.filter((p) =>
      p.team.some((m) => m.id === userId),
    );
    const avgProgress = memberProjects.length
      ? Math.round(
          memberProjects.reduce((s, p) => s + p.progress, 0) /
            memberProjects.length,
        )
      : 0;
    const taskCount = memberProjects.reduce(
      (s, p) => s + Math.max(1, Math.round(p.taskCount / p.team.length)),
      0,
    );
    return { avgProgress, taskCount };
  };

  const projectProgress = [...projects]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);
  const recentlyUpdated = [...projects]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3);
  const upcomingDeadlines = [...workspaceTasks]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Good morning, John 👋</h1>
          <div className="page-sub">
            Here&rsquo;s what&rsquo;s happening across Chola Technology today.
          </div>
        </div>
        <div className="actions">
          <Link href="/calendar" className="btn">
            <Calendar size={15} /> This month
          </Link>
          <button
            type="button"
            className="btn primary"
            onClick={openCreateModal}
          >
            <Plus size={15} /> New project
          </button>
        </div>
      </div>

      <div className="grid g5">
        {kpis.map((k) => (
          <div key={k.label} className="card kpi">
            <div className="kpi-top">
              <span className="kpi-label">{k.label}</span>
              <span className="project-icon" style={{ width: 28, height: 28 }}>
                <k.icon size={15} />
              </span>
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className="trend up">{k.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid g3" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Tasks by status</span>
            <span className="small muted">{totals.totalTasks} total</span>
          </div>
          <div className="panel-body">
            <Donut
              centerLabel={String(totals.totalTasks)}
              segments={[
                { label: "Done", value: totals.completed, color: "#4ADE80" },
                {
                  label: "In Progress",
                  value: totals.inProgress,
                  color: "#2DD4BF",
                },
                {
                  label: "In Review",
                  value: totals.inReview,
                  color: "#A7F3D0",
                },
                { label: "Todo", value: totals.todo, color: "#94A3B8" },
              ]}
            />
          </div>
        </div>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Tasks by priority</span>
            <span className="small muted">This month</span>
          </div>
          <div className="panel-body">
            <BarChart data={PRIORITY_WEEK} />
          </div>
        </div>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Project progress</span>
            <Link href="/projects" className="link tiny">
              View all
            </Link>
          </div>
          <div className="panel-body">
            {projectProgress.map((p) => (
              <div key={p.id} style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10,
                    marginBottom: 6,
                  }}
                >
                  <span>{p.name}</span>
                  <span className="muted">{p.progress}%</span>
                </div>
                <div className="progress">
                  <span
                    style={{ width: `${p.progress}%`, background: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid g3" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Team workload</span>
            <span className="small muted">{users.length} members</span>
          </div>
          <div className="panel-body">
            {users.map((u) => {
              const { avgProgress, taskCount } = workloadFor(u.id);
              return (
                <div
                  key={u.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 13,
                  }}
                >
                  <span className="avatar">{u.initials}</span>
                  <span style={{ fontSize: 10, minWidth: 92 }}>
                    {u.name.split(" ")[0]}
                  </span>
                  <div className="progress" style={{ flex: 1 }}>
                    <span style={{ width: `${avgProgress}%` }} />
                  </div>
                  <span className="tiny muted">{taskCount} tasks</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Recent activity</span>
            <Link href="/activity" className="link tiny">
              View all
            </Link>
          </div>
          <div className="panel-body">
            {workspaceActivity.slice(0, 4).map((a) => (
              <div key={a.id} className="activity">
                <span className="avatar">{a.actorInitials}</span>
                <div className="activity-text">
                  <strong>{a.actorName}</strong> {a.action}
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Upcoming deadlines</span>
            <span className="small muted">Next 7 days</span>
          </div>
          <div>
            {upcomingDeadlines.map((t) => (
              <div
                key={t.id}
                className="list-row"
                onClick={() => openTask(t)}
                style={{ cursor: "pointer" }}
              >
                <div className="project-icon" style={{ width: 34, height: 34 }}>
                  <Calendar size={15} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 650 }}>{t.title}</div>
                  <div className="tiny muted">
                    {t.id} · {t.projectName}
                  </div>
                </div>
                <span className="tiny">{formatDisplayDate(t.dueDate)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="panel-head">
          <span className="card-title">Recently updated projects</span>
          <Link href="/projects" className="link tiny">
            View all
          </Link>
        </div>
        <div className="grid g3" style={{ padding: 14 }}>
          {recentlyUpdated.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.slug}`}
              style={{ display: "flex", gap: 10, alignItems: "center" }}
            >
              <div
                className="project-icon"
                style={{ color: p.color, background: `${p.color}18` }}
              >
                <Folder size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 650 }}>{p.name}</div>
                <div className="progress" style={{ marginTop: 7 }}>
                  <span
                    style={{ width: `${p.progress}%`, background: p.color }}
                  />
                </div>
              </div>
              <span className="tiny muted">{p.progress}%</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
