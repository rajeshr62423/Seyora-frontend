import { call, put, select, takeLatest } from "redux-saga/effects";
import { listActivity, type ActivityPage } from "@/lib/api/activity";
import type { RootState } from "../rootReducer";
import {
  fetchActivityFailure,
  fetchActivitySuccess,
  fetchMoreActivityFailure,
  fetchMoreActivitySuccess,
  fetchTaskActivityFailure,
  fetchTaskActivitySuccess,
  type FetchTaskActivityRequestAction,
} from "./action";
import { FETCH_ACTIVITY_REQUEST, FETCH_MORE_ACTIVITY_REQUEST, FETCH_TASK_ACTIVITY_REQUEST } from "./actionType";

const PAGE_SIZE = 20;
const TASK_ACTIVITY_PAGE_SIZE = 50;

function* handleFetchActivity() {
  try {
    const result: ActivityPage = yield call(listActivity, { page: 1, pageSize: PAGE_SIZE });
    yield put(fetchActivitySuccess(result));
  } catch (error) {
    yield put(fetchActivityFailure(error instanceof Error ? error.message : "Unable to load activity"));
  }
}

function* handleFetchMoreActivity() {
  try {
    const { page, pageSize } = (yield select((state: RootState) => state.activity)) as RootState["activity"];
    const result: ActivityPage = yield call(listActivity, { page: page + 1, pageSize });
    yield put(fetchMoreActivitySuccess(result));
  } catch (error) {
    yield put(fetchMoreActivityFailure(error instanceof Error ? error.message : "Unable to load more activity"));
  }
}

function* handleFetchTaskActivity(action: FetchTaskActivityRequestAction) {
  try {
    const { taskId } = action.payload;
    const result: ActivityPage = yield call(listActivity, {
      targetType: "task",
      targetId: Number(taskId),
      pageSize: TASK_ACTIVITY_PAGE_SIZE,
    });
    yield put(fetchTaskActivitySuccess(taskId, result.items));
  } catch (error) {
    yield put(fetchTaskActivityFailure(error instanceof Error ? error.message : "Unable to load activity"));
  }
}

export function* activitySaga() {
  yield takeLatest(FETCH_ACTIVITY_REQUEST, handleFetchActivity);
  yield takeLatest(FETCH_MORE_ACTIVITY_REQUEST, handleFetchMoreActivity);
  yield takeLatest(FETCH_TASK_ACTIVITY_REQUEST, handleFetchTaskActivity);
}
