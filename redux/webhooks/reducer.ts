import type { UnknownAction } from "redux";
import type { AppAction } from "../action";
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
import type { WebhooksState } from "./type";

const initialState: WebhooksState = {
  list: [],
  loading: false,
  error: null,

  creating: false,
  createError: null,
  isCreateModalOpen: false,

  deletingIds: [],
  deleteError: null,

  testingIds: [],
  testResults: {},
};

export function webhooksReducer(state: WebhooksState = initialState, rawAction: UnknownAction): WebhooksState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case FETCH_WEBHOOKS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_WEBHOOKS_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case FETCH_WEBHOOKS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_WEBHOOK_REQUEST:
      return { ...state, creating: true, createError: null };
    case CREATE_WEBHOOK_SUCCESS:
      return { ...state, creating: false, isCreateModalOpen: false, list: [action.payload, ...state.list] };
    case CREATE_WEBHOOK_FAILURE:
      return { ...state, creating: false, createError: action.payload };

    case DELETE_WEBHOOK_REQUEST:
      return { ...state, deletingIds: [...state.deletingIds, action.payload], deleteError: null };
    case DELETE_WEBHOOK_SUCCESS:
      return {
        ...state,
        deletingIds: state.deletingIds.filter((id) => id !== action.payload),
        list: state.list.filter((w) => w.id !== action.payload),
      };
    case DELETE_WEBHOOK_FAILURE:
      return {
        ...state,
        deletingIds: state.deletingIds.filter((id) => id !== action.payload.id),
        deleteError: action.payload.message,
      };

    case TEST_WEBHOOK_REQUEST:
      return { ...state, testingIds: [...state.testingIds, action.payload] };
    case TEST_WEBHOOK_SUCCESS:
      // The backend records a delivery attempt (updates lastDeliveryAt)
      // regardless of whether the ping succeeded — reflected here even
      // though the test response itself doesn't return the whole webhook.
      return {
        ...state,
        testingIds: state.testingIds.filter((id) => id !== action.payload.id),
        testResults: { ...state.testResults, [action.payload.id]: action.payload.result },
        list: state.list.map((w) =>
          w.id === action.payload.id ? { ...w, lastDeliveryAt: new Date().toISOString() } : w,
        ),
      };
    case TEST_WEBHOOK_FAILURE:
      return { ...state, testingIds: state.testingIds.filter((id) => id !== action.payload.id) };

    case OPEN_CREATE_WEBHOOK_MODAL:
      return { ...state, isCreateModalOpen: true, createError: null };
    case CLOSE_CREATE_WEBHOOK_MODAL:
      return { ...state, isCreateModalOpen: false };

    default:
      return state;
  }
}
