import type { CreateTaskFormValues, Task, TaskStatus } from "@/types/task";

export interface TasksState {
  projectTasks: Task[];
  projectTasksProjectId: string | null;
  projectTasksLoading: boolean;
  projectTasksError: string | null;

  myTasks: Task[];
  myTasksLoading: boolean;
  myTasksError: string | null;

  creating: boolean;
  createError: string | null;
  createTaskContext: { projectId?: string; status?: TaskStatus } | null;

  // Per-task-id, not a single flag — multiple task updates (e.g. rapid
  // kanban drags) can be genuinely in flight at once. See PLANNING notes:
  // takeEvery is used for task mutations, unlike the rest of the app's
  // takeLatest sagas.
  updatingTaskIds: string[];
  updateError: string | null;

  // Single flags are fine here — only one task's modal can be open at a
  // time, so subtask/comment mutations are never concurrent across tasks.
  subtaskSaving: boolean;
  subtaskError: string | null;
  commentSending: boolean;
  commentError: string | null;

  selectedTaskId: string | null;
}

export interface CreateTaskPayload {
  projectId: string;
  values: CreateTaskFormValues;
  status?: TaskStatus;
}

export interface UpdateTaskPayload {
  id: string;
  values: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: Task["priority"];
    assigneeId?: string | null;
    dueDate?: string;
  };
}

export interface AddSubtaskPayload {
  taskId: string;
  title: string;
}

export interface UpdateSubtaskPayload {
  taskId: string;
  subtaskId: string;
  values: { title?: string; done?: boolean };
}

export interface DeleteSubtaskPayload {
  taskId: string;
  subtaskId: string;
}

export interface AddCommentPayload {
  taskId: string;
  body: string;
}
