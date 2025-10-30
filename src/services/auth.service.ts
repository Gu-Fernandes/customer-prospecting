const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const AUTH_TOKEN_KEY = "access_token";
const AUTH_USER_KEY = "auth_user";

type LoginIn = { email: string; password: string };
type LoginOut = {
  access_token: string;
  token_type: "bearer";
  user: { id: string; email: string; name?: string | null; created_at: string };
};

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthSession(token: string, user: LoginOut["user"]) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export async function login(body: LoginIn): Promise<LoginOut> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Login ${res.status} ${res.statusText} — ${txt}`);
  }

  const data = (await res.json()) as LoginOut;
  setAuthSession(data.access_token, data.user);
  return data;
}
