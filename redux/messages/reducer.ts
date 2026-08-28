import type { UnknownAction } from "redux";
import type { AppAction } from "../action";
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
import type { MessagesState } from "./type";

const initialState: MessagesState = {
  channels: [],
  channelsLoading: false,
  channelsError: null,

  creatingChannel: false,
  createChannelError: null,
  isCreateChannelModalOpen: false,

  updatingChannel: false,
  updateChannelError: null,
  editingChannelId: null,

  messages: [],
  messagesChannelId: null,
  messagesLoading: false,
  messagesError: null,

  sending: false,
  sendError: null,
};

export function messagesReducer(state: MessagesState = initialState, rawAction: UnknownAction): MessagesState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case FETCH_CHANNELS_REQUEST:
      return { ...state, channelsLoading: true, channelsError: null };
    case FETCH_CHANNELS_SUCCESS:
      return { ...state, channelsLoading: false, channels: action.payload };
    case FETCH_CHANNELS_FAILURE:
      return { ...state, channelsLoading: false, channelsError: action.payload };

    case CREATE_CHANNEL_REQUEST:
      return { ...state, creatingChannel: true, createChannelError: null };
    case CREATE_CHANNEL_SUCCESS:
      return {
        ...state,
        creatingChannel: false,
        isCreateChannelModalOpen: false,
        channels: [action.payload, ...state.channels],
      };
    case CREATE_CHANNEL_FAILURE:
      return { ...state, creatingChannel: false, createChannelError: action.payload };

    case FETCH_MESSAGES_REQUEST:
      return { ...state, messagesLoading: true, messagesError: null };
    case FETCH_MESSAGES_SUCCESS:
      // GET /channels/:id/messages marks the channel read as a server-side
      // side effect — zero its unread count here rather than refetching
      // the whole channel list just to pick up that one field.
      return {
        ...state,
        messagesLoading: false,
        messagesChannelId: action.payload.channelId,
        messages: action.payload.messages,
        channels: state.channels.map((c) => (c.id === action.payload.channelId ? { ...c, unread: 0 } : c)),
      };
    case FETCH_MESSAGES_FAILURE:
      return { ...state, messagesLoading: false, messagesError: action.payload };

    case SEND_MESSAGE_REQUEST:
      return { ...state, sending: true, sendError: null };
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        sending: false,
        messages:
          action.payload.channelId === state.messagesChannelId
            ? [...state.messages, action.payload]
            : state.messages,
      };
    case SEND_MESSAGE_FAILURE:
      return { ...state, sending: false, sendError: action.payload };

    case UPDATE_CHANNEL_REQUEST:
      return { ...state, updatingChannel: true, updateChannelError: null };
    case UPDATE_CHANNEL_SUCCESS:
      return {
        ...state,
        updatingChannel: false,
        editingChannelId: null,
        channels: state.channels.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
    case UPDATE_CHANNEL_FAILURE:
      return { ...state, updatingChannel: false, updateChannelError: action.payload };

    case OPEN_CREATE_CHANNEL_MODAL:
      return { ...state, isCreateChannelModalOpen: true, createChannelError: null };
    case CLOSE_CREATE_CHANNEL_MODAL:
      return { ...state, isCreateChannelModalOpen: false };

    case OPEN_EDIT_CHANNEL_MODAL:
      return { ...state, editingChannelId: action.payload, updateChannelError: null };
    case CLOSE_EDIT_CHANNEL_MODAL:
      return { ...state, editingChannelId: null };

    default:
      return state;
  }
}
