import type { UnknownAction } from "redux";
import type { NotificationEntry } from "@/types/notification";
import {
  FETCH_NOTIFICATIONS_FAILURE,
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  MARK_ALL_READ_FAILURE,
  MARK_ALL_READ_REQUEST,
  MARK_ALL_READ_SUCCESS,
  MARK_READ_FAILURE,
  MARK_READ_REQUEST,
  MARK_READ_SUCCESS,
} from "./actionType";

export interface FetchNotificationsRequestAction extends UnknownAction {
  type: typeof FETCH_NOTIFICATIONS_REQUEST;
}
export interface FetchNotificationsSuccessAction extends UnknownAction {
  type: typeof FETCH_NOTIFICATIONS_SUCCESS;
  payload: NotificationEntry[];
}
export interface FetchNotificationsFailureAction extends UnknownAction {
  type: typeof FETCH_NOTIFICATIONS_FAILURE;
  payload: string;
}

export interface MarkReadRequestAction extends UnknownAction {
  type: typeof MARK_READ_REQUEST;
  payload: string;
}
export interface MarkReadSuccessAction extends UnknownAction {
  type: typeof MARK_READ_SUCCESS;
  payload: NotificationEntry;
}
export interface MarkReadFailureAction extends UnknownAction {
  type: typeof MARK_READ_FAILURE;
  payload: { id: string; message: string };
}

export interface MarkAllReadRequestAction extends UnknownAction {
  type: typeof MARK_ALL_READ_REQUEST;
}
export interface MarkAllReadSuccessAction extends UnknownAction {
  type: typeof MARK_ALL_READ_SUCCESS;
}
export interface MarkAllReadFailureAction extends UnknownAction {
  type: typeof MARK_ALL_READ_FAILURE;
  payload: string;
}

export type NotificationsAction =
  | FetchNotificationsRequestAction
  | FetchNotificationsSuccessAction
  | FetchNotificationsFailureAction
  | MarkReadRequestAction
  | MarkReadSuccessAction
  | MarkReadFailureAction
  | MarkAllReadRequestAction
  | MarkAllReadSuccessAction
  | MarkAllReadFailureAction;

export const fetchNotificationsRequest = (): FetchNotificationsRequestAction => ({
  type: FETCH_NOTIFICATIONS_REQUEST,
});
export const fetchNotificationsSuccess = (payload: NotificationEntry[]): FetchNotificationsSuccessAction => ({
  type: FETCH_NOTIFICATIONS_SUCCESS,
  payload,
});
export const fetchNotificationsFailure = (payload: string): FetchNotificationsFailureAction => ({
  type: FETCH_NOTIFICATIONS_FAILURE,
  payload,
});

export const markReadRequest = (id: string): MarkReadRequestAction => ({ type: MARK_READ_REQUEST, payload: id });
export const markReadSuccess = (payload: NotificationEntry): MarkReadSuccessAction => ({
  type: MARK_READ_SUCCESS,
  payload,
});
export const markReadFailure = (id: string, message: string): MarkReadFailureAction => ({
  type: MARK_READ_FAILURE,
  payload: { id, message },
});

export const markAllReadRequest = (): MarkAllReadRequestAction => ({ type: MARK_ALL_READ_REQUEST });
export const markAllReadSuccess = (): MarkAllReadSuccessAction => ({ type: MARK_ALL_READ_SUCCESS });
export const markAllReadFailure = (payload: string): MarkAllReadFailureAction => ({
  type: MARK_ALL_READ_FAILURE,
  payload,
});
