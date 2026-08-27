import type { UnknownAction } from "redux";
import type { AnalyticsOverview, AnalyticsRange, TeamPerformanceRow } from "@/lib/api/analytics";
import {
  FETCH_OVERVIEW_FAILURE,
  FETCH_OVERVIEW_REQUEST,
  FETCH_OVERVIEW_SUCCESS,
  FETCH_TEAM_PERFORMANCE_FAILURE,
  FETCH_TEAM_PERFORMANCE_REQUEST,
  FETCH_TEAM_PERFORMANCE_SUCCESS,
} from "./actionType";

export interface FetchOverviewRequestAction extends UnknownAction {
  type: typeof FETCH_OVERVIEW_REQUEST;
  payload: AnalyticsRange;
}
export interface FetchOverviewSuccessAction extends UnknownAction {
  type: typeof FETCH_OVERVIEW_SUCCESS;
  payload: AnalyticsOverview;
}
export interface FetchOverviewFailureAction extends UnknownAction {
  type: typeof FETCH_OVERVIEW_FAILURE;
  payload: string;
}

export interface FetchTeamPerformanceRequestAction extends UnknownAction {
  type: typeof FETCH_TEAM_PERFORMANCE_REQUEST;
}
export interface FetchTeamPerformanceSuccessAction extends UnknownAction {
  type: typeof FETCH_TEAM_PERFORMANCE_SUCCESS;
  payload: TeamPerformanceRow[];
}
export interface FetchTeamPerformanceFailureAction extends UnknownAction {
  type: typeof FETCH_TEAM_PERFORMANCE_FAILURE;
  payload: string;
}

export type AnalyticsAction =
  | FetchOverviewRequestAction
  | FetchOverviewSuccessAction
  | FetchOverviewFailureAction
  | FetchTeamPerformanceRequestAction
  | FetchTeamPerformanceSuccessAction
  | FetchTeamPerformanceFailureAction;

export const fetchOverviewRequest = (range: AnalyticsRange): FetchOverviewRequestAction => ({
  type: FETCH_OVERVIEW_REQUEST,
  payload: range,
});
export const fetchOverviewSuccess = (payload: AnalyticsOverview): FetchOverviewSuccessAction => ({
  type: FETCH_OVERVIEW_SUCCESS,
  payload,
});
export const fetchOverviewFailure = (payload: string): FetchOverviewFailureAction => ({
  type: FETCH_OVERVIEW_FAILURE,
  payload,
});

export const fetchTeamPerformanceRequest = (): FetchTeamPerformanceRequestAction => ({
  type: FETCH_TEAM_PERFORMANCE_REQUEST,
});
export const fetchTeamPerformanceSuccess = (payload: TeamPerformanceRow[]): FetchTeamPerformanceSuccessAction => ({
  type: FETCH_TEAM_PERFORMANCE_SUCCESS,
  payload,
});
export const fetchTeamPerformanceFailure = (payload: string): FetchTeamPerformanceFailureAction => ({
  type: FETCH_TEAM_PERFORMANCE_FAILURE,
  payload,
});
