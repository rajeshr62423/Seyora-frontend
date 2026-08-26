import type { UnknownAction } from "redux";
import type { User } from "@/types/user";
import { FETCH_USERS_FAILURE, FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, SELECT_USER } from "./actionType";

export interface FetchUsersRequestAction extends UnknownAction {
  type: typeof FETCH_USERS_REQUEST;
}

export interface FetchUsersSuccessAction extends UnknownAction {
  type: typeof FETCH_USERS_SUCCESS;
  payload: User[];
}

export interface FetchUsersFailureAction extends UnknownAction {
  type: typeof FETCH_USERS_FAILURE;
  payload: string;
}

export interface SelectUserAction extends UnknownAction {
  type: typeof SELECT_USER;
  payload: string | null;
}

export type UsersAction =
  | FetchUsersRequestAction
  | FetchUsersSuccessAction
  | FetchUsersFailureAction
  | SelectUserAction;

export const fetchUsersRequest = (): FetchUsersRequestAction => ({ type: FETCH_USERS_REQUEST });

export const fetchUsersSuccess = (payload: User[]): FetchUsersSuccessAction => ({
  type: FETCH_USERS_SUCCESS,
  payload,
});

export const fetchUsersFailure = (payload: string): FetchUsersFailureAction => ({
  type: FETCH_USERS_FAILURE,
  payload,
});

export const selectUser = (payload: string | null): SelectUserAction => ({
  type: SELECT_USER,
  payload,
});
