"use client";

import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useProjects } from "@/lib/context/projects-context";
import { useSelectedTask } from "@/lib/context/selected-task-context";
import { workspaceTasks } from "@/lib/data/global-tasks";
import { formatDisplayDate } from "@/lib/format";
import { TASK_PRIORITY_BADGE_CLASS } from "@/lib/status";
import type { WorkspaceTask } from "@/types/task";

const TODAY = "2026-08-26";

function TaskRow({ task, onClick }: { task: WorkspaceTask; onClick: () => void }) {
  return (
    <div className="list-row" onClick={onClick} style={{ cursor: "pointer" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="task-name">{task.title}</div>
        <div className="tiny muted">
          {task.id} · {task.projectName}
        </div>
      </div>
      <span className={`badge ${TASK_PRIORITY_BADGE_CLASS[task.priority]}`}>{task.priority}</span>
      <span className="tiny">{formatDisplayDate(task.dueDate)}</span>
    </div>
  );
}

export default function MyTasksPage() {
  const { openCreateModal } = useProjects();
  const { openTask } = useSelectedTask();

  const buckets = useMemo(() => {
    const today = workspaceTasks.filter((t) => t.dueDate === TODAY);
    const upcoming = workspaceTasks.filter((t) => t.dueDate > TODAY && t.status !== "Done");
    const overdue = workspaceTasks.filter((t) => t.dueDate < TODAY && t.status !== "Done");
    const completed = workspaceTasks.filter((t) => t.status === "Done");
    return { today, upcoming, overdue, completed };
  }, []);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <div className="page-sub">Your personal workload across all projects.</div>
        </div>
        <button type="button" className="btn primary" onClick={openCreateModal}>
          <Plus size={15} /> New task
        </button>
      </div>

      <div className="grid g4">
        {[
          ["Today", buckets.today.length],
          ["Upcoming", buckets.upcoming.length],
          ["Overdue", buckets.overdue.length],
          ["Completed", buckets.completed.length],
        ].map(([label, value], i) => (
          <div key={label} className="card kpi">
            <span className="kpi-label">{label}</span>
            <div className="kpi-value">{value}</div>
            <div className={`trend ${i === 2 && Number(value) > 0 ? "down" : "up"}`}>
              {i === 2 ? (Number(value) > 0 ? "Needs attention" : "All clear") : i === 3 ? "+8 this week" : "On schedule"}
            </div>
          </div>
        ))}
      </div>

      <div className="grid g2" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Today &amp; overdue</span>
          </div>
          {[...buckets.today, ...buckets.overdue].length === 0 ? (
            <div className="empty">
              <strong>Nothing due today</strong>
            </div>
          ) : (
            [...buckets.today, ...buckets.overdue].map((t) => (
              <TaskRow key={t.id} task={t} onClick={() => openTask(t)} />
            ))
          )}
        </div>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Upcoming</span>
          </div>
          {buckets.upcoming.map((t) => (
            <TaskRow key={t.id} task={t} onClick={() => openTask(t)} />
          ))}
        </div>
      </div>
    </div>
  );
}
