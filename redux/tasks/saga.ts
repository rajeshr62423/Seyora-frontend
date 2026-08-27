import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  addComment as addCommentApi,
  addSubtask as addSubtaskApi,
  createTask as createTaskApi,
  deleteSubtask as deleteSubtaskApi,
  getMyTasks as getMyTasksApi,
  listTasksForProject as listTasksForProjectApi,
  updateSubtask as updateSubtaskApi,
  updateTask as updateTaskApi,
} from "@/lib/api/tasks";
import type { Comment, Subtask, Task } from "@/types/task";
import {
  addCommentFailure,
  addCommentSuccess,
  addSubtaskFailure,
  addSubtaskSuccess,
  createTaskFailure,
  createTaskSuccess,
  deleteSubtaskFailure,
  deleteSubtaskSuccess,
  fetchMyTasksFailure,
  fetchMyTasksSuccess,
  fetchProjectTasksFailure,
  fetchProjectTasksSuccess,
  updateSubtaskFailure,
  updateSubtaskSuccess,
  updateTaskFailure,
  updateTaskSuccess,
  type AddCommentRequestAction,
  type AddSubtaskRequestAction,
  type CreateTaskRequestAction,
  type DeleteSubtaskRequestAction,
  type FetchProjectTasksRequestAction,
  type UpdateSubtaskRequestAction,
  type UpdateTaskRequestAction,
} from "./action";
import {
  ADD_COMMENT_REQUEST,
  ADD_SUBTASK_REQUEST,
  CREATE_TASK_REQUEST,
  DELETE_SUBTASK_REQUEST,
  FETCH_MY_TASKS_REQUEST,
  FETCH_PROJECT_TASKS_REQUEST,
  UPDATE_SUBTASK_REQUEST,
  UPDATE_TASK_REQUEST,
} from "./actionType";

function* handleFetchProjectTasks(action: FetchProjectTasksRequestAction) {
  try {
    const tasks: Task[] = yield call(listTasksForProjectApi, action.payload.projectId);
    yield put(fetchProjectTasksSuccess(action.payload.projectId, tasks));
  } catch (error) {
    yield put(fetchProjectTasksFailure(error instanceof Error ? error.message : "Unable to load tasks"));
  }
}

function* handleFetchMyTasks() {
  try {
    const tasks: Task[] = yield call(getMyTasksApi);
    yield put(fetchMyTasksSuccess(tasks));
  } catch (error) {
    yield put(fetchMyTasksFailure(error instanceof Error ? error.message : "Unable to load your tasks"));
  }
}

function* handleCreateTask(action: CreateTaskRequestAction) {
  try {
    const { projectId, values, status } = action.payload;
    const task: Task = yield call(createTaskApi, projectId, {
      title: values.title,
      description: values.description,
      status,
      priority: values.priority,
      assigneeId: values.assigneeId ? Number(values.assigneeId) : undefined,
      dueDate: values.dueDate,
    });
    yield put(createTaskSuccess(task));
  } catch (error) {
    yield put(createTaskFailure(error instanceof Error ? error.message : "Unable to create task"));
  }
}

// takeEvery — a deliberate deviation from this codebase's usual takeLatest.
// Multiple task updates can be genuinely concurrent (rapid kanban drags on
// different cards); takeLatest would cancel an earlier card's in-flight
// PATCH as soon as a second one fires, silently reverting it.
function* handleUpdateTask(action: UpdateTaskRequestAction) {
  try {
    const { id, values } = action.payload;
    const task: Task = yield call(updateTaskApi, id, {
      ...values,
      assigneeId: values.assigneeId === null ? null : values.assigneeId ? Number(values.assigneeId) : undefined,
    });
    yield put(updateTaskSuccess(task));
  } catch (error) {
    yield put(updateTaskFailure(action.payload.id, error instanceof Error ? error.message : "Unable to update task"));
  }
}

function* handleAddSubtask(action: AddSubtaskRequestAction) {
  try {
    const { taskId, title } = action.payload;
    const subtask: Subtask = yield call(addSubtaskApi, taskId, title);
    yield put(addSubtaskSuccess(taskId, subtask));
  } catch (error) {
    yield put(addSubtaskFailure(error instanceof Error ? error.message : "Unable to add subtask"));
  }
}

function* handleUpdateSubtask(action: UpdateSubtaskRequestAction) {
  try {
    const { taskId, subtaskId, values } = action.payload;
    const subtask: Subtask = yield call(updateSubtaskApi, taskId, subtaskId, values);
    yield put(updateSubtaskSuccess(taskId, subtask));
  } catch (error) {
    yield put(updateSubtaskFailure(error instanceof Error ? error.message : "Unable to update subtask"));
  }
}

function* handleDeleteSubtask(action: DeleteSubtaskRequestAction) {
  try {
    const { taskId, subtaskId } = action.payload;
    yield call(deleteSubtaskApi, taskId, subtaskId);
    yield put(deleteSubtaskSuccess(taskId, subtaskId));
  } catch (error) {
    yield put(deleteSubtaskFailure(error instanceof Error ? error.message : "Unable to remove subtask"));
  }
}

function* handleAddComment(action: AddCommentRequestAction) {
  try {
    const { taskId, body } = action.payload;
    const comment: Comment = yield call(addCommentApi, taskId, body);
    yield put(addCommentSuccess(taskId, comment));
  } catch (error) {
    yield put(addCommentFailure(error instanceof Error ? error.message : "Unable to add comment"));
  }
}

export function* tasksSaga() {
  yield takeLatest(FETCH_PROJECT_TASKS_REQUEST, handleFetchProjectTasks);
  yield takeLatest(FETCH_MY_TASKS_REQUEST, handleFetchMyTasks);
  yield takeLatest(CREATE_TASK_REQUEST, handleCreateTask);
  yield takeEvery(UPDATE_TASK_REQUEST, handleUpdateTask);
  yield takeEvery(ADD_SUBTASK_REQUEST, handleAddSubtask);
  yield takeEvery(UPDATE_SUBTASK_REQUEST, handleUpdateSubtask);
  yield takeEvery(DELETE_SUBTASK_REQUEST, handleDeleteSubtask);
  yield takeEvery(ADD_COMMENT_REQUEST, handleAddComment);
}
