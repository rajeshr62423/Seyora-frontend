import { call, put, takeLatest } from "redux-saga/effects";
import { getOverview, getTeamPerformance, type AnalyticsOverview, type TeamPerformanceRow } from "@/lib/api/analytics";
import {
  fetchOverviewFailure,
  fetchOverviewSuccess,
  fetchTeamPerformanceFailure,
  fetchTeamPerformanceSuccess,
  type FetchOverviewRequestAction,
} from "./action";
import { FETCH_OVERVIEW_REQUEST, FETCH_TEAM_PERFORMANCE_REQUEST } from "./actionType";

function* handleFetchOverview(action: FetchOverviewRequestAction) {
  try {
    const overview: AnalyticsOverview = yield call(getOverview, action.payload);
    yield put(fetchOverviewSuccess(overview));
  } catch (error) {
    yield put(fetchOverviewFailure(error instanceof Error ? error.message : "Unable to load analytics"));
  }
}

function* handleFetchTeamPerformance() {
  try {
    const rows: TeamPerformanceRow[] = yield call(getTeamPerformance);
    yield put(fetchTeamPerformanceSuccess(rows));
  } catch (error) {
    yield put(fetchTeamPerformanceFailure(error instanceof Error ? error.message : "Unable to load team performance"));
  }
}

export function* analyticsSaga() {
  yield takeLatest(FETCH_OVERVIEW_REQUEST, handleFetchOverview);
  yield takeLatest(FETCH_TEAM_PERFORMANCE_REQUEST, handleFetchTeamPerformance);
}
