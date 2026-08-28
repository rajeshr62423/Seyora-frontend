import type { UnknownAction } from "redux";
import type { AppAction } from "../action";
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
import type { ApiKeysState } from "./type";

const initialState: ApiKeysState = {
  list: [],
  loading: false,
  error: null,

  creating: false,
  createError: null,
  createdKey: null,
  isCreateModalOpen: false,

  revokingIds: [],
  revokeError: null,
};

export function apiKeysReducer(state: ApiKeysState = initialState, rawAction: UnknownAction): ApiKeysState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case FETCH_API_KEYS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_API_KEYS_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case FETCH_API_KEYS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_API_KEY_REQUEST:
      return { ...state, creating: true, createError: null };
    case CREATE_API_KEY_SUCCESS:
      return { ...state, creating: false, createdKey: action.payload, list: [action.payload, ...state.list] };
    case CREATE_API_KEY_FAILURE:
      return { ...state, creating: false, createError: action.payload };

    case REVOKE_API_KEY_REQUEST:
      return { ...state, revokingIds: [...state.revokingIds, action.payload], revokeError: null };
    case REVOKE_API_KEY_SUCCESS:
      return {
        ...state,
        revokingIds: state.revokingIds.filter((id) => id !== action.payload.id),
        list: state.list.map((k) => (k.id === action.payload.id ? action.payload : k)),
      };
    case REVOKE_API_KEY_FAILURE:
      return {
        ...state,
        revokingIds: state.revokingIds.filter((id) => id !== action.payload.id),
        revokeError: action.payload.message,
      };

    case OPEN_CREATE_API_KEY_MODAL:
      return { ...state, isCreateModalOpen: true, createError: null };
    case CLOSE_CREATE_API_KEY_MODAL:
      return { ...state, isCreateModalOpen: false, createdKey: null };

    default:
      return state;
  }
}
