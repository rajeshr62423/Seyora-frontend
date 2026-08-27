"use client";

import { notFound } from "next/navigation";
import { formatDisplayDate } from "@/lib/format";
import { useProjectBySlug } from "@/lib/hooks/use-project-by-slug";
import { useProjectTasks } from "@/lib/hooks/use-project-tasks";
import { TASK_PRIORITY_BADGE_CLASS, TASK_STATUS_BADGE_CLASS, TASK_STATUS_LABEL } from "@/lib/status";
import { openTask } from "@/redux/tasks/action";
import { useAppDispatch } from "@/redux/hooks";
import ProjectHeaderCard from "./ProjectHeaderCard";

export default function ProjectTasksPage({ slug }: { slug: string }) {
  const dispatch = useAppDispatch();
  const { project, loading: projectLoading } = useProjectBySlug(slug);
  const { tasks, loading: tasksLoading } = useProjectTasks(project?.id);

  if (projectLoading && !project) return null;
  if (!project) notFound();

  return (
    <div className="page">
      <ProjectHeaderCard project={project} activeTab="List" />

      <div className="card" style={{ marginTop: 14 }}>
        <div className="panel-head">
          <span className="card-title">Tasks</span>
          <span className="tiny muted">{tasks.length} tasks</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Due date</th>
              </tr>
            </thead>
            <tbody>
              {tasksLoading && tasks.length === 0 ? null : (
                tasks.map((task) => (
                  <tr key={task.id} onClick={() => dispatch(openTask(task.id))} style={{ cursor: "pointer" }}>
                    <td>
                      <span className="tiny muted" style={{ marginRight: 7 }}>
                        {task.code}
                      </span>
                      <span style={{ fontWeight: 650 }}>{task.title}</span>
                    </td>
                    <td>
                      <span className={`badge ${TASK_STATUS_BADGE_CLASS[task.status]}`}>
                        <span className="status-dot" />
                        {TASK_STATUS_LABEL[task.status]}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${TASK_PRIORITY_BADGE_CLASS[task.priority]}`}>{task.priority}</span>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span className="avatar" style={{ width: 22, height: 22, fontSize: 9 }}>
                          {task.assignee?.initials ?? "—"}
                        </span>
                        {task.assignee?.name ?? "Unassigned"}
                      </span>
                    </td>
                    <td>{task.dueDate ? formatDisplayDate(task.dueDate) : "—"}</td>
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
