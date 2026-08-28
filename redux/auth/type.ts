export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  avatarUrl: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  // Has the one-time session-restore check (GET /auth/me on app load)
  // completed? Lets the UI distinguish "haven't checked yet" from
  // "confirmed logged out" without touching `loading` (that stays scoped
  // to the login/register button state).
  initialized: boolean;
  avatarUploading: boolean;
  avatarError: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  // "Remember me" — false stores tokens in sessionStorage (cleared when the
  // browser closes) instead of localStorage. Defaults to true when omitted.
  remember?: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterViaInvitationInput {
  token: string;
  name: string;
  password: string;
  confirmPassword: string;
}
