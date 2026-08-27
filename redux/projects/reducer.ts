import type { UnknownAction } from "redux";
import type { AppAction } from "../action";
import {
  CLOSE_CREATE_PROJECT_MODAL,
  CREATE_PROJECT_FAILURE,
  CREATE_PROJECT_REQUEST,
  CREATE_PROJECT_SUCCESS,
  FETCH_PROJECTS_FAILURE,
  FETCH_PROJECTS_REQUEST,
  FETCH_PROJECTS_SUCCESS,
  OPEN_CREATE_PROJECT_MODAL,
  UPDATE_PROJECT_FAILURE,
  UPDATE_PROJECT_REQUEST,
  UPDATE_PROJECT_SUCCESS,
} from "./actionType";
import type { ProjectsState } from "./type";

const initialState: ProjectsState = {
  list: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
  isCreateModalOpen: false,
};

export function projectsReducer(state: ProjectsState = initialState, rawAction: UnknownAction): ProjectsState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case FETCH_PROJECTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PROJECTS_SUCCESS:
      return { ...state, loading: false, list: action.payload };
    case FETCH_PROJECTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case CREATE_PROJECT_REQUEST:
      return { ...state, creating: true, createError: null };
    case CREATE_PROJECT_SUCCESS:
      return { ...state, creating: false, list: [action.payload, ...state.list] };
    case CREATE_PROJECT_FAILURE:
      return { ...state, creating: false, createError: action.payload };
    case UPDATE_PROJECT_REQUEST:
      return { ...state, updating: true, updateError: null };
    case UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        updating: false,
        list: state.list.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };
    case UPDATE_PROJECT_FAILURE:
      return { ...state, updating: false, updateError: action.payload };
    case OPEN_CREATE_PROJECT_MODAL:
      return { ...state, isCreateModalOpen: true };
    case CLOSE_CREATE_PROJECT_MODAL:
      return { ...state, isCreateModalOpen: false };
    default:
      return state;
  }
}
