import type { UnknownAction } from "redux";
import type { CreateProjectFormValues, Project } from "@/types/project";
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
import type { UpdateProjectPayload } from "./type";

export interface FetchProjectsRequestAction extends UnknownAction {
  type: typeof FETCH_PROJECTS_REQUEST;
}
export interface FetchProjectsSuccessAction extends UnknownAction {
  type: typeof FETCH_PROJECTS_SUCCESS;
  payload: Project[];
}
export interface FetchProjectsFailureAction extends UnknownAction {
  type: typeof FETCH_PROJECTS_FAILURE;
  payload: string;
}

export interface CreateProjectRequestAction extends UnknownAction {
  type: typeof CREATE_PROJECT_REQUEST;
  payload: CreateProjectFormValues;
}
export interface CreateProjectSuccessAction extends UnknownAction {
  type: typeof CREATE_PROJECT_SUCCESS;
  payload: Project;
}
export interface CreateProjectFailureAction extends UnknownAction {
  type: typeof CREATE_PROJECT_FAILURE;
  payload: string;
}

export interface UpdateProjectRequestAction extends UnknownAction {
  type: typeof UPDATE_PROJECT_REQUEST;
  payload: UpdateProjectPayload;
}
export interface UpdateProjectSuccessAction extends UnknownAction {
  type: typeof UPDATE_PROJECT_SUCCESS;
  payload: Project;
}
export interface UpdateProjectFailureAction extends UnknownAction {
  type: typeof UPDATE_PROJECT_FAILURE;
  payload: string;
}

export interface OpenCreateProjectModalAction extends UnknownAction {
  type: typeof OPEN_CREATE_PROJECT_MODAL;
}
export interface CloseCreateProjectModalAction extends UnknownAction {
  type: typeof CLOSE_CREATE_PROJECT_MODAL;
}

export type ProjectsAction =
  | FetchProjectsRequestAction
  | FetchProjectsSuccessAction
  | FetchProjectsFailureAction
  | CreateProjectRequestAction
  | CreateProjectSuccessAction
  | CreateProjectFailureAction
  | UpdateProjectRequestAction
  | UpdateProjectSuccessAction
  | UpdateProjectFailureAction
  | OpenCreateProjectModalAction
  | CloseCreateProjectModalAction;

export const fetchProjectsRequest = (): FetchProjectsRequestAction => ({ type: FETCH_PROJECTS_REQUEST });
export const fetchProjectsSuccess = (payload: Project[]): FetchProjectsSuccessAction => ({
  type: FETCH_PROJECTS_SUCCESS,
  payload,
});
export const fetchProjectsFailure = (payload: string): FetchProjectsFailureAction => ({
  type: FETCH_PROJECTS_FAILURE,
  payload,
});

export const createProjectRequest = (payload: CreateProjectFormValues): CreateProjectRequestAction => ({
  type: CREATE_PROJECT_REQUEST,
  payload,
});
export const createProjectSuccess = (payload: Project): CreateProjectSuccessAction => ({
  type: CREATE_PROJECT_SUCCESS,
  payload,
});
export const createProjectFailure = (payload: string): CreateProjectFailureAction => ({
  type: CREATE_PROJECT_FAILURE,
  payload,
});

export const updateProjectRequest = (payload: UpdateProjectPayload): UpdateProjectRequestAction => ({
  type: UPDATE_PROJECT_REQUEST,
  payload,
});
export const updateProjectSuccess = (payload: Project): UpdateProjectSuccessAction => ({
  type: UPDATE_PROJECT_SUCCESS,
  payload,
});
export const updateProjectFailure = (payload: string): UpdateProjectFailureAction => ({
  type: UPDATE_PROJECT_FAILURE,
  payload,
});

export const openCreateProjectModal = (): OpenCreateProjectModalAction => ({ type: OPEN_CREATE_PROJECT_MODAL });
export const closeCreateProjectModal = (): CloseCreateProjectModalAction => ({ type: CLOSE_CREATE_PROJECT_MODAL });
