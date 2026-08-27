const REMEMBERED_EMAIL_KEY = "seyora_remembered_email";

// "Remember me" checked -> pre-fill the login form's email next time, even
// after logout (that's the whole point). Deliberately separate from
// token-storage.ts: this is a plain, non-sensitive string always in
// localStorage regardless of the token storage choice, and clearTokens()
// on logout must NOT touch it.
export function getRememberedEmail(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REMEMBERED_EMAIL_KEY);
}

export function setRememberedEmail(email: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
}

export function clearRememberedEmail(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
}
