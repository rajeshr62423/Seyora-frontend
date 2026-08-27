import type { UnknownAction } from "redux";
import type { AppAction } from "../action";
import { FETCH_ACTIVITY_FAILURE, FETCH_ACTIVITY_REQUEST, FETCH_ACTIVITY_SUCCESS } from "./actionType";
import type { ActivityState } from "./type";

const initialState: ActivityState = {
  items: [],
  page: 1,
  pageSize: 0,
  total: 0,
  loading: false,
  error: null,
};

export function activityReducer(state: ActivityState = initialState, rawAction: UnknownAction): ActivityState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case FETCH_ACTIVITY_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_ACTIVITY_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        page: action.payload.page,
        pageSize: action.payload.pageSize,
        total: action.payload.total,
      };
    case FETCH_ACTIVITY_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
