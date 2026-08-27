import type { UnknownAction } from "redux";
import type { ActivityPage } from "@/lib/api/activity";
import { FETCH_ACTIVITY_FAILURE, FETCH_ACTIVITY_REQUEST, FETCH_ACTIVITY_SUCCESS } from "./actionType";

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

export type ActivityAction = FetchActivityRequestAction | FetchActivitySuccessAction | FetchActivityFailureAction;

export const fetchActivityRequest = (): FetchActivityRequestAction => ({ type: FETCH_ACTIVITY_REQUEST });
export const fetchActivitySuccess = (payload: ActivityPage): FetchActivitySuccessAction => ({
  type: FETCH_ACTIVITY_SUCCESS,
  payload,
});
export const fetchActivityFailure = (payload: string): FetchActivityFailureAction => ({
  type: FETCH_ACTIVITY_FAILURE,
  payload,
});
