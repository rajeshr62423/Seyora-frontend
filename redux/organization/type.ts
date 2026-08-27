import type { Organization, OrganizationMember, OrgRole } from "@/types/organization";

export interface OrganizationState {
  current: Organization | null;
  // True once GET /organizations/me has confirmed (via a 404) that the
  // authenticated user has no organization yet. Distinct from `loading`
  // false + `current` null on initial mount, which just means "not fetched
  // yet" — see FETCH_ORGANIZATION_NOT_FOUND.
  hasNoOrganization: boolean;
  loading: boolean;
  error: string | null;
  creating: boolean;
  createError: string | null;
  updating: boolean;
  updateError: string | null;
  members: OrganizationMember[];
  membersLoading: boolean;
  membersError: string | null;
  memberRoleUpdating: boolean;
  memberRoleError: string | null;
  invitesSending: boolean;
  invitesError: string | null;
}

export interface UpdateMemberRolePayload {
  userId: string;
  role: OrgRole;
}
