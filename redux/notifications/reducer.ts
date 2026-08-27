import type { UnknownAction } from "redux";
import type { AppAction } from "../action";
import {
  FETCH_NOTIFICATIONS_FAILURE,
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  MARK_ALL_READ_FAILURE,
  MARK_ALL_READ_REQUEST,
  MARK_ALL_READ_SUCCESS,
  MARK_READ_FAILURE,
  MARK_READ_REQUEST,
  MARK_READ_SUCCESS,
} from "./actionType";
import type { NotificationsState } from "./type";

const initialState: NotificationsState = {
  list: [],
  loading: false,
  error: null,
  markingReadIds: [],
  markingAllRead: false,
};

export function notificationsReducer(
  state: NotificationsState = initialState,
  rawAction: UnknownAction,
): NotificationsState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case FETCH_NOTIFICATIONS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_NOTIFICATIONS_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case FETCH_NOTIFICATIONS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case MARK_READ_REQUEST:
      return {
        ...state,
        markingReadIds: [...state.markingReadIds, action.payload],
        list: state.list.map((n) => (n.id === action.payload ? { ...n, unread: false } : n)),
      };
    case MARK_READ_SUCCESS:
      // Merge unread:false only — PATCH /notifications/:id's response
      // (unlike GET /notifications) doesn't include the joined `actor`
      // relation, so replacing the item wholesale would silently drop it.
      // The optimistic REQUEST patch already flipped `unread`, this just
      // confirms it against the id the server actually updated.
      return {
        ...state,
        markingReadIds: state.markingReadIds.filter((id) => id !== action.payload.id),
        list: state.list.map((n) => (n.id === action.payload.id ? { ...n, unread: false } : n)),
      };
    case MARK_READ_FAILURE:
      return { ...state, markingReadIds: state.markingReadIds.filter((id) => id !== action.payload.id) };

    case MARK_ALL_READ_REQUEST:
      return { ...state, markingAllRead: true, list: state.list.map((n) => ({ ...n, unread: false })) };
    case MARK_ALL_READ_SUCCESS:
      return { ...state, markingAllRead: false };
    case MARK_ALL_READ_FAILURE:
      return { ...state, markingAllRead: false, error: action.payload };

    default:
      return state;
  }
}
