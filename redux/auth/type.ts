export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
