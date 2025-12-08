import { authHeader, clearToken } from "@/utils/auth";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

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

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE_URL}${normalizedPath}`;

  let res: Response;

  try {
    res = await fetch(url, {
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
  } catch (error) {
    console.error("Erro de rede ao chamar API:", url, error);
    throw new Error(
      "Não foi possível se conectar à API. Verifique sua conexão ou tente novamente."
    );
  }

  if (res.status === 401) {
    // token expirado/ausente → limpa e falha
    clearToken();
  }

  if (!res.ok) {
    let message = "";
    let bodyParsed: unknown = null;

    try {
      const contentType = res.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        bodyParsed = await res.json();

        if (typeof bodyParsed === "string") {
          message = bodyParsed;
        } else if (bodyParsed && typeof bodyParsed === "object") {
          const obj = bodyParsed as any;

          if (obj.detail) {
            const detail = obj.detail;

            if (typeof detail === "string") {
              message = detail;
            } else if (Array.isArray(detail)) {
              // FastAPI costuma mandar array de erros
              message = detail
                .map((item) => {
                  if (!item) return "";
                  if (typeof item === "string") return item;
                  if (typeof item.msg === "string") return item.msg;
                  return JSON.stringify(item);
                })
                .filter(Boolean)
                .join(" | ");
            } else {
              message = String(detail);
            }
          } else if (typeof obj.message === "string") {
            message = obj.message;
          }
        }
      } else {
        const txt = await res.text();
        if (txt.trim().length > 0) {
          message = txt;
        }
      }
    } catch {
      // se der erro tentando ler o corpo, cai pro fallback abaixo
    }

    if (!message) {
      message = `${res.status} ${res.statusText}`;
    }

    const error = new Error(message);
    (error as any).status = res.status;
    (error as any).body = bodyParsed;

    throw error;
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

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
