import type { UnknownAction } from "redux";
import type { Comment, Subtask, Task, TaskStatus } from "@/types/task";
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_SUBTASK_FAILURE,
  ADD_SUBTASK_REQUEST,
  ADD_SUBTASK_SUCCESS,
  CLOSE_CREATE_TASK_MODAL,
  CLOSE_TASK,
  CREATE_TASK_FAILURE,
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  DELETE_SUBTASK_FAILURE,
  DELETE_SUBTASK_REQUEST,
  DELETE_SUBTASK_SUCCESS,
  FETCH_MY_TASKS_FAILURE,
  FETCH_MY_TASKS_REQUEST,
  FETCH_MY_TASKS_SUCCESS,
  FETCH_PROJECT_TASKS_FAILURE,
  FETCH_PROJECT_TASKS_REQUEST,
  FETCH_PROJECT_TASKS_SUCCESS,
  OPEN_CREATE_TASK_MODAL,
  OPEN_TASK,
  UPDATE_SUBTASK_FAILURE,
  UPDATE_SUBTASK_REQUEST,
  UPDATE_SUBTASK_SUCCESS,
  UPDATE_TASK_FAILURE,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
} from "./actionType";
import type {
  AddCommentPayload,
  AddSubtaskPayload,
  CreateTaskPayload,
  DeleteSubtaskPayload,
  UpdateSubtaskPayload,
  UpdateTaskPayload,
} from "./type";

export interface FetchProjectTasksRequestAction extends UnknownAction {
  type: typeof FETCH_PROJECT_TASKS_REQUEST;
  payload: { projectId: string };
}
export interface FetchProjectTasksSuccessAction extends UnknownAction {
  type: typeof FETCH_PROJECT_TASKS_SUCCESS;
  payload: { projectId: string; tasks: Task[] };
}
export interface FetchProjectTasksFailureAction extends UnknownAction {
  type: typeof FETCH_PROJECT_TASKS_FAILURE;
  payload: string;
}

export interface FetchMyTasksRequestAction extends UnknownAction {
  type: typeof FETCH_MY_TASKS_REQUEST;
}
export interface FetchMyTasksSuccessAction extends UnknownAction {
  type: typeof FETCH_MY_TASKS_SUCCESS;
  payload: Task[];
}
export interface FetchMyTasksFailureAction extends UnknownAction {
  type: typeof FETCH_MY_TASKS_FAILURE;
  payload: string;
}

export interface CreateTaskRequestAction extends UnknownAction {
  type: typeof CREATE_TASK_REQUEST;
  payload: CreateTaskPayload;
}
export interface CreateTaskSuccessAction extends UnknownAction {
  type: typeof CREATE_TASK_SUCCESS;
  payload: Task;
}
export interface CreateTaskFailureAction extends UnknownAction {
  type: typeof CREATE_TASK_FAILURE;
  payload: string;
}

export interface UpdateTaskRequestAction extends UnknownAction {
  type: typeof UPDATE_TASK_REQUEST;
  payload: UpdateTaskPayload;
}
export interface UpdateTaskSuccessAction extends UnknownAction {
  type: typeof UPDATE_TASK_SUCCESS;
  payload: Task;
}
export interface UpdateTaskFailureAction extends UnknownAction {
  type: typeof UPDATE_TASK_FAILURE;
  payload: { taskId: string; message: string };
}

export interface AddSubtaskRequestAction extends UnknownAction {
  type: typeof ADD_SUBTASK_REQUEST;
  payload: AddSubtaskPayload;
}
export interface AddSubtaskSuccessAction extends UnknownAction {
  type: typeof ADD_SUBTASK_SUCCESS;
  payload: { taskId: string; subtask: Subtask };
}
export interface AddSubtaskFailureAction extends UnknownAction {
  type: typeof ADD_SUBTASK_FAILURE;
  payload: string;
}

