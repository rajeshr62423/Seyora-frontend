import type { UnknownAction } from "redux";
import type { AppAction } from "../action";
import {
  FETCH_OVERVIEW_FAILURE,
  FETCH_OVERVIEW_REQUEST,
  FETCH_OVERVIEW_SUCCESS,
  FETCH_TEAM_PERFORMANCE_FAILURE,
  FETCH_TEAM_PERFORMANCE_REQUEST,
  FETCH_TEAM_PERFORMANCE_SUCCESS,
} from "./actionType";
import type { AnalyticsState } from "./type";

const initialState: AnalyticsState = {
  overview: null,
  range: 30,
  overviewLoading: false,
  overviewError: null,

  teamPerformance: [],
  teamPerformanceLoading: false,
  teamPerformanceError: null,
};

export function analyticsReducer(state: AnalyticsState = initialState, rawAction: UnknownAction): AnalyticsState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case FETCH_OVERVIEW_REQUEST:
      return { ...state, overviewLoading: true, overviewError: null, range: action.payload };
    case FETCH_OVERVIEW_SUCCESS:
      return { ...state, overviewLoading: false, overview: action.payload };
    case FETCH_OVERVIEW_FAILURE:
      return { ...state, overviewLoading: false, overviewError: action.payload };

    case FETCH_TEAM_PERFORMANCE_REQUEST:
      return { ...state, teamPerformanceLoading: true, teamPerformanceError: null };
    case FETCH_TEAM_PERFORMANCE_SUCCESS:
      return { ...state, teamPerformanceLoading: false, teamPerformance: action.payload };
    case FETCH_TEAM_PERFORMANCE_FAILURE:
      return { ...state, teamPerformanceLoading: false, teamPerformanceError: action.payload };

    default:
      return state;
  }
}
