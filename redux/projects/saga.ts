import { call, put, takeLatest } from "redux-saga/effects";
import {
  createProject as createProjectApi,
  listProjects as listProjectsApi,
  toCreateProjectInput,
  updateProject as updateProjectApi,
} from "@/lib/api/projects";
import type { Project } from "@/types/project";
import {
  createProjectFailure,
  createProjectSuccess,
  fetchProjectsFailure,
  fetchProjectsSuccess,
  updateProjectFailure,
  updateProjectSuccess,
  type CreateProjectRequestAction,
  type UpdateProjectRequestAction,
} from "./action";
import { CREATE_PROJECT_REQUEST, FETCH_PROJECTS_REQUEST, UPDATE_PROJECT_REQUEST } from "./actionType";

function* handleFetchProjects() {
  try {
    const list: Project[] = yield call(listProjectsApi);
    yield put(fetchProjectsSuccess(list));
  } catch (error) {
    yield put(fetchProjectsFailure(error instanceof Error ? error.message : "Unable to load projects"));
  }
}

function* handleCreateProject(action: CreateProjectRequestAction) {
  try {
    const project: Project = yield call(createProjectApi, toCreateProjectInput(action.payload));
    yield put(createProjectSuccess(project));
  } catch (error) {
    yield put(createProjectFailure(error instanceof Error ? error.message : "Unable to create project"));
  }
}

function* handleUpdateProject(action: UpdateProjectRequestAction) {
  try {
    const project: Project = yield call(updateProjectApi, action.payload.id, action.payload.values);
    yield put(updateProjectSuccess(project));
  } catch (error) {
    yield put(updateProjectFailure(error instanceof Error ? error.message : "Unable to update project"));
  }
}

export function* projectsSaga() {
  yield takeLatest(FETCH_PROJECTS_REQUEST, handleFetchProjects);
  yield takeLatest(CREATE_PROJECT_REQUEST, handleCreateProject);
  yield takeLatest(UPDATE_PROJECT_REQUEST, handleUpdateProject);
}
