import type { ProjectStatus } from "@/types/project";
import type { OrgRole } from "@/types/organization";
import type { TaskPriority, TaskStatus } from "@/types/task";

export const ORG_ROLE_LABEL: Record<OrgRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MANAGER: "Manager",
  MEMBER: "Member",
  VIEWER: "Viewer",
};

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  ON_TRACK: "On Track",
  BACKLOG: "Backlog",
};

export const STATUS_BADGE_CLASS: Record<ProjectStatus, string> = {
  IN_PROGRESS: "badge-progressing",
  IN_REVIEW: "badge-review",
  ON_TRACK: "badge-done",
  BACKLOG: "badge-gray",
};

export const STATUS_FILTER_OPTIONS: { value: "all" | ProjectStatus; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "ON_TRACK", label: "On Track" },
  { value: "BACKLOG", label: "Backlog" },
];

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  BACKLOG: "Backlog",
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

export const TASK_STATUS_BADGE_CLASS: Record<TaskStatus, string> = {
  BACKLOG: "badge-gray",
  TODO: "badge-todo",
  IN_PROGRESS: "badge-progressing",
  IN_REVIEW: "badge-review",
  DONE: "badge-done",
};

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

export const TASK_PRIORITY_BADGE_CLASS: Record<TaskPriority, string> = {
  LOW: "badge-gray",
  MEDIUM: "badge-progressing",
  HIGH: "badge-review",
  CRITICAL: "badge-danger",
};

export const TASK_STATUSES: TaskStatus[] = ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
