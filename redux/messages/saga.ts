import { call, put, takeLatest } from "redux-saga/effects";
import {
  createChannel as createChannelApi,
  listChannels,
  listMessages,
  sendMessage as sendMessageApi,
  updateChannel as updateChannelApi,
} from "@/lib/api/messages";
import type { ChatChannel, ChatMessage } from "@/types/message";
import {
  createChannelFailure,
  createChannelSuccess,
  fetchChannelsFailure,
  fetchChannelsSuccess,
  fetchMessagesFailure,
  fetchMessagesSuccess,
  sendMessageFailure,
  sendMessageSuccess,
  updateChannelFailure,
  updateChannelSuccess,
  type CreateChannelRequestAction,
  type FetchMessagesRequestAction,
  type SendMessageRequestAction,
  type UpdateChannelRequestAction,
} from "./action";
import {
  CREATE_CHANNEL_REQUEST,
  FETCH_CHANNELS_REQUEST,
  FETCH_MESSAGES_REQUEST,
  SEND_MESSAGE_REQUEST,
  UPDATE_CHANNEL_REQUEST,
} from "./actionType";

function* handleFetchChannels() {
  try {
    const channels: ChatChannel[] = yield call(listChannels);
    yield put(fetchChannelsSuccess(channels));
  } catch (error) {
    yield put(fetchChannelsFailure(error instanceof Error ? error.message : "Unable to load channels"));
  }
}

function* handleCreateChannel(action: CreateChannelRequestAction) {
  try {
    const channel: ChatChannel = yield call(createChannelApi, action.payload);
    yield put(createChannelSuccess(channel));
  } catch (error) {
    yield put(createChannelFailure(error instanceof Error ? error.message : "Unable to create channel"));
  }
}

function* handleFetchMessages(action: FetchMessagesRequestAction) {
  try {
    const messages: ChatMessage[] = yield call(listMessages, action.payload.channelId);
    yield put(fetchMessagesSuccess(action.payload.channelId, messages));
  } catch (error) {
    yield put(fetchMessagesFailure(error instanceof Error ? error.message : "Unable to load messages"));
  }
}

function* handleSendMessage(action: SendMessageRequestAction) {
  try {
    const message: ChatMessage = yield call(sendMessageApi, action.payload.channelId, action.payload.text);
    yield put(sendMessageSuccess(message));
  } catch (error) {
    yield put(sendMessageFailure(error instanceof Error ? error.message : "Unable to send message"));
  }
}

function* handleUpdateChannel(action: UpdateChannelRequestAction) {
  try {
    const channel: ChatChannel = yield call(updateChannelApi, action.payload.id, action.payload.values);
    yield put(updateChannelSuccess(channel));
  } catch (error) {
    yield put(updateChannelFailure(error instanceof Error ? error.message : "Unable to update channel"));
  }
}

export function* messagesSaga() {
  yield takeLatest(FETCH_CHANNELS_REQUEST, handleFetchChannels);
  yield takeLatest(CREATE_CHANNEL_REQUEST, handleCreateChannel);
  yield takeLatest(FETCH_MESSAGES_REQUEST, handleFetchMessages);
  yield takeLatest(SEND_MESSAGE_REQUEST, handleSendMessage);
  yield takeLatest(UPDATE_CHANNEL_REQUEST, handleUpdateChannel);
}
