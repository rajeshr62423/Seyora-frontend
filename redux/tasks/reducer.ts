import type { UnknownAction } from "redux";
import type { Task } from "@/types/task";
import type { AppAction } from "../action";
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
import type { TasksState } from "./type";

const initialState: TasksState = {
  projectTasks: [],
  projectTasksProjectId: null,
  projectTasksLoading: false,
  projectTasksError: null,

  myTasks: [],
  myTasksLoading: false,
  myTasksError: null,

  creating: false,
  createError: null,
  createTaskContext: null,

  updatingTaskIds: [],
  updateError: null,

  subtaskSaving: false,
  subtaskError: null,
  commentSending: false,
  commentError: null,

  selectedTaskId: null,
};

// A task can be present in both `projectTasks` and `myTasks` at once
// (assigned-to-me task in the currently-viewed project). Every mutation
// patches whichever array(s) currently hold a matching id, rather than a
// full normalized store — two flat arrays don't warrant that machinery.
function patchTaskInLists(state: TasksState, taskId: string, updater: (task: Task) => Task): Partial<TasksState> {
  return {
    projectTasks: state.projectTasks.map((t) => (t.id === taskId ? updater(t) : t)),
    myTasks: state.myTasks.map((t) => (t.id === taskId ? updater(t) : t)),
  };
}

export function tasksReducer(state: TasksState = initialState, rawAction: UnknownAction): TasksState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case FETCH_PROJECT_TASKS_REQUEST:
      return { ...state, projectTasksLoading: true, projectTasksError: null };
    case FETCH_PROJECT_TASKS_SUCCESS:
      return {
        ...state,
        projectTasksLoading: false,
        projectTasksProjectId: action.payload.projectId,
        projectTasks: action.payload.tasks,
      };
    case FETCH_PROJECT_TASKS_FAILURE:
      return { ...state, projectTasksLoading: false, projectTasksError: action.payload };

    case FETCH_MY_TASKS_REQUEST:
      return { ...state, myTasksLoading: true, myTasksError: null };
    case FETCH_MY_TASKS_SUCCESS:
      return { ...state, myTasksLoading: false, myTasks: action.payload };
    case FETCH_MY_TASKS_FAILURE:
      return { ...state, myTasksLoading: false, myTasksError: action.payload };

    case CREATE_TASK_REQUEST:
      return { ...state, creating: true, createError: null };
    case CREATE_TASK_SUCCESS: {
      const task = action.payload;
      const inCurrentProject = task.projectId === state.projectTasksProjectId;
      // Not patched into `myTasks` here — whether the new task belongs
      // there depends on its assignee, which the reducer can't compare
      // against the current user (that's a different slice). My Tasks
      // picks it up on its next natural fetch.
      return {
        ...state,
        creating: false,
        projectTasks: inCurrentProject ? [task, ...state.projectTasks] : state.projectTasks,
      };
    }
    case CREATE_TASK_FAILURE:
      return { ...state, creating: false, createError: action.payload };

    case UPDATE_TASK_REQUEST: {
      const { id, values } = action.payload;
      // Optimistic patch: apply scalar fields immediately so the kanban
      // card moves on drop without waiting for the round trip. Skip
      // assigneeId — we only have the id, not a full User to render.
      const optimistic = patchTaskInLists(state, id, (task) => ({
        ...task,
        ...(values.title !== undefined && { title: values.title }),
        ...(values.description !== undefined && { description: values.description }),
        ...(values.status !== undefined && { status: values.status }),
        ...(values.priority !== undefined && { priority: values.priority }),
        ...(values.dueDate !== undefined && { dueDate: values.dueDate }),
      }));
      return {
        ...state,
        ...optimistic,
        updatingTaskIds: [...state.updatingTaskIds, id],
        updateError: null,
      };
    }
    case UPDATE_TASK_SUCCESS: {
      const task = action.payload;
      const patch = patchTaskInLists(state, task.id, () => task);
      return {
        ...state,
        ...patch,
        updatingTaskIds: state.updatingTaskIds.filter((id) => id !== task.id),
      };
    }
    case UPDATE_TASK_FAILURE:
      return {
        ...state,
        updatingTaskIds: state.updatingTaskIds.filter((id) => id !== action.payload.taskId),
        updateError: action.payload.message,
      };

    case ADD_SUBTASK_REQUEST:
      return { ...state, subtaskSaving: true, subtaskError: null };
    case ADD_SUBTASK_SUCCESS: {
      const { taskId, subtask } = action.payload;
      const patch = patchTaskInLists(state, taskId, (task) => ({ ...task, subtasks: [...task.subtasks, subtask] }));
      return { ...state, ...patch, subtaskSaving: false };
    }
    case ADD_SUBTASK_FAILURE:
      return { ...state, subtaskSaving: false, subtaskError: action.payload };

    case UPDATE_SUBTASK_REQUEST:
      return { ...state, subtaskSaving: true, subtaskError: null };
    case UPDATE_SUBTASK_SUCCESS: {
      const { taskId, subtask } = action.payload;
      const patch = patchTaskInLists(state, taskId, (task) => ({
        ...task,
        subtasks: task.subtasks.map((s) => (s.id === subtask.id ? subtask : s)),
      }));
      return { ...state, ...patch, subtaskSaving: false };
    }
    case UPDATE_SUBTASK_FAILURE:
      return { ...state, subtaskSaving: false, subtaskError: action.payload };

    case DELETE_SUBTASK_REQUEST:
      return { ...state, subtaskSaving: true, subtaskError: null };
    case DELETE_SUBTASK_SUCCESS: {
      const { taskId, subtaskId } = action.payload;
      const patch = patchTaskInLists(state, taskId, (task) => ({
        ...task,
        subtasks: task.subtasks.filter((s) => s.id !== subtaskId),
      }));
      return { ...state, ...patch, subtaskSaving: false };
    }
    case DELETE_SUBTASK_FAILURE:
      return { ...state, subtaskSaving: false, subtaskError: action.payload };

    case ADD_COMMENT_REQUEST:
      return { ...state, commentSending: true, commentError: null };
    case ADD_COMMENT_SUCCESS: {
      const { taskId, comment } = action.payload;
      const patch = patchTaskInLists(state, taskId, (task) => ({ ...task, comments: [...task.comments, comment] }));
      return { ...state, ...patch, commentSending: false };
    }
    case ADD_COMMENT_FAILURE:
      return { ...state, commentSending: false, commentError: action.payload };

    case OPEN_TASK:
      return { ...state, selectedTaskId: action.payload };
    case CLOSE_TASK:
      return { ...state, selectedTaskId: null };

    case OPEN_CREATE_TASK_MODAL:
      return { ...state, createTaskContext: action.payload, createError: null };
    case CLOSE_CREATE_TASK_MODAL:
      return { ...state, createTaskContext: null };

    default:
      return state;
  }
}
