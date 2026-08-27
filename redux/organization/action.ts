import type { UnknownAction } from "redux";
import type { CreateOrganizationInput, InviteEntry, UpdateOrganizationInput } from "@/lib/api/organizations";
import type { Organization, OrganizationMember } from "@/types/organization";
import {
  CREATE_INVITATIONS_FAILURE,
  CREATE_INVITATIONS_REQUEST,
  CREATE_INVITATIONS_SUCCESS,
  CREATE_ORGANIZATION_FAILURE,
  CREATE_ORGANIZATION_REQUEST,
  CREATE_ORGANIZATION_SUCCESS,
  FETCH_MEMBERS_FAILURE,
  FETCH_MEMBERS_REQUEST,
  FETCH_MEMBERS_SUCCESS,
  FETCH_ORGANIZATION_FAILURE,
  FETCH_ORGANIZATION_NOT_FOUND,
  FETCH_ORGANIZATION_REQUEST,
  FETCH_ORGANIZATION_SUCCESS,
  UPDATE_MEMBER_ROLE_FAILURE,
  UPDATE_MEMBER_ROLE_REQUEST,
  UPDATE_MEMBER_ROLE_SUCCESS,
  UPDATE_ORGANIZATION_FAILURE,
  UPDATE_ORGANIZATION_REQUEST,
  UPDATE_ORGANIZATION_SUCCESS,
} from "./actionType";
import type { UpdateMemberRolePayload } from "./type";

export interface FetchOrganizationRequestAction extends UnknownAction {
  type: typeof FETCH_ORGANIZATION_REQUEST;
}
export interface FetchOrganizationSuccessAction extends UnknownAction {
  type: typeof FETCH_ORGANIZATION_SUCCESS;
  payload: Organization;
}
export interface FetchOrganizationFailureAction extends UnknownAction {
  type: typeof FETCH_ORGANIZATION_FAILURE;
  payload: string;
}
export interface FetchOrganizationNotFoundAction extends UnknownAction {
  type: typeof FETCH_ORGANIZATION_NOT_FOUND;
}

export interface CreateOrganizationRequestAction extends UnknownAction {
  type: typeof CREATE_ORGANIZATION_REQUEST;
  payload: CreateOrganizationInput;
}
export interface CreateOrganizationSuccessAction extends UnknownAction {
  type: typeof CREATE_ORGANIZATION_SUCCESS;
  payload: Organization;
}
export interface CreateOrganizationFailureAction extends UnknownAction {
  type: typeof CREATE_ORGANIZATION_FAILURE;
  payload: string;
}

export interface UpdateOrganizationRequestAction extends UnknownAction {
  type: typeof UPDATE_ORGANIZATION_REQUEST;
  payload: UpdateOrganizationInput;
}
export interface UpdateOrganizationSuccessAction extends UnknownAction {
  type: typeof UPDATE_ORGANIZATION_SUCCESS;
  payload: Organization;
}
export interface UpdateOrganizationFailureAction extends UnknownAction {
  type: typeof UPDATE_ORGANIZATION_FAILURE;
  payload: string;
}

export interface FetchMembersRequestAction extends UnknownAction {
  type: typeof FETCH_MEMBERS_REQUEST;
}
export interface FetchMembersSuccessAction extends UnknownAction {
  type: typeof FETCH_MEMBERS_SUCCESS;
  payload: OrganizationMember[];
}
export interface FetchMembersFailureAction extends UnknownAction {
  type: typeof FETCH_MEMBERS_FAILURE;
  payload: string;
}

export interface UpdateMemberRoleRequestAction extends UnknownAction {
  type: typeof UPDATE_MEMBER_ROLE_REQUEST;
  payload: UpdateMemberRolePayload;
}
export interface UpdateMemberRoleSuccessAction extends UnknownAction {
  type: typeof UPDATE_MEMBER_ROLE_SUCCESS;
  payload: OrganizationMember;
}
export interface UpdateMemberRoleFailureAction extends UnknownAction {
  type: typeof UPDATE_MEMBER_ROLE_FAILURE;
  payload: string;
}

export interface CreateInvitationsRequestAction extends UnknownAction {
  type: typeof CREATE_INVITATIONS_REQUEST;
  payload: InviteEntry[];
}
export interface CreateInvitationsSuccessAction extends UnknownAction {
  type: typeof CREATE_INVITATIONS_SUCCESS;
}
export interface CreateInvitationsFailureAction extends UnknownAction {
  type: typeof CREATE_INVITATIONS_FAILURE;
  payload: string;
}

