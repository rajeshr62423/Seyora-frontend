import { apiFetch } from "./client";

// Mirrors seyora-backend's src/auth/auth.types.ts AuthUser shape, which
// already matches redux/auth/type.ts#AuthUser exactly.
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
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
