import type { UnknownAction } from "redux";
import type { AppAction } from "../action";
import { FETCH_USERS_FAILURE, FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, SELECT_USER } from "./actionType";
import type { UsersState } from "./type";

const initialState: UsersState = {
  list: [],
  selectedUserId: null,
  loading: false,
  error: null,
};

// `action` is typed as UnknownAction (not AppAction) so this reducer's
// signature stays structurally compatible with redux's combineReducers
// inference; it is narrowed to AppAction internally for the switch below.
export function usersReducer(state: UsersState = initialState, rawAction: UnknownAction): UsersState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_USERS_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case SELECT_USER:
      return { ...state, selectedUserId: action.payload };
    default:
      return state;
  }
}
