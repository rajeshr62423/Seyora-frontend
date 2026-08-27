import type { User } from "./user";

export type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  done: boolean;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  author: User;
  body: string;
  createdAt: string;
}

export interface Task {
  id: string;
  code: string;
  organizationId: string;
  projectId: string;
  assigneeId: string | null;
  assignee: User | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  subtasks: Subtask[];
  comments: Comment[];
  // Present only on tasks from GET /tasks/me (cross-project context);
  // absent from project-scoped fetches, which already know the project.
  project?: { id: string; name: string; slug: string };
}

export interface CreateTaskFormValues {
  title: string;
  description?: string;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
}
