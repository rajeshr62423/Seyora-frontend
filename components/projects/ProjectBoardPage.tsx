"use client";

import { notFound } from "next/navigation";
import { Calendar, MessageSquare, Plus } from "lucide-react";
import { useMemo, useState, type DragEvent } from "react";
import Avatar from "@/components/common/Avatar";
import { formatDisplayDate } from "@/lib/format";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useProjectBySlug } from "@/lib/hooks/use-project-by-slug";
import { useProjectTasks } from "@/lib/hooks/use-project-tasks";
import { TASK_PRIORITY_BADGE_CLASS, TASK_STATUS_LABEL, TASK_STATUSES } from "@/lib/status";
import { openCreateTaskModal, updateTaskRequest } from "@/redux/tasks/action";
import { useAppDispatch } from "@/redux/hooks";
import type { Task, TaskStatus } from "@/types/task";
import ProjectHeaderCard from "./ProjectHeaderCard";

function groupByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const grouped = Object.fromEntries(TASK_STATUSES.map((s) => [s, [] as Task[]])) as Record<TaskStatus, Task[]>;
  for (const task of tasks) grouped[task.status].push(task);
  return grouped;
}

export default function ProjectBoardPage({ slug }: { slug: string }) {
  const dispatch = useAppDispatch();
  const router = useAppRouter();
  const { project, loading: projectLoading } = useProjectBySlug(slug);
  const { tasks, loading: tasksLoading } = useProjectTasks(project?.id);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const board = useMemo(() => groupByStatus(tasks), [tasks]);

  if (projectLoading && !project) return null;
  if (!project) notFound();

  const handleDrop = (column: TaskStatus) => (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    setDraggingId(null);
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === column) return;
    dispatch(updateTaskRequest({ id: taskId, values: { status: column } }));
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
              <span className="kanban-title">{TASK_STATUS_LABEL[column]}</span>
              <span className="kanban-count">{board[column].length}</span>
              <button
                type="button"
                className="icon-btn"
                style={{ width: 26, height: 26 }}
                onClick={() => dispatch(openCreateTaskModal({ projectId: project.id, status: column }))}
              >
                <Plus size={14} />
              </button>
            </div>
            {tasksLoading && tasks.length === 0
              ? null
              : board[column].map((task) => (
                  <article
                    key={task.id}
                    className={`task-card ${draggingId === task.id ? "dragging" : ""}`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", task.id);
                      setDraggingId(task.id);
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    onClick={() => router.push(`/tasks/${task.code}`)}
                  >
                    <div className="tiny muted">{task.code}</div>
                    <div className="task-card-title">{task.title}</div>
                    <div className="task-card-meta">
                      <span className={`badge ${TASK_PRIORITY_BADGE_CLASS[task.priority]}`}>{task.priority}</span>
                    </div>
                    <div className="task-card-foot">
                      <span className="mini-icon">
                        <Calendar size={12} /> {task.dueDate ? formatDisplayDate(task.dueDate) : "No due date"}
                      </span>
                      <span className="avatar-stack">
                        <Avatar url={task.assignee?.avatarUrl} initials={task.assignee?.initials ?? "—"} />
                      </span>
                      <span className="mini-icon">
                        <MessageSquare size={12} /> {task.comments.length}
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
