import type { UnknownAction } from "redux";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  RESTORE_SESSION_FAILURE,
  RESTORE_SESSION_REQUEST,
  RESTORE_SESSION_SUCCESS,
} from "./actionType";
import type { AuthUser, LoginCredentials, RegisterInput } from "./type";

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

export type AuthAction =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | RegisterRequestAction
  | RegisterSuccessAction
  | RegisterFailureAction
  | RestoreSessionRequestAction
  | RestoreSessionSuccessAction
  | RestoreSessionFailureAction
  | LogoutAction;

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
