export const TOKEN_KEY = "access_token" as const;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new StorageEvent("storage", { key: TOKEN_KEY })); // notifica listeners
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new StorageEvent("storage", { key: TOKEN_KEY })); // notifica listeners
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function authHeader(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
