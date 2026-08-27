import type { Comment, Subtask, Task, TaskPriority, TaskStatus } from "@/types/task";
import { apiFetch } from "./client";
import { normalizeUser, type ApiUser } from "./users";

interface ApiSubtask {
  id: number;
  taskId: number;
  title: string;
  done: boolean;
}

interface ApiComment {
  id: number;
  taskId: number;
  authorId: number;
  author: ApiUser;
  body: string;
  createdAt: string;
}

interface ApiTask {
  id: number;
  code: string;
  organizationId: number;
  projectId: number;
  assigneeId: number | null;
  assignee: ApiUser | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  subtasks: ApiSubtask[];
  comments: ApiComment[];
  project?: { id: number; name: string; slug: string };
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number | null;
  dueDate?: string;
}

function normalizeSubtask(subtask: ApiSubtask): Subtask {
  return {
    id: String(subtask.id),
    taskId: String(subtask.taskId),
    title: subtask.title,
    done: subtask.done,
  };
}

function normalizeComment(comment: ApiComment): Comment {
  return {
    id: String(comment.id),
    taskId: String(comment.taskId),
    authorId: String(comment.authorId),
    author: normalizeUser(comment.author),
    body: comment.body,
    createdAt: comment.createdAt.slice(0, 10),
  };
}

function normalizeTask(task: ApiTask): Task {
  return {
    id: String(task.id),
    code: task.code,
    organizationId: String(task.organizationId),
    projectId: String(task.projectId),
    assigneeId: task.assigneeId === null ? null : String(task.assigneeId),
    assignee: task.assignee ? normalizeUser(task.assignee) : null,
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : null,
    completedAt: task.completedAt ? task.completedAt.slice(0, 10) : null,
    createdAt: task.createdAt.slice(0, 10),
    updatedAt: task.updatedAt.slice(0, 10),
    subtasks: task.subtasks.map(normalizeSubtask),
    comments: task.comments.map(normalizeComment),
    project: task.project
      ? { id: String(task.project.id), name: task.project.name, slug: task.project.slug }
      : undefined,
  };
}

export async function listTasksForProject(projectId: string): Promise<Task[]> {
  const tasks = await apiFetch<ApiTask[]>(`/projects/${projectId}/tasks`, { method: "GET" });
  return tasks.map(normalizeTask);
}

export async function createTask(projectId: string, input: CreateTaskInput): Promise<Task> {
  const task = await apiFetch<ApiTask>(`/projects/${projectId}/tasks`, { method: "POST", body: input });
  return normalizeTask(task);
}

export async function getMyTasks(): Promise<Task[]> {
  const tasks = await apiFetch<ApiTask[]>("/tasks/me", { method: "GET" });
  return tasks.map(normalizeTask);
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const task = await apiFetch<ApiTask>(`/tasks/${id}`, { method: "PATCH", body: input });
  return normalizeTask(task);
}

export async function addSubtask(taskId: string, title: string): Promise<Subtask> {
  const subtask = await apiFetch<ApiSubtask>(`/tasks/${taskId}/subtasks`, { method: "POST", body: { title } });
  return normalizeSubtask(subtask);
}

export async function updateSubtask(
  taskId: string,
  subtaskId: string,
  input: { title?: string; done?: boolean },
): Promise<Subtask> {
  const subtask = await apiFetch<ApiSubtask>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
    method: "PATCH",
    body: input,
  });
  return normalizeSubtask(subtask);
}

export async function deleteSubtask(taskId: string, subtaskId: string): Promise<void> {
  await apiFetch(`/tasks/${taskId}/subtasks/${subtaskId}`, { method: "DELETE" });
}

export async function addComment(taskId: string, body: string): Promise<Comment> {
  const comment = await apiFetch<ApiComment>(`/tasks/${taskId}/comments`, { method: "POST", body: { body } });
  return normalizeComment(comment);
}
