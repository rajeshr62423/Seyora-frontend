"use client";

import { notFound } from "next/navigation";
import { useMemo } from "react";
import { generateProjectTasks } from "@/lib/data/tasks";
import { formatDisplayDate } from "@/lib/format";
import { useProjects } from "@/lib/context/projects-context";
import { useSelectedTask } from "@/lib/context/selected-task-context";
import { TASK_PRIORITY_BADGE_CLASS, TASK_STATUS_BADGE_CLASS } from "@/lib/status";
import ProjectHeaderCard from "./ProjectHeaderCard";

export default function ProjectTasksPage({ slug }: { slug: string }) {
  const { getProjectBySlug } = useProjects();
  const project = getProjectBySlug(slug);
  const tasks = useMemo(() => (project ? generateProjectTasks(project) : []), [project]);
  const { openTask } = useSelectedTask();

  if (!project) notFound();

  return (
    <div className="page">
      <ProjectHeaderCard project={project} activeTab="List" />

      <div className="card" style={{ marginTop: 14 }}>
        <div className="panel-head">
          <span className="card-title">Tasks</span>
          <span className="tiny muted">
            {tasks.length} shown of {project.taskCount}
          </span>
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
              {tasks.map((task) => (
                <tr key={task.id} onClick={() => openTask(task)} style={{ cursor: "pointer" }}>
                  <td>
                    <span className="tiny muted" style={{ marginRight: 7 }}>
                      {task.id}
                    </span>
                    <span style={{ fontWeight: 650 }}>{task.title}</span>
                  </td>
                  <td>
                    <span className={`badge ${TASK_STATUS_BADGE_CLASS[task.status]}`}>
                      <span className="status-dot" />
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${TASK_PRIORITY_BADGE_CLASS[task.priority]}`}>{task.priority}</span>
                  </td>
                  <td>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="avatar" style={{ width: 22, height: 22, fontSize: 9 }}>
                        {task.assigneeInitials}
                      </span>
                      {task.assigneeName}
                    </span>
                  </td>
                  <td>{formatDisplayDate(task.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
