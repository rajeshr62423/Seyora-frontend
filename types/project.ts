import type { User } from "./user";

export type ProjectStatus = "in-progress" | "in-review" | "on-track" | "backlog";

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  taskCount: number;
  dueDate: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  color: string;
  team: User[];
}

export type ProjectSortKey = "recently-updated" | "progress" | "due-date" | "name";

export type ProjectViewMode = "grid" | "list";

export type ProjectStatusFilter = "all" | ProjectStatus;

export interface CreateProjectFormValues {
  name: string;
  description?: string;
  status: ProjectStatus;
  team: string[];
  dueDate: string;
}
