import { call, put, takeLatest } from "redux-saga/effects";
import {
  createInvitations as createInvitationsApi,
  createOrganization as createOrganizationApi,
  getMyOrganization as getMyOrganizationApi,
  listMembers as listMembersApi,
  removeLogo as removeLogoApi,
  updateMemberRole as updateMemberRoleApi,
  updateMyOrganization as updateMyOrganizationApi,
  uploadLogo as uploadLogoApi,
  type MembersPage,
  type OrganizationWithAccess,
} from "@/lib/api/organizations";
import type { Organization, OrganizationMember } from "@/types/organization";
import {
  createInvitationsFailure,
  createInvitationsSuccess,
  createOrganizationFailure,
  createOrganizationSuccess,
  fetchMemberDirectoryFailure,
  fetchMemberDirectorySuccess,
  fetchMembersFailure,
  fetchMembersSuccess,
  fetchOrganizationFailure,
  fetchOrganizationNotFound,
  fetchOrganizationSuccess,
  removeLogoFailure,
  removeLogoSuccess,
  updateMemberRoleFailure,
  updateMemberRoleSuccess,
  updateOrganizationFailure,
  updateOrganizationSuccess,
  uploadLogoFailure,
  uploadLogoSuccess,
  type CreateInvitationsRequestAction,
  type CreateOrganizationRequestAction,
  type FetchMemberDirectoryRequestAction,
  type UpdateMemberRoleRequestAction,
  type UpdateOrganizationRequestAction,
  type UploadLogoRequestAction,
} from "./action";
import {
  CREATE_INVITATIONS_REQUEST,
  CREATE_ORGANIZATION_REQUEST,
  FETCH_MEMBER_DIRECTORY_REQUEST,
  FETCH_MEMBERS_REQUEST,
  FETCH_ORGANIZATION_REQUEST,
  REMOVE_LOGO_REQUEST,
  UPDATE_MEMBER_ROLE_REQUEST,
  UPDATE_ORGANIZATION_REQUEST,
  UPLOAD_LOGO_REQUEST,
} from "./actionType";

// Generous cap for the "give me effectively everything" bootstrap fetch
// used by role checks and picker dropdowns (state.organization.members) —
// not real pagination. The Team page's own paginated fetch (below) is the
// one place that requests small, real pages.
const BOOTSTRAP_MEMBERS_PAGE_SIZE = 200;

// Exact message thrown by OrganizationsService.getCurrentForUser when the
// authenticated user has no OrganizationMember row yet — not an error to
// surface, a signal to redirect to /onboarding (see AppShell.tsx).
const NO_ORGANIZATION_MESSAGE = "No organization found for this user";

function* handleFetchOrganization() {
  try {
    const org: OrganizationWithAccess = yield call(getMyOrganizationApi);
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
    const result: MembersPage = yield call(listMembersApi, { pageSize: BOOTSTRAP_MEMBERS_PAGE_SIZE });
    yield put(fetchMembersSuccess(result.items));
  } catch (error) {
    yield put(fetchMembersFailure(error instanceof Error ? error.message : "Unable to load members"));
  }
}

function* handleFetchMemberDirectory(action: FetchMemberDirectoryRequestAction) {
  try {
    const result: MembersPage = yield call(listMembersApi, action.payload);
    yield put(fetchMemberDirectorySuccess(result));
  } catch (error) {
    yield put(
      fetchMemberDirectoryFailure(error instanceof Error ? error.message : "Unable to load team members"),
    );
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

function* handleUploadLogo(action: UploadLogoRequestAction) {
  try {
    const org: Organization = yield call(uploadLogoApi, action.payload);
    yield put(uploadLogoSuccess(org));
  } catch (error) {
    yield put(uploadLogoFailure(error instanceof Error ? error.message : "Unable to upload logo"));
  }
}

function* handleRemoveLogo() {
  try {
    const org: Organization = yield call(removeLogoApi);
    yield put(removeLogoSuccess(org));
  } catch (error) {
    yield put(removeLogoFailure(error instanceof Error ? error.message : "Unable to remove logo"));
  }
}

export function* organizationSaga() {
  yield takeLatest(FETCH_ORGANIZATION_REQUEST, handleFetchOrganization);
  yield takeLatest(CREATE_ORGANIZATION_REQUEST, handleCreateOrganization);
  yield takeLatest(UPDATE_ORGANIZATION_REQUEST, handleUpdateOrganization);
  yield takeLatest(FETCH_MEMBERS_REQUEST, handleFetchMembers);
  yield takeLatest(FETCH_MEMBER_DIRECTORY_REQUEST, handleFetchMemberDirectory);
  yield takeLatest(UPDATE_MEMBER_ROLE_REQUEST, handleUpdateMemberRole);
  yield takeLatest(CREATE_INVITATIONS_REQUEST, handleCreateInvitations);
  yield takeLatest(UPLOAD_LOGO_REQUEST, handleUploadLogo);
  yield takeLatest(REMOVE_LOGO_REQUEST, handleRemoveLogo);
}
