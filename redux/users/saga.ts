import { call, put, takeLatest } from "redux-saga/effects";
import { users as mockUsers } from "@/lib/data/users";
import type { User } from "@/types/user";
import { fetchUsersFailure, fetchUsersSuccess } from "./action";
import { FETCH_USERS_REQUEST } from "./actionType";

// Mock users API. Replace with a real fetch() call later; the saga contract
// (request -> success/failure) stays the same for the rest of the app.
function requestUsers(): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUsers), 300);
  });
}

function* handleFetchUsers() {
  try {
    const list: User[] = yield call(requestUsers);
    yield put(fetchUsersSuccess(list));
  } catch (error) {
    yield put(fetchUsersFailure(error instanceof Error ? error.message : "Unable to load users"));
  }
}

export function* usersSaga() {
  yield takeLatest(FETCH_USERS_REQUEST, handleFetchUsers);
}
