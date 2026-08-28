import type { UnknownAction } from "redux";
import type { ApiKey } from "@/types/apiKey";
import {
  CLOSE_CREATE_API_KEY_MODAL,
  CREATE_API_KEY_FAILURE,
  CREATE_API_KEY_REQUEST,
  CREATE_API_KEY_SUCCESS,
  FETCH_API_KEYS_FAILURE,
  FETCH_API_KEYS_REQUEST,
  FETCH_API_KEYS_SUCCESS,
  OPEN_CREATE_API_KEY_MODAL,
  REVOKE_API_KEY_FAILURE,
  REVOKE_API_KEY_REQUEST,
  REVOKE_API_KEY_SUCCESS,
} from "./actionType";

export interface FetchApiKeysRequestAction extends UnknownAction {
  type: typeof FETCH_API_KEYS_REQUEST;
}
export interface FetchApiKeysSuccessAction extends UnknownAction {
  type: typeof FETCH_API_KEYS_SUCCESS;
  payload: ApiKey[];
}
export interface FetchApiKeysFailureAction extends UnknownAction {
  type: typeof FETCH_API_KEYS_FAILURE;
  payload: string;
}

export interface CreateApiKeyRequestAction extends UnknownAction {
  type: typeof CREATE_API_KEY_REQUEST;
  payload: string;
}
export interface CreateApiKeySuccessAction extends UnknownAction {
  type: typeof CREATE_API_KEY_SUCCESS;
  payload: ApiKey & { key: string };
}
export interface CreateApiKeyFailureAction extends UnknownAction {
  type: typeof CREATE_API_KEY_FAILURE;
  payload: string;
}

export interface RevokeApiKeyRequestAction extends UnknownAction {
  type: typeof REVOKE_API_KEY_REQUEST;
  payload: string;
}
export interface RevokeApiKeySuccessAction extends UnknownAction {
  type: typeof REVOKE_API_KEY_SUCCESS;
  payload: ApiKey;
}
export interface RevokeApiKeyFailureAction extends UnknownAction {
  type: typeof REVOKE_API_KEY_FAILURE;
  payload: { id: string; message: string };
}

export interface OpenCreateApiKeyModalAction extends UnknownAction {
  type: typeof OPEN_CREATE_API_KEY_MODAL;
}
export interface CloseCreateApiKeyModalAction extends UnknownAction {
  type: typeof CLOSE_CREATE_API_KEY_MODAL;
}

export type ApiKeysAction =
  | FetchApiKeysRequestAction
  | FetchApiKeysSuccessAction
  | FetchApiKeysFailureAction
  | CreateApiKeyRequestAction
  | CreateApiKeySuccessAction
  | CreateApiKeyFailureAction
  | RevokeApiKeyRequestAction
  | RevokeApiKeySuccessAction
  | RevokeApiKeyFailureAction
  | OpenCreateApiKeyModalAction
  | CloseCreateApiKeyModalAction;

export const fetchApiKeysRequest = (): FetchApiKeysRequestAction => ({ type: FETCH_API_KEYS_REQUEST });
export const fetchApiKeysSuccess = (payload: ApiKey[]): FetchApiKeysSuccessAction => ({
  type: FETCH_API_KEYS_SUCCESS,
  payload,
});
export const fetchApiKeysFailure = (payload: string): FetchApiKeysFailureAction => ({
  type: FETCH_API_KEYS_FAILURE,
  payload,
});

export const createApiKeyRequest = (name: string): CreateApiKeyRequestAction => ({
  type: CREATE_API_KEY_REQUEST,
  payload: name,
});
export const createApiKeySuccess = (payload: ApiKey & { key: string }): CreateApiKeySuccessAction => ({
  type: CREATE_API_KEY_SUCCESS,
  payload,
});
export const createApiKeyFailure = (payload: string): CreateApiKeyFailureAction => ({
  type: CREATE_API_KEY_FAILURE,
  payload,
});

export const revokeApiKeyRequest = (id: string): RevokeApiKeyRequestAction => ({
  type: REVOKE_API_KEY_REQUEST,
  payload: id,
});
export const revokeApiKeySuccess = (payload: ApiKey): RevokeApiKeySuccessAction => ({
  type: REVOKE_API_KEY_SUCCESS,
  payload,
});
export const revokeApiKeyFailure = (id: string, message: string): RevokeApiKeyFailureAction => ({
  type: REVOKE_API_KEY_FAILURE,
  payload: { id, message },
});

export const openCreateApiKeyModal = (): OpenCreateApiKeyModalAction => ({ type: OPEN_CREATE_API_KEY_MODAL });
export const closeCreateApiKeyModal = (): CloseCreateApiKeyModalAction => ({ type: CLOSE_CREATE_API_KEY_MODAL });
