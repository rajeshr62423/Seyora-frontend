import type { Project } from "@/types/project";
import type { ProjectTask, TaskPriority, TaskStatus } from "@/types/task";

const TASK_TITLES = [
  "Implement authentication flow",
  "Fix responsive layout regressions",
  "Write integration tests",
  "Review pull request feedback",
  "Set up CI pipeline checks",
  "Optimize database queries",
  "Draft API documentation",
  "Ship notification preferences",
  "Define API contracts",
  "Create design tokens",
];

const STATUSES: TaskStatus[] = ["Backlog", "Todo", "In Progress", "In Review", "Done"];
const PRIORITIES: TaskPriority[] = ["Low", "Medium", "High", "Critical"];

export function generateProjectTasks(project: Project): ProjectTask[] {
  const count = Math.min(Math.max(project.taskCount, 5), TASK_TITLES.length);
  const dueBase = new Date(`${project.dueDate}T00:00:00`);

  return Array.from({ length: count }, (_, i) => {
    const assignee = project.team[i % project.team.length];
    const due = new Date(dueBase);
    due.setDate(due.getDate() - (count - i) * 2);

    return {
      id: `${project.id}-T${i + 1}`,
      title: TASK_TITLES[i % TASK_TITLES.length],
      status: STATUSES[i % STATUSES.length],
      priority: PRIORITIES[(i + 1) % PRIORITIES.length],
      assigneeName: assignee?.name ?? "Unassigned",
      assigneeInitials: assignee?.initials ?? "—",
      dueDate: due.toISOString().slice(0, 10),
    };
  });
}