export interface UpdateSubtaskRequestAction extends UnknownAction {
  type: typeof UPDATE_SUBTASK_REQUEST;
  payload: UpdateSubtaskPayload;
}
export interface UpdateSubtaskSuccessAction extends UnknownAction {
  type: typeof UPDATE_SUBTASK_SUCCESS;
  payload: { taskId: string; subtask: Subtask };
}
export interface UpdateSubtaskFailureAction extends UnknownAction {
  type: typeof UPDATE_SUBTASK_FAILURE;
  payload: string;
}

export interface DeleteSubtaskRequestAction extends UnknownAction {
  type: typeof DELETE_SUBTASK_REQUEST;
  payload: DeleteSubtaskPayload;
}
export interface DeleteSubtaskSuccessAction extends UnknownAction {
  type: typeof DELETE_SUBTASK_SUCCESS;
  payload: { taskId: string; subtaskId: string };
}
export interface DeleteSubtaskFailureAction extends UnknownAction {
  type: typeof DELETE_SUBTASK_FAILURE;
  payload: string;
}

export interface AddCommentRequestAction extends UnknownAction {
  type: typeof ADD_COMMENT_REQUEST;
  payload: AddCommentPayload;
}
export interface AddCommentSuccessAction extends UnknownAction {
  type: typeof ADD_COMMENT_SUCCESS;
  payload: { taskId: string; comment: Comment };
}
export interface AddCommentFailureAction extends UnknownAction {
  type: typeof ADD_COMMENT_FAILURE;
  payload: string;
}

export interface OpenTaskAction extends UnknownAction {
  type: typeof OPEN_TASK;
  payload: string;
}
export interface CloseTaskAction extends UnknownAction {
  type: typeof CLOSE_TASK;
}

export interface OpenCreateTaskModalAction extends UnknownAction {
  type: typeof OPEN_CREATE_TASK_MODAL;
  payload: { projectId?: string; status?: TaskStatus };
}
export interface CloseCreateTaskModalAction extends UnknownAction {
  type: typeof CLOSE_CREATE_TASK_MODAL;
}

export type TasksAction =
  | FetchProjectTasksRequestAction
  | FetchProjectTasksSuccessAction
  | FetchProjectTasksFailureAction
  | FetchMyTasksRequestAction
  | FetchMyTasksSuccessAction
  | FetchMyTasksFailureAction
  | CreateTaskRequestAction
  | CreateTaskSuccessAction
  | CreateTaskFailureAction
  | UpdateTaskRequestAction
  | UpdateTaskSuccessAction
  | UpdateTaskFailureAction
  | AddSubtaskRequestAction
  | AddSubtaskSuccessAction
  | AddSubtaskFailureAction
  | UpdateSubtaskRequestAction
  | UpdateSubtaskSuccessAction
  | UpdateSubtaskFailureAction
  | DeleteSubtaskRequestAction
  | DeleteSubtaskSuccessAction
  | DeleteSubtaskFailureAction
  | AddCommentRequestAction
  | AddCommentSuccessAction
  | AddCommentFailureAction
  | OpenTaskAction
  | CloseTaskAction
  | OpenCreateTaskModalAction
  | CloseCreateTaskModalAction;

export const fetchProjectTasksRequest = (projectId: string): FetchProjectTasksRequestAction => ({
  type: FETCH_PROJECT_TASKS_REQUEST,
  payload: { projectId },
});
export const fetchProjectTasksSuccess = (projectId: string, tasks: Task[]): FetchProjectTasksSuccessAction => ({
  type: FETCH_PROJECT_TASKS_SUCCESS,
  payload: { projectId, tasks },
});
export const fetchProjectTasksFailure = (payload: string): FetchProjectTasksFailureAction => ({
  type: FETCH_PROJECT_TASKS_FAILURE,
  payload,
});

export const fetchMyTasksRequest = (): FetchMyTasksRequestAction => ({ type: FETCH_MY_TASKS_REQUEST });
export const fetchMyTasksSuccess = (payload: Task[]): FetchMyTasksSuccessAction => ({
  type: FETCH_MY_TASKS_SUCCESS,
  payload,
});
export const fetchMyTasksFailure = (payload: string): FetchMyTasksFailureAction => ({
  type: FETCH_MY_TASKS_FAILURE,
  payload,
});

