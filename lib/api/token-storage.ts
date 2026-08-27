const ACCESS_TOKEN_KEY = "seyora_access_token";
const REFRESH_TOKEN_KEY = "seyora_refresh_token";

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

// "Remember me" unchecked -> sessionStorage (cleared when the browser
// closes) instead of localStorage (persists indefinitely). Only one of the
// two ever holds a real token at a time; set/clear always touch both so a
// stale copy can never linger in the other one.
function storageFor(remember: boolean): Storage {
  return remember ? window.localStorage : window.sessionStorage;
}

function otherStorageFor(remember: boolean): Storage {
  return remember ? window.sessionStorage : window.localStorage;
}

// SSR-safe: only ever read/written from effects and saga handlers (client
// code), never during initial render, mirroring lib/context/theme-context.tsx.
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY) ?? window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

// Was the current session stored via "remember me" (localStorage) or not
// (sessionStorage)? Lets a mid-session token refresh re-store the new
// access token in the same place, instead of silently upgrading a
// session-only login into a persistent one.
export function isRemembered(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY) !== null;
}

export function setTokens({ accessToken, refreshToken }: StoredTokens, remember = true): void {
  if (typeof window === "undefined") return;
  const target = storageFor(remember);
  const other = otherStorageFor(remember);
  target.setItem(ACCESS_TOKEN_KEY, accessToken);
  target.setItem(REFRESH_TOKEN_KEY, refreshToken);
  other.removeItem(ACCESS_TOKEN_KEY);
  other.removeItem(REFRESH_TOKEN_KEY);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}
