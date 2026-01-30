// lib/api.ts

function getToken(): string | null {
  // Client-side
  if (typeof window !== "undefined") {
    return localStorage.getItem("df_token");
  }

  // Server-side (Next.js App Router)
  try {
    // Dynamic import to avoid bundling issues
    // @ts-ignore
    const { cookies } = require("next/headers");
    return cookies().get("df_token")?.value || null;
  } catch (err) {
    return null;
  }
}

const API_BASE_URL = "/api";

console.log("🌐 API_BASE_URL =", API_BASE_URL);

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getToken();

  const cleanEndpoint = endpoint.replace(/^\//, "");
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

  console.log("➡️ API Request:", url);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Token ${token}` }),
        ...options.headers,
      },
      credentials: "include", // ensure cookies are sent
    });

    clearTimeout(timeoutId);

    const text = await res.text();
    let data: any = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: "Invalid JSON response from server" };
    }

    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("df_token");
      localStorage.removeItem("df_user");
      document.cookie = "df_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }

    if (!res.ok) {
      throw {
        status: res.status,
        data,
        message: data.message || `HTTP ${res.status}`,
      };
    }

    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw { status: 408, message: "Request timed out" };
    }

    if (error.status) throw error;

    throw {
      status: 0,
      message: "Server unreachable or network error",
      error,
    };
  }
}