export const createTaskRequest = (payload: CreateTaskPayload): CreateTaskRequestAction => ({
  type: CREATE_TASK_REQUEST,
  payload,
});
export const createTaskSuccess = (payload: Task): CreateTaskSuccessAction => ({
  type: CREATE_TASK_SUCCESS,
  payload,
});
export const createTaskFailure = (payload: string): CreateTaskFailureAction => ({
  type: CREATE_TASK_FAILURE,
  payload,
});

export const updateTaskRequest = (payload: UpdateTaskPayload): UpdateTaskRequestAction => ({
  type: UPDATE_TASK_REQUEST,
  payload,
});
export const updateTaskSuccess = (payload: Task): UpdateTaskSuccessAction => ({
  type: UPDATE_TASK_SUCCESS,
  payload,
});
export const updateTaskFailure = (taskId: string, message: string): UpdateTaskFailureAction => ({
  type: UPDATE_TASK_FAILURE,
  payload: { taskId, message },
});

export const addSubtaskRequest = (payload: AddSubtaskPayload): AddSubtaskRequestAction => ({
  type: ADD_SUBTASK_REQUEST,
  payload,
});
export const addSubtaskSuccess = (taskId: string, subtask: Subtask): AddSubtaskSuccessAction => ({
  type: ADD_SUBTASK_SUCCESS,
  payload: { taskId, subtask },
});
export const addSubtaskFailure = (payload: string): AddSubtaskFailureAction => ({
  type: ADD_SUBTASK_FAILURE,
  payload,
});

export const updateSubtaskRequest = (payload: UpdateSubtaskPayload): UpdateSubtaskRequestAction => ({
  type: UPDATE_SUBTASK_REQUEST,
  payload,
});
export const updateSubtaskSuccess = (taskId: string, subtask: Subtask): UpdateSubtaskSuccessAction => ({
  type: UPDATE_SUBTASK_SUCCESS,
  payload: { taskId, subtask },
});
export const updateSubtaskFailure = (payload: string): UpdateSubtaskFailureAction => ({
  type: UPDATE_SUBTASK_FAILURE,
  payload,
});

export const deleteSubtaskRequest = (payload: DeleteSubtaskPayload): DeleteSubtaskRequestAction => ({
  type: DELETE_SUBTASK_REQUEST,
  payload,
});
export const deleteSubtaskSuccess = (taskId: string, subtaskId: string): DeleteSubtaskSuccessAction => ({
  type: DELETE_SUBTASK_SUCCESS,
  payload: { taskId, subtaskId },
});
export const deleteSubtaskFailure = (payload: string): DeleteSubtaskFailureAction => ({
  type: DELETE_SUBTASK_FAILURE,
  payload,
});

export const addCommentRequest = (payload: AddCommentPayload): AddCommentRequestAction => ({
  type: ADD_COMMENT_REQUEST,
  payload,
});
export const addCommentSuccess = (taskId: string, comment: Comment): AddCommentSuccessAction => ({
  type: ADD_COMMENT_SUCCESS,
  payload: { taskId, comment },
});
export const addCommentFailure = (payload: string): AddCommentFailureAction => ({
  type: ADD_COMMENT_FAILURE,
  payload,
});

export const openTask = (taskId: string): OpenTaskAction => ({ type: OPEN_TASK, payload: taskId });
export const closeTask = (): CloseTaskAction => ({ type: CLOSE_TASK });

export const openCreateTaskModal = (
  payload: { projectId?: string; status?: TaskStatus } = {},
): OpenCreateTaskModalAction => ({ type: OPEN_CREATE_TASK_MODAL, payload });
export const closeCreateTaskModal = (): CloseCreateTaskModalAction => ({ type: CLOSE_CREATE_TASK_MODAL });
