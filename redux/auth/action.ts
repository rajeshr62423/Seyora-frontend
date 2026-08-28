import type { UnknownAction } from "redux";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_VIA_INVITATION_FAILURE,
  REGISTER_VIA_INVITATION_REQUEST,
  REGISTER_VIA_INVITATION_SUCCESS,
  REMOVE_AVATAR_FAILURE,
  REMOVE_AVATAR_REQUEST,
  REMOVE_AVATAR_SUCCESS,
  RESTORE_SESSION_FAILURE,
  RESTORE_SESSION_REQUEST,
  RESTORE_SESSION_SUCCESS,
  UPLOAD_AVATAR_FAILURE,
  UPLOAD_AVATAR_REQUEST,
  UPLOAD_AVATAR_SUCCESS,
} from "./actionType";
import type {
  AuthUser,
  LoginCredentials,
  RegisterInput,
  RegisterViaInvitationInput,
} from "./type";

export interface LoginRequestAction extends UnknownAction {
  type: typeof LOGIN_REQUEST;
  payload: LoginCredentials;
}

export interface LoginSuccessAction extends UnknownAction {
  type: typeof LOGIN_SUCCESS;
  payload: AuthUser;
}

export interface LoginFailureAction extends UnknownAction {
  type: typeof LOGIN_FAILURE;
  payload: string;
}

export interface RegisterRequestAction extends UnknownAction {
  type: typeof REGISTER_REQUEST;
  payload: RegisterInput;
}

export interface RegisterSuccessAction extends UnknownAction {
  type: typeof REGISTER_SUCCESS;
  payload: AuthUser;
}

export interface RegisterFailureAction extends UnknownAction {
  type: typeof REGISTER_FAILURE;
  payload: string;
}

export interface RegisterViaInvitationRequestAction extends UnknownAction {
  type: typeof REGISTER_VIA_INVITATION_REQUEST;
  payload: RegisterViaInvitationInput;
}

export interface RegisterViaInvitationSuccessAction extends UnknownAction {
  type: typeof REGISTER_VIA_INVITATION_SUCCESS;
  payload: AuthUser;
}

export interface RegisterViaInvitationFailureAction extends UnknownAction {
  type: typeof REGISTER_VIA_INVITATION_FAILURE;
  payload: string;
}

export interface RestoreSessionRequestAction extends UnknownAction {
  type: typeof RESTORE_SESSION_REQUEST;
}

export interface RestoreSessionSuccessAction extends UnknownAction {
  type: typeof RESTORE_SESSION_SUCCESS;
  payload: AuthUser;
}

export interface RestoreSessionFailureAction extends UnknownAction {
  type: typeof RESTORE_SESSION_FAILURE;
}

export interface LogoutAction extends UnknownAction {
  type: typeof LOGOUT;
}

export interface UploadAvatarRequestAction extends UnknownAction {
  type: typeof UPLOAD_AVATAR_REQUEST;
  payload: File;
}

export interface UploadAvatarSuccessAction extends UnknownAction {
  type: typeof UPLOAD_AVATAR_SUCCESS;
  payload: AuthUser;
}

export interface UploadAvatarFailureAction extends UnknownAction {
  type: typeof UPLOAD_AVATAR_FAILURE;
  payload: string;
}

export interface RemoveAvatarRequestAction extends UnknownAction {
  type: typeof REMOVE_AVATAR_REQUEST;
}

export interface RemoveAvatarSuccessAction extends UnknownAction {
  type: typeof REMOVE_AVATAR_SUCCESS;
  payload: AuthUser;
}

export interface RemoveAvatarFailureAction extends UnknownAction {
  type: typeof REMOVE_AVATAR_FAILURE;
  payload: string;
}

export type AuthAction =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | RegisterRequestAction
  | RegisterSuccessAction
  | RegisterFailureAction
  | RegisterViaInvitationRequestAction
  | RegisterViaInvitationSuccessAction
  | RegisterViaInvitationFailureAction
  | RestoreSessionRequestAction
  | RestoreSessionSuccessAction
  | RestoreSessionFailureAction
  | LogoutAction
  | UploadAvatarRequestAction
  | UploadAvatarSuccessAction
  | UploadAvatarFailureAction
  | RemoveAvatarRequestAction
  | RemoveAvatarSuccessAction
  | RemoveAvatarFailureAction;

export const loginRequest = (payload: LoginCredentials): LoginRequestAction => ({
  type: LOGIN_REQUEST,
  payload,
});

export const loginSuccess = (payload: AuthUser): LoginSuccessAction => ({
  type: LOGIN_SUCCESS,
  payload,
});

export const loginFailure = (payload: string): LoginFailureAction => ({
  type: LOGIN_FAILURE,
  payload,
});

export const registerRequest = (payload: RegisterInput): RegisterRequestAction => ({
  type: REGISTER_REQUEST,
  payload,
});

export const registerSuccess = (payload: AuthUser): RegisterSuccessAction => ({
  type: REGISTER_SUCCESS,
  payload,
});

export const registerFailure = (payload: string): RegisterFailureAction => ({
  type: REGISTER_FAILURE,
  payload,
});

export const registerViaInvitationRequest = (
  payload: RegisterViaInvitationInput,
): RegisterViaInvitationRequestAction => ({
  type: REGISTER_VIA_INVITATION_REQUEST,
  payload,
});

export const registerViaInvitationSuccess = (
  payload: AuthUser,
): RegisterViaInvitationSuccessAction => ({
  type: REGISTER_VIA_INVITATION_SUCCESS,
  payload,
});

export const registerViaInvitationFailure = (
  payload: string,
): RegisterViaInvitationFailureAction => ({
  type: REGISTER_VIA_INVITATION_FAILURE,
  payload,
});

export const restoreSessionRequest = (): RestoreSessionRequestAction => ({
  type: RESTORE_SESSION_REQUEST,
});

export const restoreSessionSuccess = (payload: AuthUser): RestoreSessionSuccessAction => ({
  type: RESTORE_SESSION_SUCCESS,
  payload,
});

export const restoreSessionFailure = (): RestoreSessionFailureAction => ({
  type: RESTORE_SESSION_FAILURE,
});

export const logout = (): LogoutAction => ({ type: LOGOUT });

export const uploadAvatarRequest = (payload: File): UploadAvatarRequestAction => ({
  type: UPLOAD_AVATAR_REQUEST,
  payload,
});

export const uploadAvatarSuccess = (payload: AuthUser): UploadAvatarSuccessAction => ({
  type: UPLOAD_AVATAR_SUCCESS,
  payload,
});

export const uploadAvatarFailure = (payload: string): UploadAvatarFailureAction => ({
  type: UPLOAD_AVATAR_FAILURE,
  payload,
});

export const removeAvatarRequest = (): RemoveAvatarRequestAction => ({
  type: REMOVE_AVATAR_REQUEST,
});

export const removeAvatarSuccess = (payload: AuthUser): RemoveAvatarSuccessAction => ({
  type: REMOVE_AVATAR_SUCCESS,
  payload,
});

export const removeAvatarFailure = (payload: string): RemoveAvatarFailureAction => ({
  type: REMOVE_AVATAR_FAILURE,
  payload,
});
