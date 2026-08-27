import { getInitials } from "@/lib/format";
import type { User } from "@/types/user";
import { apiFetch } from "./client";

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMeInput {
  name?: string;
  role?: string;
}

// Exported for reuse by organizations.ts/projects.ts, which both embed
// PublicUser objects (owner/members[].user) that need the same
// id-stringify + client-derived-initials normalization.
export function normalizeUser(user: ApiUser): User {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    initials: getInitials(user.name),
  };
}

export async function listUsers(search?: string): Promise<User[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const users = await apiFetch<ApiUser[]>(`/users${query}`, { method: "GET" });
  return users.map(normalizeUser);
}

export async function getUser(id: string): Promise<User> {
  const user = await apiFetch<ApiUser>(`/users/${id}`, { method: "GET" });
  return normalizeUser(user);
}

export async function updateMe(input: UpdateMeInput): Promise<User> {
  const user = await apiFetch<ApiUser>("/users/me", { method: "PATCH", body: input });
  return normalizeUser(user);
}
