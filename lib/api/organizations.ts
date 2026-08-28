import type { Organization, OrganizationMember, OrgRole } from "@/types/organization";
import { apiFetch } from "./client";
import { normalizeUser, type ApiUser } from "./users";

interface ApiOrganization {
  id: number;
  name: string;
  slug: string;
  projectPrefix: string;
  timezone: string;
  taskCounter: number;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// GET /organizations/me additionally returns the caller's own role and the
// full set of permissions that role grants — used by the frontend only for
// UI visibility (hiding buttons/nav the user can't act on); the backend
// enforces every actual permission check itself, this is never trusted as
// the source of authorization.
interface ApiOrganizationWithAccess extends ApiOrganization {
  role: OrgRole;
  permissions: string[];
}

interface ApiOrganizationMember {
  id: number;
  organizationId: number;
  userId: number;
  role: OrgRole;
  createdAt: string;
  user: ApiUser;
}

interface ApiMembersPage {
  items: ApiOrganizationMember[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ListMembersParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface MembersPage {
  items: OrganizationMember[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface OrganizationWithAccess extends Organization {
  role: OrgRole;
  permissions: string[];
}

export interface CreateOrganizationInput {
  name: string;
  projectPrefix?: string;
  timezone?: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  projectPrefix?: string;
  timezone?: string;
}

export interface InviteEntry {
  email: string;
  role?: OrgRole;
}

function normalizeOrganization(org: ApiOrganization): Organization {
  return {
    id: String(org.id),
    name: org.name,
    slug: org.slug,
    projectPrefix: org.projectPrefix,
    timezone: org.timezone,
    taskCounter: org.taskCounter,
    logoUrl: org.logoUrl,
    createdAt: org.createdAt.slice(0, 10),
    updatedAt: org.updatedAt.slice(0, 10),
  };
}

function normalizeMember(member: ApiOrganizationMember): OrganizationMember {
  return {
    id: String(member.id),
    organizationId: String(member.organizationId),
    userId: String(member.userId),
    role: member.role,
    createdAt: member.createdAt.slice(0, 10),
    user: normalizeUser(member.user),
  };
}

export async function createOrganization(input: CreateOrganizationInput): Promise<Organization> {
  const org = await apiFetch<ApiOrganization>("/organizations", { method: "POST", body: input });
  return normalizeOrganization(org);
}

export async function getMyOrganization(): Promise<OrganizationWithAccess> {
  const org = await apiFetch<ApiOrganizationWithAccess>("/organizations/me", { method: "GET" });
  return {
    ...normalizeOrganization(org),
    role: org.role,
    permissions: org.permissions,
  };
}

export async function updateMyOrganization(input: UpdateOrganizationInput): Promise<Organization> {
  const org = await apiFetch<ApiOrganization>("/organizations/me", { method: "PATCH", body: input });
  return normalizeOrganization(org);
}

export async function uploadLogo(file: File): Promise<Organization> {
  const form = new FormData();
  form.append("file", file);
  const org = await apiFetch<ApiOrganization>("/organizations/me/logo", { method: "POST", body: form });
  return normalizeOrganization(org);
}

export async function removeLogo(): Promise<Organization> {
  const org = await apiFetch<ApiOrganization>("/organizations/me/logo", { method: "DELETE" });
  return normalizeOrganization(org);
}

export async function listMembers(params: ListMembersParams = {}): Promise<MembersPage> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
  if (params.search) query.set("search", params.search);
  const qs = query.toString();

  const result = await apiFetch<ApiMembersPage>(`/organizations/me/members${qs ? `?${qs}` : ""}`, {
    method: "GET",
  });
  return {
    items: result.items.map(normalizeMember),
    page: result.page,
    pageSize: result.pageSize,
    total: result.total,
    totalPages: result.totalPages,
  };
}

export async function updateMemberRole(userId: string, role: OrgRole): Promise<OrganizationMember> {
  const member = await apiFetch<ApiOrganizationMember>(`/organizations/me/members/${userId}/role`, {
    method: "PATCH",
    body: { role },
  });
  return normalizeMember(member);
}

export async function createInvitations(invites: InviteEntry[]): Promise<void> {
  await apiFetch("/organizations/me/invitations", { method: "POST", body: { invites } });
}
