import { call, put, takeLatest } from "redux-saga/effects";
import {
  loginRequest as loginApi,
  meRequest as meApi,
  registerRequest as registerApi,
  type AuthResponse,
  type AuthUser as ApiAuthUser,
} from "@/lib/api/auth";
import { registerViaInvitation as registerViaInvitationApi } from "@/lib/api/invitations";
import { clearRememberedEmail, setRememberedEmail } from "@/lib/api/remembered-email";
import { clearTokens, getAccessToken, setTokens } from "@/lib/api/token-storage";
import { removeAvatar as removeAvatarApi, uploadAvatar as uploadAvatarApi } from "@/lib/api/users";
import type { User } from "@/types/user";
import {
  loginFailure,
  loginSuccess,
  registerFailure,
  registerSuccess,
  registerViaInvitationFailure,
  registerViaInvitationSuccess,
  removeAvatarFailure,
  removeAvatarSuccess,
  restoreSessionFailure,
  restoreSessionSuccess,
  uploadAvatarFailure,
  uploadAvatarSuccess,
  type LoginRequestAction,
  type RegisterRequestAction,
  type RegisterViaInvitationRequestAction,
  type UploadAvatarRequestAction,
} from "./action";
import {
  LOGIN_REQUEST,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_VIA_INVITATION_REQUEST,
  REMOVE_AVATAR_REQUEST,
  RESTORE_SESSION_REQUEST,
  UPLOAD_AVATAR_REQUEST,
} from "./actionType";

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

function* handleRegisterViaInvitation(action: RegisterViaInvitationRequestAction) {
  try {
    const { token, ...input } = action.payload;
    const response: AuthResponse = yield call(registerViaInvitationApi, token, input);
    setTokens(response);
    yield put(registerViaInvitationSuccess(response.user));
  } catch (error) {
    yield put(
      registerViaInvitationFailure(
        error instanceof Error ? error.message : "Unable to create account",
      ),
    );
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

function* handleUploadAvatar(action: UploadAvatarRequestAction) {
  try {
    const user: User = yield call(uploadAvatarApi, action.payload);
    yield put(uploadAvatarSuccess(user));
  } catch (error) {
    yield put(uploadAvatarFailure(error instanceof Error ? error.message : "Unable to upload photo"));
  }
}

function* handleRemoveAvatar() {
  try {
    const user: User = yield call(removeAvatarApi);
    yield put(removeAvatarSuccess(user));
  } catch (error) {
    yield put(removeAvatarFailure(error instanceof Error ? error.message : "Unable to remove photo"));
  }
}

export function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, handleLogin);
  yield takeLatest(REGISTER_REQUEST, handleRegister);
  yield takeLatest(REGISTER_VIA_INVITATION_REQUEST, handleRegisterViaInvitation);
  yield takeLatest(RESTORE_SESSION_REQUEST, handleRestoreSession);
  yield takeLatest(LOGOUT, handleLogout);
  yield takeLatest(UPLOAD_AVATAR_REQUEST, handleUploadAvatar);
  yield takeLatest(REMOVE_AVATAR_REQUEST, handleRemoveAvatar);
}
