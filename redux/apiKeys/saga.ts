import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { createApiKey, listApiKeys, revokeApiKey } from "@/lib/api/apiKeys";
import type { ApiKey } from "@/types/apiKey";
import {
  createApiKeyFailure,
  createApiKeySuccess,
  fetchApiKeysFailure,
  fetchApiKeysSuccess,
  revokeApiKeyFailure,
  revokeApiKeySuccess,
  type CreateApiKeyRequestAction,
  type RevokeApiKeyRequestAction,
} from "./action";
import { CREATE_API_KEY_REQUEST, FETCH_API_KEYS_REQUEST, REVOKE_API_KEY_REQUEST } from "./actionType";

function* handleFetchApiKeys() {
  try {
    const keys: ApiKey[] = yield call(listApiKeys);
    yield put(fetchApiKeysSuccess(keys));
  } catch (error) {
    yield put(fetchApiKeysFailure(error instanceof Error ? error.message : "Unable to load API keys"));
  }
}

function* handleCreateApiKey(action: CreateApiKeyRequestAction) {
  try {
    const key: ApiKey & { key: string } = yield call(createApiKey, action.payload);
    yield put(createApiKeySuccess(key));
  } catch (error) {
    yield put(createApiKeyFailure(error instanceof Error ? error.message : "Unable to create API key"));
  }
}

// takeEvery — revoking different keys in quick succession shouldn't cancel
// each other's in-flight DELETE, same reasoning as other per-row mutations.
function* handleRevokeApiKey(action: RevokeApiKeyRequestAction) {
  try {
    const key: ApiKey = yield call(revokeApiKey, action.payload);
    yield put(revokeApiKeySuccess(key));
  } catch (error) {
    yield put(revokeApiKeyFailure(action.payload, error instanceof Error ? error.message : "Unable to revoke API key"));
  }
}

export function* apiKeysSaga() {
  yield takeLatest(FETCH_API_KEYS_REQUEST, handleFetchApiKeys);
  yield takeLatest(CREATE_API_KEY_REQUEST, handleCreateApiKey);
  yield takeEvery(REVOKE_API_KEY_REQUEST, handleRevokeApiKey);
}
