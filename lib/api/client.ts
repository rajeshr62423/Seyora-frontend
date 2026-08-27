import { clearTokens, getAccessToken, getRefreshToken, isRemembered, setTokens } from "./token-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// Every seyora-backend response is wrapped in this envelope
// (see seyora-backend's ResponseInterceptor / HttpExceptionFilter).
interface ApiEnvelope<T> {
  status: "success" | "error";
  code: number;
  data: T;
  message: string;
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Don't attach an Authorization header (login/register/refresh itself). */
  skipAuth?: boolean;
  /** Don't attempt a refresh-and-retry on 401 (used for the refresh call itself). */
  skipRefresh?: boolean;
}

interface RefreshTokensResponse {
  accessToken: string;
  refreshToken: string;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, skipAuth, skipRefresh, headers, ...rest } = options;

  const doFetch = () => {
    const finalHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...(headers as Record<string, string> | undefined),
    };
    if (!skipAuth) {
      const token = getAccessToken();
      if (token) finalHeaders.Authorization = `Bearer ${token}`;
    }
    return fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let response = await doFetch();

  if (response.status === 401 && !skipAuth && !skipRefresh) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      response = await doFetch();
    } else {
      throw new Error("Your session has expired. Please sign in again.");
    }
  }

  const envelope = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || envelope.status === "error") {
    throw new Error(envelope.message || "Something went wrong");
  }
  return envelope.data;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return false;
  }

  try {
    // Preserve whichever storage the session already lives in — a refresh
    // must never silently upgrade a session-only ("remember me" off) login
    // into a persistent one.
    const remember = isRemembered();
    const tokens = await apiFetch<RefreshTokensResponse>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
      skipAuth: true,
      skipRefresh: true,
    });
    setTokens(tokens, remember);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}
