import type { UnknownAction } from "redux";
import type { AppAction } from "../action";
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
import type { IntegrationsState } from "./type";

const initialState: IntegrationsState = {
  list: [],
  loading: false,
  error: null,

  connectingProviders: [],
  connectError: null,

  disconnectingProviders: [],
  disconnectError: null,
};

export function integrationsReducer(
  state: IntegrationsState = initialState,
  rawAction: UnknownAction,
): IntegrationsState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case FETCH_INTEGRATIONS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_INTEGRATIONS_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case FETCH_INTEGRATIONS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CONNECT_INTEGRATION_REQUEST:
      return {
        ...state,
        connectingProviders: [...state.connectingProviders, action.payload.provider],
        connectError: null,
      };
    case CONNECT_INTEGRATION_SUCCESS:
      return {
        ...state,
        connectingProviders: state.connectingProviders.filter((p) => p !== action.payload.provider),
        list: state.list.map((i) => (i.provider === action.payload.provider ? action.payload : i)),
      };
    case CONNECT_INTEGRATION_FAILURE:
      return {
        ...state,
        connectingProviders: state.connectingProviders.filter((p) => p !== action.payload.provider),
        connectError: action.payload.message,
      };

    case DISCONNECT_INTEGRATION_REQUEST:
      return {
        ...state,
        disconnectingProviders: [...state.disconnectingProviders, action.payload],
        disconnectError: null,
      };
    case DISCONNECT_INTEGRATION_SUCCESS:
      return {
        ...state,
        disconnectingProviders: state.disconnectingProviders.filter((p) => p !== action.payload.provider),
        list: state.list.map((i) => (i.provider === action.payload.provider ? action.payload : i)),
      };
    case DISCONNECT_INTEGRATION_FAILURE:
      return {
        ...state,
        disconnectingProviders: state.disconnectingProviders.filter((p) => p !== action.payload.provider),
        disconnectError: action.payload.message,
      };

    default:
      return state;
  }
}
