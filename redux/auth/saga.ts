import { call, put, takeLatest } from "redux-saga/effects";
import { loginFailure, loginSuccess, type LoginRequestAction } from "./action";
import { LOGIN_REQUEST } from "./actionType";
import type { AuthUser, LoginCredentials } from "./type";

// Mock authentication API. Swap this out for a real endpoint later without
// touching the reducer or any component.
function requestLogin(credentials: LoginCredentials): Promise<AuthUser> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!credentials.email) {
        reject(new Error("Email is required"));
        return;
      }
      resolve({
        id: "u1",
        name: "John Anderson",
        email: credentials.email,
        role: "Senior Developer",
        initials: "JA",
      });
    }, 400);
  });
}

function* handleLogin(action: LoginRequestAction) {
  try {
    const user: AuthUser = yield call(requestLogin, action.payload);
    yield put(loginSuccess(user));
  } catch (error) {
    yield put(loginFailure(error instanceof Error ? error.message : "Unable to sign in"));
  }
}

export function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, handleLogin);
}
