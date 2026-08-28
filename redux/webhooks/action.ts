import type { UnknownAction } from "redux";
import type { CreateWebhookInput, TestWebhookResult } from "@/lib/api/webhooks";
import type { Webhook } from "@/types/webhook";
import {
  CLOSE_CREATE_WEBHOOK_MODAL,
  CREATE_WEBHOOK_FAILURE,
  CREATE_WEBHOOK_REQUEST,
  CREATE_WEBHOOK_SUCCESS,
  DELETE_WEBHOOK_FAILURE,
  DELETE_WEBHOOK_REQUEST,
  DELETE_WEBHOOK_SUCCESS,
  FETCH_WEBHOOKS_FAILURE,
  FETCH_WEBHOOKS_REQUEST,
  FETCH_WEBHOOKS_SUCCESS,
  OPEN_CREATE_WEBHOOK_MODAL,
  TEST_WEBHOOK_FAILURE,
  TEST_WEBHOOK_REQUEST,
  TEST_WEBHOOK_SUCCESS,
} from "./actionType";

export interface FetchWebhooksRequestAction extends UnknownAction {
  type: typeof FETCH_WEBHOOKS_REQUEST;
}
export interface FetchWebhooksSuccessAction extends UnknownAction {
  type: typeof FETCH_WEBHOOKS_SUCCESS;
  payload: Webhook[];
}
export interface FetchWebhooksFailureAction extends UnknownAction {
  type: typeof FETCH_WEBHOOKS_FAILURE;
  payload: string;
}

export interface CreateWebhookRequestAction extends UnknownAction {
  type: typeof CREATE_WEBHOOK_REQUEST;
  payload: CreateWebhookInput;
}
export interface CreateWebhookSuccessAction extends UnknownAction {
  type: typeof CREATE_WEBHOOK_SUCCESS;
  payload: Webhook;
}
export interface CreateWebhookFailureAction extends UnknownAction {
  type: typeof CREATE_WEBHOOK_FAILURE;
  payload: string;
}

export interface DeleteWebhookRequestAction extends UnknownAction {
  type: typeof DELETE_WEBHOOK_REQUEST;
  payload: string;
}
export interface DeleteWebhookSuccessAction extends UnknownAction {
  type: typeof DELETE_WEBHOOK_SUCCESS;
  payload: string;
}
export interface DeleteWebhookFailureAction extends UnknownAction {
  type: typeof DELETE_WEBHOOK_FAILURE;
  payload: { id: string; message: string };
}

export interface TestWebhookRequestAction extends UnknownAction {
  type: typeof TEST_WEBHOOK_REQUEST;
  payload: string;
}
export interface TestWebhookSuccessAction extends UnknownAction {
  type: typeof TEST_WEBHOOK_SUCCESS;
  payload: { id: string; result: TestWebhookResult };
}
export interface TestWebhookFailureAction extends UnknownAction {
  type: typeof TEST_WEBHOOK_FAILURE;
  payload: { id: string; message: string };
}

export interface OpenCreateWebhookModalAction extends UnknownAction {
  type: typeof OPEN_CREATE_WEBHOOK_MODAL;
}
export interface CloseCreateWebhookModalAction extends UnknownAction {
  type: typeof CLOSE_CREATE_WEBHOOK_MODAL;
}

export type WebhooksAction =
  | FetchWebhooksRequestAction
  | FetchWebhooksSuccessAction
  | FetchWebhooksFailureAction
  | CreateWebhookRequestAction
  | CreateWebhookSuccessAction
  | CreateWebhookFailureAction
  | DeleteWebhookRequestAction
  | DeleteWebhookSuccessAction
  | DeleteWebhookFailureAction
  | TestWebhookRequestAction
  | TestWebhookSuccessAction
  | TestWebhookFailureAction
  | OpenCreateWebhookModalAction
  | CloseCreateWebhookModalAction;

export const fetchWebhooksRequest = (): FetchWebhooksRequestAction => ({ type: FETCH_WEBHOOKS_REQUEST });
export const fetchWebhooksSuccess = (payload: Webhook[]): FetchWebhooksSuccessAction => ({
  type: FETCH_WEBHOOKS_SUCCESS,
  payload,
});
export const fetchWebhooksFailure = (payload: string): FetchWebhooksFailureAction => ({
  type: FETCH_WEBHOOKS_FAILURE,
  payload,
});

export const createWebhookRequest = (payload: CreateWebhookInput): CreateWebhookRequestAction => ({
  type: CREATE_WEBHOOK_REQUEST,
  payload,
});
export const createWebhookSuccess = (payload: Webhook): CreateWebhookSuccessAction => ({
  type: CREATE_WEBHOOK_SUCCESS,
  payload,
});
export const createWebhookFailure = (payload: string): CreateWebhookFailureAction => ({
  type: CREATE_WEBHOOK_FAILURE,
  payload,
});

export const deleteWebhookRequest = (id: string): DeleteWebhookRequestAction => ({
  type: DELETE_WEBHOOK_REQUEST,
  payload: id,
});
export const deleteWebhookSuccess = (id: string): DeleteWebhookSuccessAction => ({
  type: DELETE_WEBHOOK_SUCCESS,
  payload: id,
});
export const deleteWebhookFailure = (id: string, message: string): DeleteWebhookFailureAction => ({
  type: DELETE_WEBHOOK_FAILURE,
  payload: { id, message },
});

export const testWebhookRequest = (id: string): TestWebhookRequestAction => ({
  type: TEST_WEBHOOK_REQUEST,
  payload: id,
});
export const testWebhookSuccess = (id: string, result: TestWebhookResult): TestWebhookSuccessAction => ({
  type: TEST_WEBHOOK_SUCCESS,
  payload: { id, result },
});
export const testWebhookFailure = (id: string, message: string): TestWebhookFailureAction => ({
  type: TEST_WEBHOOK_FAILURE,
  payload: { id, message },
});

export const openCreateWebhookModal = (): OpenCreateWebhookModalAction => ({ type: OPEN_CREATE_WEBHOOK_MODAL });
export const closeCreateWebhookModal = (): CloseCreateWebhookModalAction => ({ type: CLOSE_CREATE_WEBHOOK_MODAL });
