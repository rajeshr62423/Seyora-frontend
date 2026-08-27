import type { User } from "./user";

export type ProjectStatus = "BACKLOG" | "IN_PROGRESS" | "IN_REVIEW" | "ON_TRACK";

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  user: User;
}

export interface Project {
  id: string;
  organizationId: string;
  ownerId: string;
  owner: User;
  slug: string;
  name: string;
  description: string;
  status: ProjectStatus;
  // Not stored by the backend — computed from Tasks, a separate,
  // not-yet-wired phase. Always 0 until then; not fabricated.
  // TODO(tasks-wiring): replace with a real computation once Tasks lands.
  progress: number;
  taskCount: number;
  dueDate: string; // ISO date string (YYYY-MM-DD)
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  color: string;
  members: ProjectMember[];
  // Derived convenience: members.map(m => m.user), kept so existing
  // `project.team.some(...)`-style consumers don't all need rewriting.
  team: User[];
}

export type ProjectSortKey = "recently-updated" | "due-date" | "name";

export type ProjectViewMode = "grid" | "list";

export type ProjectStatusFilter = "all" | ProjectStatus;

export interface CreateProjectFormValues {
  name: string;
  description?: string;
  status: ProjectStatus;
  team: string[];
  dueDate: string;
}
