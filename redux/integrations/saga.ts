import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { connectIntegration, disconnectIntegration, listIntegrations } from "@/lib/api/integrations";
import type { Integration } from "@/types/integration";
import {
  connectIntegrationFailure,
  connectIntegrationSuccess,
  disconnectIntegrationFailure,
  disconnectIntegrationSuccess,
  fetchIntegrationsFailure,
  fetchIntegrationsSuccess,
  type ConnectIntegrationRequestAction,
  type DisconnectIntegrationRequestAction,
} from "./action";
import {
  CONNECT_INTEGRATION_REQUEST,
  DISCONNECT_INTEGRATION_REQUEST,
  FETCH_INTEGRATIONS_REQUEST,
} from "./actionType";

function* handleFetchIntegrations() {
  try {
    const list: Integration[] = yield call(listIntegrations);
    yield put(fetchIntegrationsSuccess(list));
  } catch (error) {
    yield put(fetchIntegrationsFailure(error instanceof Error ? error.message : "Unable to load integrations"));
  }
}

function* handleConnectIntegration(action: ConnectIntegrationRequestAction) {
  try {
    const integration: Integration = yield call(connectIntegration, action.payload.provider, action.payload.label);
    yield put(connectIntegrationSuccess(integration));
  } catch (error) {
    yield put(
      connectIntegrationFailure(
        action.payload.provider,
        error instanceof Error ? error.message : "Unable to connect integration",
      ),
    );
  }
}

function* handleDisconnectIntegration(action: DisconnectIntegrationRequestAction) {
  try {
    const integration: Integration = yield call(disconnectIntegration, action.payload);
    yield put(disconnectIntegrationSuccess(integration));
  } catch (error) {
    yield put(
      disconnectIntegrationFailure(
        action.payload,
        error instanceof Error ? error.message : "Unable to disconnect integration",
      ),
    );
  }
}

export function* integrationsSaga() {
  yield takeLatest(FETCH_INTEGRATIONS_REQUEST, handleFetchIntegrations);
  yield takeEvery(CONNECT_INTEGRATION_REQUEST, handleConnectIntegration);
  yield takeEvery(DISCONNECT_INTEGRATION_REQUEST, handleDisconnectIntegration);
}
