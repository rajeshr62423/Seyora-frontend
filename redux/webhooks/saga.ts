import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  createWebhook,
  deleteWebhook,
  listWebhooks,
  testWebhook,
  type TestWebhookResult,
} from "@/lib/api/webhooks";
import type { Webhook } from "@/types/webhook";
import {
  createWebhookFailure,
  createWebhookSuccess,
  deleteWebhookFailure,
  deleteWebhookSuccess,
  fetchWebhooksFailure,
  fetchWebhooksSuccess,
  testWebhookFailure,
  testWebhookSuccess,
  type CreateWebhookRequestAction,
  type DeleteWebhookRequestAction,
  type TestWebhookRequestAction,
} from "./action";
import {
  CREATE_WEBHOOK_REQUEST,
  DELETE_WEBHOOK_REQUEST,
  FETCH_WEBHOOKS_REQUEST,
  TEST_WEBHOOK_REQUEST,
} from "./actionType";

function* handleFetchWebhooks() {
  try {
    const webhooks: Webhook[] = yield call(listWebhooks);
    yield put(fetchWebhooksSuccess(webhooks));
  } catch (error) {
    yield put(fetchWebhooksFailure(error instanceof Error ? error.message : "Unable to load webhooks"));
  }
}

function* handleCreateWebhook(action: CreateWebhookRequestAction) {
  try {
    const webhook: Webhook = yield call(createWebhook, action.payload);
    yield put(createWebhookSuccess(webhook));
  } catch (error) {
    yield put(createWebhookFailure(error instanceof Error ? error.message : "Unable to create webhook"));
  }
}

// takeEvery for delete/test — same per-row concurrency reasoning as
// api-keys revoke: acting on different rows shouldn't cancel each other.
function* handleDeleteWebhook(action: DeleteWebhookRequestAction) {
  try {
    yield call(deleteWebhook, action.payload);
    yield put(deleteWebhookSuccess(action.payload));
  } catch (error) {
    yield put(deleteWebhookFailure(action.payload, error instanceof Error ? error.message : "Unable to delete webhook"));
  }
}

function* handleTestWebhook(action: TestWebhookRequestAction) {
  try {
    const result: TestWebhookResult = yield call(testWebhook, action.payload);
    yield put(testWebhookSuccess(action.payload, result));
  } catch (error) {
    yield put(testWebhookFailure(action.payload, error instanceof Error ? error.message : "Unable to test webhook"));
  }
}

export function* webhooksSaga() {
  yield takeLatest(FETCH_WEBHOOKS_REQUEST, handleFetchWebhooks);
  yield takeLatest(CREATE_WEBHOOK_REQUEST, handleCreateWebhook);
  yield takeEvery(DELETE_WEBHOOK_REQUEST, handleDeleteWebhook);
  yield takeEvery(TEST_WEBHOOK_REQUEST, handleTestWebhook);
}
