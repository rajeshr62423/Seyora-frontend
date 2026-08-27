import type { UnknownAction } from "redux";
import type { AppAction } from "../action";
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
import type { OrganizationState } from "./type";

const initialState: OrganizationState = {
  current: null,
  hasNoOrganization: false,
  loading: false,
  error: null,
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
  members: [],
  membersLoading: false,
  membersError: null,
  memberRoleUpdating: false,
  memberRoleError: null,
  invitesSending: false,
  invitesError: null,
};

export function organizationReducer(
  state: OrganizationState = initialState,
  rawAction: UnknownAction,
): OrganizationState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case FETCH_ORGANIZATION_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_ORGANIZATION_SUCCESS:
      return { ...state, loading: false, current: action.payload, hasNoOrganization: false };
    case FETCH_ORGANIZATION_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_ORGANIZATION_NOT_FOUND:
      return { ...state, loading: false, current: null, hasNoOrganization: true };
    case CREATE_ORGANIZATION_REQUEST:
      return { ...state, creating: true, createError: null };
    case CREATE_ORGANIZATION_SUCCESS:
      return { ...state, creating: false, current: action.payload, hasNoOrganization: false };
    case CREATE_ORGANIZATION_FAILURE:
      return { ...state, creating: false, createError: action.payload };
    case UPDATE_ORGANIZATION_REQUEST:
      return { ...state, updating: true, updateError: null };
    case UPDATE_ORGANIZATION_SUCCESS:
      return { ...state, updating: false, current: action.payload };
    case UPDATE_ORGANIZATION_FAILURE:
      return { ...state, updating: false, updateError: action.payload };
    case FETCH_MEMBERS_REQUEST:
      return { ...state, membersLoading: true, membersError: null };
    case FETCH_MEMBERS_SUCCESS:
      return { ...state, membersLoading: false, members: action.payload };
    case FETCH_MEMBERS_FAILURE:
      return { ...state, membersLoading: false, membersError: action.payload };
    case UPDATE_MEMBER_ROLE_REQUEST:
      return { ...state, memberRoleUpdating: true, memberRoleError: null };
    case UPDATE_MEMBER_ROLE_SUCCESS:
      return {
        ...state,
        memberRoleUpdating: false,
        members: state.members.map((m) => (m.id === action.payload.id ? action.payload : m)),
      };
    case UPDATE_MEMBER_ROLE_FAILURE:
      return { ...state, memberRoleUpdating: false, memberRoleError: action.payload };
    case CREATE_INVITATIONS_REQUEST:
      return { ...state, invitesSending: true, invitesError: null };
    case CREATE_INVITATIONS_SUCCESS:
      return { ...state, invitesSending: false };
    case CREATE_INVITATIONS_FAILURE:
      return { ...state, invitesSending: false, invitesError: action.payload };
    default:
      return state;
  }
}
