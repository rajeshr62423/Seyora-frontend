"use client";

import { notFound } from "next/navigation";
import { Calendar, MessageSquare, Plus } from "lucide-react";
import { useMemo, useState, type DragEvent } from "react";
import { generateProjectTasks } from "@/lib/data/tasks";
import { formatDisplayDate } from "@/lib/format";
import { useProjects } from "@/lib/context/projects-context";
import { useMessage } from "@/lib/hooks/use-message";
import { useSelectedTask } from "@/lib/context/selected-task-context";
import { TASK_PRIORITY_BADGE_CLASS, TASK_STATUSES } from "@/lib/status";
import type { ProjectTask, TaskStatus } from "@/types/task";
import ProjectHeaderCard from "./ProjectHeaderCard";

function groupByStatus(tasks: ProjectTask[]): Record<TaskStatus, ProjectTask[]> {
  const grouped = Object.fromEntries(TASK_STATUSES.map((s) => [s, [] as ProjectTask[]])) as Record<TaskStatus, ProjectTask[]>;
  for (const task of tasks) grouped[task.status].push(task);
  return grouped;
}

export default function ProjectBoardPage({ slug }: { slug: string }) {
  const { getProjectBySlug } = useProjects();
  const project = getProjectBySlug(slug);
  const message = useMessage();
  const { openTask } = useSelectedTask();

  const seedTasks = useMemo(() => (project ? generateProjectTasks(project) : []), [project]);
  const [board, setBoard] = useState<Record<TaskStatus, ProjectTask[]>>(() => groupByStatus(seedTasks));
  const [draggedId, setDraggedId] = useState<string | null>(null);

  if (!project) notFound();

  const handleDrop = (column: TaskStatus) => (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    if (!draggedId) return;
    let moved: ProjectTask | null = null;
    setBoard((prev) => {
      const next: Record<TaskStatus, ProjectTask[]> = { ...prev };
      for (const status of TASK_STATUSES) {
        const idx = next[status].findIndex((t) => t.id === draggedId);
        if (idx > -1) {
          moved = { ...next[status][idx], status: column };
          next[status] = next[status].filter((t) => t.id !== draggedId);
        }
      }
      if (moved) next[column] = [...next[column], moved];
      return next;
    });
    if (moved) message.success(`${draggedId} moved to ${column}`);
    setDraggedId(null);
  };

  return (
    <div className="page">
      <ProjectHeaderCard project={project} activeTab="Board" />

      <div className="kanban" style={{ marginTop: 14 }}>
        {TASK_STATUSES.map((column) => (
          <section
            key={column}
            className="kanban-col"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop(column)}
          >
            <div className="kanban-head">
              <span className="kanban-title">{column}</span>
              <span className="kanban-count">{board[column].length}</span>
              <button
                type="button"
                className="icon-btn"
                style={{ width: 26, height: 26 }}
                onClick={() => message.info("Add task is not part of this demo.")}
              >
                <Plus size={14} />
              </button>
            </div>
            {board[column].map((task) => (
              <article
                key={task.id}
                className={`task-card ${draggedId === task.id ? "dragging" : ""}`}
                draggable
                onDragStart={() => setDraggedId(task.id)}
                onClick={() => openTask(task)}
              >
                <div className="tiny muted">{task.id}</div>
                <div className="task-card-title">{task.title}</div>
                <div className="task-card-meta">
                  <span className={`badge ${TASK_PRIORITY_BADGE_CLASS[task.priority]}`}>{task.priority}</span>
                </div>
                <div className="task-card-foot">
                  <span className="mini-icon">
                    <Calendar size={12} /> {formatDisplayDate(task.dueDate)}
                  </span>
                  <span className="avatar-stack">
                    <span className="avatar">{task.assigneeInitials}</span>
                  </span>
                  <span className="mini-icon">
                    <MessageSquare size={12} /> {(task.id.charCodeAt(task.id.length - 1) % 5) + 1}
                  </span>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
      <div className="small muted" style={{ marginTop: 9 }}>
        Drag tasks between columns to update their workflow status.
      </div>
    </div>
  );
}