export type OrganizationAction =
  | FetchOrganizationRequestAction
  | FetchOrganizationSuccessAction
  | FetchOrganizationFailureAction
  | FetchOrganizationNotFoundAction
  | CreateOrganizationRequestAction
  | CreateOrganizationSuccessAction
  | CreateOrganizationFailureAction
  | UpdateOrganizationRequestAction
  | UpdateOrganizationSuccessAction
  | UpdateOrganizationFailureAction
  | FetchMembersRequestAction
  | FetchMembersSuccessAction
  | FetchMembersFailureAction
  | UpdateMemberRoleRequestAction
  | UpdateMemberRoleSuccessAction
  | UpdateMemberRoleFailureAction
  | CreateInvitationsRequestAction
  | CreateInvitationsSuccessAction
  | CreateInvitationsFailureAction;

export const fetchOrganizationRequest = (): FetchOrganizationRequestAction => ({ type: FETCH_ORGANIZATION_REQUEST });
export const fetchOrganizationSuccess = (payload: Organization): FetchOrganizationSuccessAction => ({
  type: FETCH_ORGANIZATION_SUCCESS,
  payload,
});
export const fetchOrganizationFailure = (payload: string): FetchOrganizationFailureAction => ({
  type: FETCH_ORGANIZATION_FAILURE,
  payload,
});
export const fetchOrganizationNotFound = (): FetchOrganizationNotFoundAction => ({
  type: FETCH_ORGANIZATION_NOT_FOUND,
});

export const createOrganizationRequest = (payload: CreateOrganizationInput): CreateOrganizationRequestAction => ({
  type: CREATE_ORGANIZATION_REQUEST,
  payload,
});
export const createOrganizationSuccess = (payload: Organization): CreateOrganizationSuccessAction => ({
  type: CREATE_ORGANIZATION_SUCCESS,
  payload,
});
export const createOrganizationFailure = (payload: string): CreateOrganizationFailureAction => ({
  type: CREATE_ORGANIZATION_FAILURE,
  payload,
});

export const updateOrganizationRequest = (payload: UpdateOrganizationInput): UpdateOrganizationRequestAction => ({
  type: UPDATE_ORGANIZATION_REQUEST,
  payload,
});
export const updateOrganizationSuccess = (payload: Organization): UpdateOrganizationSuccessAction => ({
  type: UPDATE_ORGANIZATION_SUCCESS,
  payload,
});
export const updateOrganizationFailure = (payload: string): UpdateOrganizationFailureAction => ({
  type: UPDATE_ORGANIZATION_FAILURE,
  payload,
});

export const fetchMembersRequest = (): FetchMembersRequestAction => ({ type: FETCH_MEMBERS_REQUEST });
export const fetchMembersSuccess = (payload: OrganizationMember[]): FetchMembersSuccessAction => ({
  type: FETCH_MEMBERS_SUCCESS,
  payload,
});
export const fetchMembersFailure = (payload: string): FetchMembersFailureAction => ({
  type: FETCH_MEMBERS_FAILURE,
  payload,
});

export const updateMemberRoleRequest = (payload: UpdateMemberRolePayload): UpdateMemberRoleRequestAction => ({
  type: UPDATE_MEMBER_ROLE_REQUEST,
  payload,
});
export const updateMemberRoleSuccess = (payload: OrganizationMember): UpdateMemberRoleSuccessAction => ({
  type: UPDATE_MEMBER_ROLE_SUCCESS,
  payload,
});
export const updateMemberRoleFailure = (payload: string): UpdateMemberRoleFailureAction => ({
  type: UPDATE_MEMBER_ROLE_FAILURE,
  payload,
});

export const createInvitationsRequest = (payload: InviteEntry[]): CreateInvitationsRequestAction => ({
  type: CREATE_INVITATIONS_REQUEST,
  payload,
});
export const createInvitationsSuccess = (): CreateInvitationsSuccessAction => ({
  type: CREATE_INVITATIONS_SUCCESS,
});
export const createInvitationsFailure = (payload: string): CreateInvitationsFailureAction => ({
  type: CREATE_INVITATIONS_FAILURE,
  payload,
});
