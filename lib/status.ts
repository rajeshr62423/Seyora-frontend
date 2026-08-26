import type { ProjectStatus } from "@/types/project";
import type { TaskPriority, TaskStatus } from "@/types/task";

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  "in-progress": "In Progress",
  "in-review": "In Review",
  "on-track": "On Track",
  backlog: "Backlog",
};

export const STATUS_BADGE_CLASS: Record<ProjectStatus, string> = {
  "in-progress": "badge-progressing",
  "in-review": "badge-review",
  "on-track": "badge-done",
  backlog: "badge-gray",
};

export const STATUS_FILTER_OPTIONS: { value: "all" | ProjectStatus; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "in-progress", label: "In Progress" },
  { value: "in-review", label: "In Review" },
  { value: "on-track", label: "On Track" },
  { value: "backlog", label: "Backlog" },
];

export const TASK_STATUS_BADGE_CLASS: Record<TaskStatus, string> = {
  Backlog: "badge-gray",
  Todo: "badge-todo",
  "In Progress": "badge-progressing",
  "In Review": "badge-review",
  Done: "badge-done",
};

export const TASK_PRIORITY_BADGE_CLASS: Record<TaskPriority, string> = {
  Low: "badge-gray",
  Medium: "badge-progressing",
  High: "badge-review",
  Critical: "badge-danger",
};

export const TASK_STATUSES: TaskStatus[] = ["Backlog", "Todo", "In Progress", "In Review", "Done"];
