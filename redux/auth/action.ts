import type { UnknownAction } from "redux";
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT } from "./actionType";
import type { AuthUser, LoginCredentials } from "./type";

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

export interface LogoutAction extends UnknownAction {
  type: typeof LOGOUT;
}

export type AuthAction = LoginRequestAction | LoginSuccessAction | LoginFailureAction | LogoutAction;

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

export const logout = (): LogoutAction => ({ type: LOGOUT });
