export type TaskStatus = "Backlog" | "Todo" | "In Progress" | "In Review" | "Done";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export interface ProjectTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeName: string;
  assigneeInitials: string;
  dueDate: string;
}

export interface WorkspaceTask extends ProjectTask {
  projectName: string;
  projectSlug: string;
}
