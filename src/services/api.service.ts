import { authHeader, clearToken } from "@/utils/auth";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(
  /\/+$/,
  ""
);
if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL não foi definido. Crie .env.local com NEXT_PUBLIC_API_URL=http://127.0.0.1:8000"
  );
}

type RequestOptions = Omit<RequestInit, "method" | "body"> & {
  auth?: boolean; // default: true
  json?: boolean; // default: true (se body for objeto → JSON)
  cacheMode?: RequestCache; // ex.: "no-store"
};

async function request<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
  opts: RequestOptions = {}
): Promise<T> {
  const {
    auth = true,
    json = true,
    cacheMode = "no-store",
    headers: extraHeaders,
    ...init
  } = opts;

  const headers: HeadersInit = {
    Accept: "application/json",
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(auth ? authHeader() : {}),
    ...(extraHeaders || {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body:
      body != null
        ? json
          ? JSON.stringify(body)
          : (body as BodyInit)
        : undefined,
    cache: cacheMode,
    ...init,
  });

  if (res.status === 401) {
    // token expirado/ausente → limpa e falha
    clearToken();
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`${method} ${res.status} ${res.statusText} — ${txt}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>("GET", path, undefined, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>("POST", path, body, opts),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>("PATCH", path, body, opts),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>("DELETE", path, undefined, opts),
};
