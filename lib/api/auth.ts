import { apiFetch } from "./client";

// Mirrors seyora-backend's src/auth/auth.types.ts AuthUser shape, which
// already matches redux/auth/type.ts#AuthUser exactly.
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  avatarUrl: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

export function registerRequest(input: RegisterInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: input,
    skipAuth: true,
  });
}

export function loginRequest(input: LoginInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: input,
    skipAuth: true,
  });
}

export function meRequest(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me", { method: "GET" });
}

// Always resolves — the backend returns the same 200 whether or not the
// email is registered, so the caller can never use this to enumerate
// accounts. Never throws for "email not found".
export function forgotPasswordRequest(email: string): Promise<void> {
  return apiFetch<void>("/auth/forgot-password", {
    method: "POST",
    body: { email },
    skipAuth: true,
  });
}

export function resetPasswordRequest(input: ResetPasswordInput): Promise<void> {
  return apiFetch<void>("/auth/reset-password", {
    method: "POST",
    body: input,
    skipAuth: true,
  });
}
