import { call, put, takeLatest } from "redux-saga/effects";
import {
  loginRequest as loginApi,
  meRequest as meApi,
  registerRequest as registerApi,
  type AuthResponse,
  type AuthUser as ApiAuthUser,
} from "@/lib/api/auth";
import { clearRememberedEmail, setRememberedEmail } from "@/lib/api/remembered-email";
import { clearTokens, getAccessToken, setTokens } from "@/lib/api/token-storage";
import {
  loginFailure,
  loginSuccess,
  registerFailure,
  registerSuccess,
  restoreSessionFailure,
  restoreSessionSuccess,
  type LoginRequestAction,
  type RegisterRequestAction,
} from "./action";
import { LOGIN_REQUEST, LOGOUT, REGISTER_REQUEST, RESTORE_SESSION_REQUEST } from "./actionType";

function* handleLogin(action: LoginRequestAction) {
  try {
    const { email, password, remember } = action.payload;
    const response: AuthResponse = yield call(loginApi, { email, password });
    setTokens(response, remember ?? true);
    if (remember) {
      setRememberedEmail(email);
    } else {
      clearRememberedEmail();
    }
    yield put(loginSuccess(response.user));
  } catch (error) {
    yield put(loginFailure(error instanceof Error ? error.message : "Unable to sign in"));
  }
}

function* handleRegister(action: RegisterRequestAction) {
  try {
    const response: AuthResponse = yield call(registerApi, action.payload);
    setTokens(response);
    yield put(registerSuccess(response.user));
  } catch (error) {
    yield put(registerFailure(error instanceof Error ? error.message : "Unable to create account"));
  }
}

// Silent background check on app load — never surfaces an error, just
// confirms whether the stored access token still maps to a real session.
function* handleRestoreSession() {
  if (!getAccessToken()) {
    yield put(restoreSessionFailure());
    return;
  }

  try {
    const user: ApiAuthUser = yield call(meApi);
    yield put(restoreSessionSuccess(user));
  } catch {
    clearTokens();
    yield put(restoreSessionFailure());
  }
}

function handleLogout() {
  clearTokens();
}

export function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, handleLogin);
  yield takeLatest(REGISTER_REQUEST, handleRegister);
  yield takeLatest(RESTORE_SESSION_REQUEST, handleRestoreSession);
  yield takeLatest(LOGOUT, handleLogout);
}
