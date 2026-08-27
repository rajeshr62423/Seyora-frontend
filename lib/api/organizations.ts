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
  createdAt: string;
  updatedAt: string;
}

interface ApiOrganizationMember {
  id: number;
  organizationId: number;
  userId: number;
  role: OrgRole;
  createdAt: string;
  user: ApiUser;
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

export async function getMyOrganization(): Promise<Organization> {
  const org = await apiFetch<ApiOrganization>("/organizations/me", { method: "GET" });
  return normalizeOrganization(org);
}

export async function updateMyOrganization(input: UpdateOrganizationInput): Promise<Organization> {
  const org = await apiFetch<ApiOrganization>("/organizations/me", { method: "PATCH", body: input });
  return normalizeOrganization(org);
}

export async function listMembers(): Promise<OrganizationMember[]> {
  const members = await apiFetch<ApiOrganizationMember[]>("/organizations/me/members", { method: "GET" });
  return members.map(normalizeMember);
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
