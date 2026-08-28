import type { UnknownAction } from "redux";
import type { CreateChannelInput, UpdateChannelInput } from "@/lib/api/messages";
import type { ChatChannel, ChatMessage } from "@/types/message";
import {
  CLOSE_CREATE_CHANNEL_MODAL,
  CLOSE_EDIT_CHANNEL_MODAL,
  CREATE_CHANNEL_FAILURE,
  CREATE_CHANNEL_REQUEST,
  CREATE_CHANNEL_SUCCESS,
  FETCH_CHANNELS_FAILURE,
  FETCH_CHANNELS_REQUEST,
  FETCH_CHANNELS_SUCCESS,
  FETCH_MESSAGES_FAILURE,
  FETCH_MESSAGES_REQUEST,
  FETCH_MESSAGES_SUCCESS,
  OPEN_CREATE_CHANNEL_MODAL,
  OPEN_EDIT_CHANNEL_MODAL,
  SEND_MESSAGE_FAILURE,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  UPDATE_CHANNEL_FAILURE,
  UPDATE_CHANNEL_REQUEST,
  UPDATE_CHANNEL_SUCCESS,
} from "./actionType";

export interface FetchChannelsRequestAction extends UnknownAction {
  type: typeof FETCH_CHANNELS_REQUEST;
}
export interface FetchChannelsSuccessAction extends UnknownAction {
  type: typeof FETCH_CHANNELS_SUCCESS;
  payload: ChatChannel[];
}
export interface FetchChannelsFailureAction extends UnknownAction {
  type: typeof FETCH_CHANNELS_FAILURE;
  payload: string;
}

export interface CreateChannelRequestAction extends UnknownAction {
  type: typeof CREATE_CHANNEL_REQUEST;
  payload: CreateChannelInput;
}
export interface CreateChannelSuccessAction extends UnknownAction {
  type: typeof CREATE_CHANNEL_SUCCESS;
  payload: ChatChannel;
}
export interface CreateChannelFailureAction extends UnknownAction {
  type: typeof CREATE_CHANNEL_FAILURE;
  payload: string;
}

export interface FetchMessagesRequestAction extends UnknownAction {
  type: typeof FETCH_MESSAGES_REQUEST;
  payload: { channelId: string };
}
export interface FetchMessagesSuccessAction extends UnknownAction {
  type: typeof FETCH_MESSAGES_SUCCESS;
  payload: { channelId: string; messages: ChatMessage[] };
}
export interface FetchMessagesFailureAction extends UnknownAction {
  type: typeof FETCH_MESSAGES_FAILURE;
  payload: string;
}

export interface SendMessageRequestAction extends UnknownAction {
  type: typeof SEND_MESSAGE_REQUEST;
  payload: { channelId: string; text: string };
}
export interface SendMessageSuccessAction extends UnknownAction {
  type: typeof SEND_MESSAGE_SUCCESS;
  payload: ChatMessage;
}
export interface SendMessageFailureAction extends UnknownAction {
  type: typeof SEND_MESSAGE_FAILURE;
  payload: string;
}

export interface UpdateChannelRequestAction extends UnknownAction {
  type: typeof UPDATE_CHANNEL_REQUEST;
  payload: { id: string; values: UpdateChannelInput };
}
export interface UpdateChannelSuccessAction extends UnknownAction {
  type: typeof UPDATE_CHANNEL_SUCCESS;
  payload: ChatChannel;
}
export interface UpdateChannelFailureAction extends UnknownAction {
  type: typeof UPDATE_CHANNEL_FAILURE;
  payload: string;
}

export interface OpenCreateChannelModalAction extends UnknownAction {
  type: typeof OPEN_CREATE_CHANNEL_MODAL;
}
export interface CloseCreateChannelModalAction extends UnknownAction {
  type: typeof CLOSE_CREATE_CHANNEL_MODAL;
}

export interface OpenEditChannelModalAction extends UnknownAction {
  type: typeof OPEN_EDIT_CHANNEL_MODAL;
  payload: string;
}
export interface CloseEditChannelModalAction extends UnknownAction {
  type: typeof CLOSE_EDIT_CHANNEL_MODAL;
}

