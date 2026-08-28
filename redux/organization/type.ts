import type { Organization, OrganizationMember, OrgRole } from "@/types/organization";

export interface OrganizationState {
  current: Organization | null;
  // The caller's own role/permissions in `current` — for UI visibility
  // only (hasPermission()); the backend enforces every real check itself,
  // this is never trusted as the source of authorization. Populated by the
  // same fetchOrganizationRequest that populates `current`, no new fetch.
  myRole: OrgRole | null;
  myPermissions: string[];
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
  directoryItems: OrganizationMember[];
  directoryPage: number;
  directoryPageSize: number;
  directoryTotal: number;
  directoryTotalPages: number;
  directoryLoading: boolean;
  directoryError: string | null;
  memberRoleUpdating: boolean;
  memberRoleError: string | null;
  invitesSending: boolean;
  invitesError: string | null;
  logoUploading: boolean;
  logoError: string | null;
}

export interface UpdateMemberRolePayload {
  userId: string;
  role: OrgRole;
}

export interface FetchMemberDirectoryPayload {
  page: number;
  pageSize: number;
  search?: string;
}
