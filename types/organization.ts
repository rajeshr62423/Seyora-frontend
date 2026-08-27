import type { User } from "./user";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  projectPrefix: string;
  timezone: string;
  taskCounter: number;
  createdAt: string;
  updatedAt: string;
}

export type OrgRole = "OWNER" | "ADMIN" | "MANAGER" | "MEMBER";

// Deliberately NOT flattened with `user` — member.role (permission level)
// and member.user.role (free-text job title) share a field name on two
// different backend objects; flattening would silently clobber one.
export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrgRole;
  createdAt: string;
  user: User;
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
