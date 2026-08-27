import { call, put, takeLatest } from "redux-saga/effects";
import { listUsers } from "@/lib/api/users";
import type { User } from "@/types/user";
import { fetchUsersFailure, fetchUsersSuccess } from "./action";
import { FETCH_USERS_REQUEST } from "./actionType";

function* handleFetchUsers() {
  try {
    const list: User[] = yield call(listUsers);
    yield put(fetchUsersSuccess(list));
  } catch (error) {
    yield put(fetchUsersFailure(error instanceof Error ? error.message : "Unable to load users"));
  }
}

export function* usersSaga() {
  yield takeLatest(FETCH_USERS_REQUEST, handleFetchUsers);
}
