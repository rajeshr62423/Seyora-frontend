import type { UnknownAction } from "redux";
import type { Integration } from "@/types/integration";
import {
  CONNECT_INTEGRATION_FAILURE,
  CONNECT_INTEGRATION_REQUEST,
  CONNECT_INTEGRATION_SUCCESS,
  DISCONNECT_INTEGRATION_FAILURE,
  DISCONNECT_INTEGRATION_REQUEST,
  DISCONNECT_INTEGRATION_SUCCESS,
  FETCH_INTEGRATIONS_FAILURE,
  FETCH_INTEGRATIONS_REQUEST,
  FETCH_INTEGRATIONS_SUCCESS,
} from "./actionType";

export interface FetchIntegrationsRequestAction extends UnknownAction {
  type: typeof FETCH_INTEGRATIONS_REQUEST;
}
export interface FetchIntegrationsSuccessAction extends UnknownAction {
  type: typeof FETCH_INTEGRATIONS_SUCCESS;
  payload: Integration[];
}
export interface FetchIntegrationsFailureAction extends UnknownAction {
  type: typeof FETCH_INTEGRATIONS_FAILURE;
  payload: string;
}

export interface ConnectIntegrationRequestAction extends UnknownAction {
  type: typeof CONNECT_INTEGRATION_REQUEST;
  payload: { provider: string; label?: string };
}
export interface ConnectIntegrationSuccessAction extends UnknownAction {
  type: typeof CONNECT_INTEGRATION_SUCCESS;
  payload: Integration;
}
export interface ConnectIntegrationFailureAction extends UnknownAction {
  type: typeof CONNECT_INTEGRATION_FAILURE;
  payload: { provider: string; message: string };
}

export interface DisconnectIntegrationRequestAction extends UnknownAction {
  type: typeof DISCONNECT_INTEGRATION_REQUEST;
  payload: string;
}
export interface DisconnectIntegrationSuccessAction extends UnknownAction {
  type: typeof DISCONNECT_INTEGRATION_SUCCESS;
  payload: Integration;
}
export interface DisconnectIntegrationFailureAction extends UnknownAction {
  type: typeof DISCONNECT_INTEGRATION_FAILURE;
  payload: { provider: string; message: string };
}

export type IntegrationsAction =
  | FetchIntegrationsRequestAction
  | FetchIntegrationsSuccessAction
  | FetchIntegrationsFailureAction
  | ConnectIntegrationRequestAction
  | ConnectIntegrationSuccessAction
  | ConnectIntegrationFailureAction
  | DisconnectIntegrationRequestAction
  | DisconnectIntegrationSuccessAction
  | DisconnectIntegrationFailureAction;

export const fetchIntegrationsRequest = (): FetchIntegrationsRequestAction => ({
  type: FETCH_INTEGRATIONS_REQUEST,
});
export const fetchIntegrationsSuccess = (payload: Integration[]): FetchIntegrationsSuccessAction => ({
  type: FETCH_INTEGRATIONS_SUCCESS,
  payload,
});
export const fetchIntegrationsFailure = (payload: string): FetchIntegrationsFailureAction => ({
  type: FETCH_INTEGRATIONS_FAILURE,
  payload,
});

export const connectIntegrationRequest = (provider: string, label?: string): ConnectIntegrationRequestAction => ({
  type: CONNECT_INTEGRATION_REQUEST,
  payload: { provider, label },
});
export const connectIntegrationSuccess = (payload: Integration): ConnectIntegrationSuccessAction => ({
  type: CONNECT_INTEGRATION_SUCCESS,
  payload,
});
export const connectIntegrationFailure = (provider: string, message: string): ConnectIntegrationFailureAction => ({
  type: CONNECT_INTEGRATION_FAILURE,
  payload: { provider, message },
});

export const disconnectIntegrationRequest = (provider: string): DisconnectIntegrationRequestAction => ({
  type: DISCONNECT_INTEGRATION_REQUEST,
  payload: provider,
});
export const disconnectIntegrationSuccess = (payload: Integration): DisconnectIntegrationSuccessAction => ({
  type: DISCONNECT_INTEGRATION_SUCCESS,
  payload,
});
export const disconnectIntegrationFailure = (
  provider: string,
  message: string,
): DisconnectIntegrationFailureAction => ({
  type: DISCONNECT_INTEGRATION_FAILURE,
  payload: { provider, message },
});
