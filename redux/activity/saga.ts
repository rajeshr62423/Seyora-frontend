import { call, put, takeLatest } from "redux-saga/effects";
import { listActivity, type ActivityPage } from "@/lib/api/activity";
import { fetchActivityFailure, fetchActivitySuccess } from "./action";
import { FETCH_ACTIVITY_REQUEST } from "./actionType";

const BOOTSTRAP_PAGE_SIZE = 100;

function* handleFetchActivity() {
  try {
    const result: ActivityPage = yield call(listActivity, { pageSize: BOOTSTRAP_PAGE_SIZE });
    yield put(fetchActivitySuccess(result));
  } catch (error) {
    yield put(fetchActivityFailure(error instanceof Error ? error.message : "Unable to load activity"));
  }
}

export function* activitySaga() {
  yield takeLatest(FETCH_ACTIVITY_REQUEST, handleFetchActivity);
}
