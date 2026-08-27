import { call, put, takeLatest } from "redux-saga/effects";
import {
  createInvitations as createInvitationsApi,
  createOrganization as createOrganizationApi,
  getMyOrganization as getMyOrganizationApi,
  listMembers as listMembersApi,
  updateMemberRole as updateMemberRoleApi,
  updateMyOrganization as updateMyOrganizationApi,
} from "@/lib/api/organizations";
import type { Organization, OrganizationMember } from "@/types/organization";
import {
  createInvitationsFailure,
  createInvitationsSuccess,
  createOrganizationFailure,
  createOrganizationSuccess,
  fetchMembersFailure,
  fetchMembersSuccess,
  fetchOrganizationFailure,
  fetchOrganizationNotFound,
  fetchOrganizationSuccess,
  updateMemberRoleFailure,
  updateMemberRoleSuccess,
  updateOrganizationFailure,
  updateOrganizationSuccess,
  type CreateInvitationsRequestAction,
  type CreateOrganizationRequestAction,
  type UpdateMemberRoleRequestAction,
  type UpdateOrganizationRequestAction,
} from "./action";
import {
  CREATE_INVITATIONS_REQUEST,
  CREATE_ORGANIZATION_REQUEST,
  FETCH_MEMBERS_REQUEST,
  FETCH_ORGANIZATION_REQUEST,
  UPDATE_MEMBER_ROLE_REQUEST,
  UPDATE_ORGANIZATION_REQUEST,
} from "./actionType";

// Exact message thrown by OrganizationsService.getCurrentForUser when the
// authenticated user has no OrganizationMember row yet — not an error to
// surface, a signal to redirect to /onboarding (see AppShell.tsx).
const NO_ORGANIZATION_MESSAGE = "No organization found for this user";

function* handleFetchOrganization() {
  try {
    const org: Organization = yield call(getMyOrganizationApi);
    yield put(fetchOrganizationSuccess(org));
  } catch (error) {
    if (error instanceof Error && error.message === NO_ORGANIZATION_MESSAGE) {
      yield put(fetchOrganizationNotFound());
    } else {
      yield put(fetchOrganizationFailure(error instanceof Error ? error.message : "Unable to load organization"));
    }
  }
}

function* handleCreateOrganization(action: CreateOrganizationRequestAction) {
  try {
    const org: Organization = yield call(createOrganizationApi, action.payload);
    yield put(createOrganizationSuccess(org));
  } catch (error) {
    yield put(createOrganizationFailure(error instanceof Error ? error.message : "Unable to create organization"));
  }
}

function* handleUpdateOrganization(action: UpdateOrganizationRequestAction) {
  try {
    const org: Organization = yield call(updateMyOrganizationApi, action.payload);
    yield put(updateOrganizationSuccess(org));
  } catch (error) {
    yield put(updateOrganizationFailure(error instanceof Error ? error.message : "Unable to update organization"));
  }
}

function* handleFetchMembers() {
  try {
    const members: OrganizationMember[] = yield call(listMembersApi);
    yield put(fetchMembersSuccess(members));
  } catch (error) {
    yield put(fetchMembersFailure(error instanceof Error ? error.message : "Unable to load members"));
  }
}

function* handleUpdateMemberRole(action: UpdateMemberRoleRequestAction) {
  try {
    const member: OrganizationMember = yield call(
      updateMemberRoleApi,
      action.payload.userId,
      action.payload.role,
    );
    yield put(updateMemberRoleSuccess(member));
  } catch (error) {
    yield put(updateMemberRoleFailure(error instanceof Error ? error.message : "Unable to update member role"));
  }
}

function* handleCreateInvitations(action: CreateInvitationsRequestAction) {
  try {
    yield call(createInvitationsApi, action.payload);
    yield put(createInvitationsSuccess());
  } catch (error) {
    yield put(createInvitationsFailure(error instanceof Error ? error.message : "Unable to send invitations"));
  }
}

export function* organizationSaga() {
  yield takeLatest(FETCH_ORGANIZATION_REQUEST, handleFetchOrganization);
  yield takeLatest(CREATE_ORGANIZATION_REQUEST, handleCreateOrganization);
  yield takeLatest(UPDATE_ORGANIZATION_REQUEST, handleUpdateOrganization);
  yield takeLatest(FETCH_MEMBERS_REQUEST, handleFetchMembers);
  yield takeLatest(UPDATE_MEMBER_ROLE_REQUEST, handleUpdateMemberRole);
  yield takeLatest(CREATE_INVITATIONS_REQUEST, handleCreateInvitations);
}
