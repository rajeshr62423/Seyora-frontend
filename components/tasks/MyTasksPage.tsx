"use client";

import { Plus } from "lucide-react";
import { useMemo } from "react";
import { formatDisplayDate } from "@/lib/format";
import { TASK_PRIORITY_BADGE_CLASS } from "@/lib/status";
import { openCreateTaskModal, openTask } from "@/redux/tasks/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Task } from "@/types/task";

function TaskRow({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <div className="list-row" onClick={onClick} style={{ cursor: "pointer" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="task-name">{task.title}</div>
        <div className="tiny muted">
          {task.code} · {task.project?.name ?? ""}
        </div>
      </div>
      <span className={`badge ${TASK_PRIORITY_BADGE_CLASS[task.priority]}`}>{task.priority}</span>
      <span className="tiny">{task.dueDate ? formatDisplayDate(task.dueDate) : "No due date"}</span>
    </div>
  );
}

export default function MyTasksPage() {
  const dispatch = useAppDispatch();
  const { myTasks, myTasksLoading } = useAppSelector((state) => state.tasks);

  const buckets = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const dueToday = myTasks.filter((t) => t.dueDate === today);
    // Undated + not-done tasks fold into "upcoming" — "not yet due" is an
    // honest enough characterization, and it avoids a 5th KPI tile just
    // for the no-due-date case.
    const upcoming = myTasks.filter(
      (t) => t.status !== "DONE" && (t.dueDate === null || t.dueDate > today) && t.dueDate !== today,
    );
    const overdue = myTasks.filter((t) => t.status !== "DONE" && t.dueDate !== null && t.dueDate < today);
    const completed = myTasks.filter((t) => t.status === "DONE");
    return { today: dueToday, upcoming, overdue, completed };
  }, [myTasks]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <div className="page-sub">Your personal workload across all projects.</div>
        </div>
        <button type="button" className="btn primary" onClick={() => dispatch(openCreateTaskModal())}>
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
              {i === 2 ? (Number(value) > 0 ? "Needs attention" : "All clear") : ""}
            </div>
          </div>
        ))}
      </div>

      <div className="grid g2" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Today &amp; overdue</span>
          </div>
          {myTasksLoading && myTasks.length === 0 ? (
            <div className="empty">
              <strong>Loading…</strong>
            </div>
          ) : [...buckets.today, ...buckets.overdue].length === 0 ? (
            <div className="empty">
              <strong>Nothing due today</strong>
            </div>
          ) : (
            [...buckets.today, ...buckets.overdue].map((t) => (
              <TaskRow key={t.id} task={t} onClick={() => dispatch(openTask(t.id))} />
            ))
          )}
        </div>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Upcoming</span>
          </div>
          {buckets.upcoming.map((t) => (
            <TaskRow key={t.id} task={t} onClick={() => dispatch(openTask(t.id))} />
          ))}
        </div>
      </div>
    </div>
  );
}
