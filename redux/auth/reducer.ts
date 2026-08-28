import type { UnknownAction } from "redux";
import type { AppAction } from "../action";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_VIA_INVITATION_FAILURE,
  REGISTER_VIA_INVITATION_REQUEST,
  REGISTER_VIA_INVITATION_SUCCESS,
  REMOVE_AVATAR_FAILURE,
  REMOVE_AVATAR_REQUEST,
  REMOVE_AVATAR_SUCCESS,
  RESTORE_SESSION_FAILURE,
  RESTORE_SESSION_REQUEST,
  RESTORE_SESSION_SUCCESS,
  UPLOAD_AVATAR_FAILURE,
  UPLOAD_AVATAR_REQUEST,
  UPLOAD_AVATAR_SUCCESS,
} from "./actionType";
import type { AuthState } from "./type";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
  avatarUploading: false,
  avatarError: null,
};

// `action` is typed as UnknownAction (not AppAction) so this reducer's
// signature stays structurally compatible with redux's combineReducers
// inference; it is narrowed to AppAction internally for the switch below.
export function authReducer(state: AuthState = initialState, rawAction: UnknownAction): AuthState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case REGISTER_VIA_INVITATION_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case REGISTER_VIA_INVITATION_SUCCESS:
      return { ...state, loading: false, isAuthenticated: true, user: action.payload, error: null };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case REGISTER_VIA_INVITATION_FAILURE:
      return { ...state, loading: false, isAuthenticated: false, user: null, error: action.payload };
    case RESTORE_SESSION_REQUEST:
      return state;
    case RESTORE_SESSION_SUCCESS:
      return { ...state, isAuthenticated: true, user: action.payload, initialized: true };
    case RESTORE_SESSION_FAILURE:
      return { ...state, isAuthenticated: false, user: null, initialized: true };
    case LOGOUT:
      return { ...initialState, initialized: true };
    case UPLOAD_AVATAR_REQUEST:
    case REMOVE_AVATAR_REQUEST:
      return { ...state, avatarUploading: true, avatarError: null };
    case UPLOAD_AVATAR_SUCCESS:
    case REMOVE_AVATAR_SUCCESS:
      return { ...state, avatarUploading: false, user: action.payload };
    case UPLOAD_AVATAR_FAILURE:
    case REMOVE_AVATAR_FAILURE:
      return { ...state, avatarUploading: false, avatarError: action.payload };
    default:
      return state;
  }
}
