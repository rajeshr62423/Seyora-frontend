import type { UnknownAction } from "redux";
import type { ActivityPage } from "@/lib/api/activity";
import type { ActivityEntry } from "@/types/activity";
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

export interface FetchActivityRequestAction extends UnknownAction {
  type: typeof FETCH_ACTIVITY_REQUEST;
}
export interface FetchActivitySuccessAction extends UnknownAction {
  type: typeof FETCH_ACTIVITY_SUCCESS;
  payload: ActivityPage;
}
export interface FetchActivityFailureAction extends UnknownAction {
  type: typeof FETCH_ACTIVITY_FAILURE;
  payload: string;
}

export interface FetchMoreActivityRequestAction extends UnknownAction {
  type: typeof FETCH_MORE_ACTIVITY_REQUEST;
}
export interface FetchMoreActivitySuccessAction extends UnknownAction {
  type: typeof FETCH_MORE_ACTIVITY_SUCCESS;
  payload: ActivityPage;
}
export interface FetchMoreActivityFailureAction extends UnknownAction {
  type: typeof FETCH_MORE_ACTIVITY_FAILURE;
  payload: string;
}

export interface FetchTaskActivityRequestAction extends UnknownAction {
  type: typeof FETCH_TASK_ACTIVITY_REQUEST;
  payload: { taskId: string };
}
export interface FetchTaskActivitySuccessAction extends UnknownAction {
  type: typeof FETCH_TASK_ACTIVITY_SUCCESS;
  payload: { taskId: string; items: ActivityEntry[] };
}
export interface FetchTaskActivityFailureAction extends UnknownAction {
  type: typeof FETCH_TASK_ACTIVITY_FAILURE;
  payload: string;
}

export type ActivityAction =
  | FetchActivityRequestAction
  | FetchActivitySuccessAction
  | FetchActivityFailureAction
  | FetchMoreActivityRequestAction
  | FetchMoreActivitySuccessAction
  | FetchMoreActivityFailureAction
  | FetchTaskActivityRequestAction
  | FetchTaskActivitySuccessAction
  | FetchTaskActivityFailureAction;

export const fetchActivityRequest = (): FetchActivityRequestAction => ({ type: FETCH_ACTIVITY_REQUEST });
export const fetchActivitySuccess = (payload: ActivityPage): FetchActivitySuccessAction => ({
  type: FETCH_ACTIVITY_SUCCESS,
  payload,
});
export const fetchActivityFailure = (payload: string): FetchActivityFailureAction => ({
  type: FETCH_ACTIVITY_FAILURE,
  payload,
});

export const fetchMoreActivityRequest = (): FetchMoreActivityRequestAction => ({
  type: FETCH_MORE_ACTIVITY_REQUEST,
});
export const fetchMoreActivitySuccess = (payload: ActivityPage): FetchMoreActivitySuccessAction => ({
  type: FETCH_MORE_ACTIVITY_SUCCESS,
  payload,
});
export const fetchMoreActivityFailure = (payload: string): FetchMoreActivityFailureAction => ({
  type: FETCH_MORE_ACTIVITY_FAILURE,
  payload,
});

export const fetchTaskActivityRequest = (taskId: string): FetchTaskActivityRequestAction => ({
  type: FETCH_TASK_ACTIVITY_REQUEST,
  payload: { taskId },
});
export const fetchTaskActivitySuccess = (
  taskId: string,
  items: ActivityEntry[],
): FetchTaskActivitySuccessAction => ({
  type: FETCH_TASK_ACTIVITY_SUCCESS,
  payload: { taskId, items },
});
export const fetchTaskActivityFailure = (payload: string): FetchTaskActivityFailureAction => ({
  type: FETCH_TASK_ACTIVITY_FAILURE,
  payload,
});
