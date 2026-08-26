import type { UnknownAction } from "redux";
import type { AppAction } from "../action";
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT } from "./actionType";
import type { AuthState } from "./type";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// `action` is typed as UnknownAction (not AppAction) so this reducer's
// signature stays structurally compatible with redux's combineReducers
// inference; it is narrowed to AppAction internally for the switch below.
export function authReducer(state: AuthState = initialState, rawAction: UnknownAction): AuthState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, isAuthenticated: true, user: action.payload, error: null };
    case LOGIN_FAILURE:
      return { ...state, loading: false, isAuthenticated: false, user: null, error: action.payload };
    case LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
}