export type MessagesAction =
  | FetchChannelsRequestAction
  | FetchChannelsSuccessAction
  | FetchChannelsFailureAction
  | CreateChannelRequestAction
  | CreateChannelSuccessAction
  | CreateChannelFailureAction
  | FetchMessagesRequestAction
  | FetchMessagesSuccessAction
  | FetchMessagesFailureAction
  | SendMessageRequestAction
  | SendMessageSuccessAction
  | SendMessageFailureAction
  | UpdateChannelRequestAction
  | UpdateChannelSuccessAction
  | UpdateChannelFailureAction
  | OpenCreateChannelModalAction
  | CloseCreateChannelModalAction
  | OpenEditChannelModalAction
  | CloseEditChannelModalAction;

export const fetchChannelsRequest = (): FetchChannelsRequestAction => ({ type: FETCH_CHANNELS_REQUEST });
export const fetchChannelsSuccess = (payload: ChatChannel[]): FetchChannelsSuccessAction => ({
  type: FETCH_CHANNELS_SUCCESS,
  payload,
});
export const fetchChannelsFailure = (payload: string): FetchChannelsFailureAction => ({
  type: FETCH_CHANNELS_FAILURE,
  payload,
});

export const createChannelRequest = (payload: CreateChannelInput): CreateChannelRequestAction => ({
  type: CREATE_CHANNEL_REQUEST,
  payload,
});
export const createChannelSuccess = (payload: ChatChannel): CreateChannelSuccessAction => ({
  type: CREATE_CHANNEL_SUCCESS,
  payload,
});
export const createChannelFailure = (payload: string): CreateChannelFailureAction => ({
  type: CREATE_CHANNEL_FAILURE,
  payload,
});

export const fetchMessagesRequest = (channelId: string): FetchMessagesRequestAction => ({
  type: FETCH_MESSAGES_REQUEST,
  payload: { channelId },
});
export const fetchMessagesSuccess = (channelId: string, messages: ChatMessage[]): FetchMessagesSuccessAction => ({
  type: FETCH_MESSAGES_SUCCESS,
  payload: { channelId, messages },
});
export const fetchMessagesFailure = (payload: string): FetchMessagesFailureAction => ({
  type: FETCH_MESSAGES_FAILURE,
  payload,
});

export const sendMessageRequest = (channelId: string, text: string): SendMessageRequestAction => ({
  type: SEND_MESSAGE_REQUEST,
  payload: { channelId, text },
});
export const sendMessageSuccess = (payload: ChatMessage): SendMessageSuccessAction => ({
  type: SEND_MESSAGE_SUCCESS,
  payload,
});
export const sendMessageFailure = (payload: string): SendMessageFailureAction => ({
  type: SEND_MESSAGE_FAILURE,
  payload,
});

export const updateChannelRequest = (id: string, values: UpdateChannelInput): UpdateChannelRequestAction => ({
  type: UPDATE_CHANNEL_REQUEST,
  payload: { id, values },
});
export const updateChannelSuccess = (payload: ChatChannel): UpdateChannelSuccessAction => ({
  type: UPDATE_CHANNEL_SUCCESS,
  payload,
});
export const updateChannelFailure = (payload: string): UpdateChannelFailureAction => ({
  type: UPDATE_CHANNEL_FAILURE,
  payload,
});

export const openCreateChannelModal = (): OpenCreateChannelModalAction => ({ type: OPEN_CREATE_CHANNEL_MODAL });
export const closeCreateChannelModal = (): CloseCreateChannelModalAction => ({ type: CLOSE_CREATE_CHANNEL_MODAL });

export const openEditChannelModal = (channelId: string): OpenEditChannelModalAction => ({
  type: OPEN_EDIT_CHANNEL_MODAL,
  payload: channelId,
});
export const closeEditChannelModal = (): CloseEditChannelModalAction => ({ type: CLOSE_EDIT_CHANNEL_MODAL });
