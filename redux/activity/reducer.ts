import type { UnknownAction } from "redux";
import type { AppAction } from "../action";
import {
  FETCH_ACTIVITY_FAILURE,
  FETCH_ACTIVITY_REQUEST,
  FETCH_ACTIVITY_SUCCESS,
  FETCH_MORE_ACTIVITY_FAILURE,
  FETCH_MORE_ACTIVITY_REQUEST,
  FETCH_MORE_ACTIVITY_SUCCESS,
  FETCH_TASK_ACTIVITY_FAILURE,
  FETCH_TASK_ACTIVITY_REQUEST,
  FETCH_TASK_ACTIVITY_SUCCESS,
} from "./actionType";
import type { ActivityState } from "./type";

const initialState: ActivityState = {
  items: [],
  page: 1,
  pageSize: 0,
  total: 0,
  loading: false,
  error: null,
  loadingMore: false,
  loadMoreError: null,

  taskActivityItems: [],
  taskActivityTaskId: null,
  taskActivityLoading: false,
  taskActivityError: null,
};

export function activityReducer(state: ActivityState = initialState, rawAction: UnknownAction): ActivityState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case FETCH_ACTIVITY_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_ACTIVITY_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        page: action.payload.page,
        pageSize: action.payload.pageSize,
        total: action.payload.total,
      };
    case FETCH_ACTIVITY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_MORE_ACTIVITY_REQUEST:
      return { ...state, loadingMore: true, loadMoreError: null };
    case FETCH_MORE_ACTIVITY_SUCCESS:
      return {
        ...state,
        loadingMore: false,
        items: [...state.items, ...action.payload.items],
        page: action.payload.page,
        pageSize: action.payload.pageSize,
        total: action.payload.total,
      };
    case FETCH_MORE_ACTIVITY_FAILURE:
      return { ...state, loadingMore: false, loadMoreError: action.payload };

    case FETCH_TASK_ACTIVITY_REQUEST:
      return { ...state, taskActivityLoading: true, taskActivityError: null };
    case FETCH_TASK_ACTIVITY_SUCCESS:
      return {
        ...state,
        taskActivityLoading: false,
        taskActivityItems: action.payload.items,
        taskActivityTaskId: action.payload.taskId,
      };
    case FETCH_TASK_ACTIVITY_FAILURE:
      return { ...state, taskActivityLoading: false, taskActivityError: action.payload };

    default:
      return state;
  }
}
