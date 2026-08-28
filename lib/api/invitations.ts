import type { AuthResponse } from "./auth";
import { apiFetch } from "./client";

export interface InvitationPreview {
  organizationName: string;
  role: string;
  email: string;
  expiresAt: string;
}

export interface RegisterViaInvitationInput {
  name: string;
  password: string;
  confirmPassword: string;
}

export function getInvitationPreview(token: string): Promise<InvitationPreview> {
  return apiFetch<InvitationPreview>(`/invitations/${token}`, {
    method: "GET",
    skipAuth: true,
  });
}

// The caller must already be authenticated as the invited email — the
// backend verifies that itself and 403s otherwise.
export function acceptInvitation(token: string): Promise<{ role: string }> {
  return apiFetch<{ role: string }>(`/invitations/${token}/accept`, {
    method: "POST",
  });
}

export function registerViaInvitation(
  token: string,
  input: RegisterViaInvitationInput,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(`/invitations/${token}/register`, {
    method: "POST",
    body: input,
    skipAuth: true,
  });
}
