import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  listNotifications,
  markAllNotificationsRead as markAllNotificationsReadApi,
  markNotificationRead as markNotificationReadApi,
} from "@/lib/api/notifications";
import type { NotificationEntry } from "@/types/notification";
import {
  fetchNotificationsFailure,
  fetchNotificationsSuccess,
  markAllReadFailure,
  markAllReadSuccess,
  markReadFailure,
  markReadSuccess,
  type MarkReadRequestAction,
} from "./action";
import {
  FETCH_NOTIFICATIONS_REQUEST,
  MARK_ALL_READ_REQUEST,
  MARK_READ_REQUEST,
} from "./actionType";

function* handleFetchNotifications() {
  try {
    const list: NotificationEntry[] = yield call(listNotifications);
    yield put(fetchNotificationsSuccess(list));
  } catch (error) {
    yield put(fetchNotificationsFailure(error instanceof Error ? error.message : "Unable to load notifications"));
  }
}

// takeEvery — rapid mark-read clicks on different rows shouldn't cancel
// each other's in-flight PATCH, same reasoning as tasks/saga.ts.
function* handleMarkRead(action: MarkReadRequestAction) {
  try {
    const notification: NotificationEntry = yield call(markNotificationReadApi, action.payload);
    yield put(markReadSuccess(notification));
  } catch (error) {
    yield put(markReadFailure(action.payload, error instanceof Error ? error.message : "Unable to mark as read"));
  }
}

function* handleMarkAllRead() {
  try {
    yield call(markAllNotificationsReadApi);
    yield put(markAllReadSuccess());
  } catch (error) {
    yield put(markAllReadFailure(error instanceof Error ? error.message : "Unable to mark all as read"));
  }
}

export function* notificationsSaga() {
  yield takeLatest(FETCH_NOTIFICATIONS_REQUEST, handleFetchNotifications);
  yield takeEvery(MARK_READ_REQUEST, handleMarkRead);
  yield takeEvery(MARK_ALL_READ_REQUEST, handleMarkAllRead);
}
