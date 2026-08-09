// lib/api.ts
const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, "");

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const cleanEndpoint = endpoint.replace(/^\//, "");
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

  // Try to get token from localStorage first, then cookies
  let token: string | null = null;
  
  if (typeof window !== "undefined") {
    token = localStorage.getItem("df_token") || getCookie("df_token");
  }

  let res: Response;

  try {
    res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Token ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (networkError) {
    throw {
      status: 0,
      message: "Network error / backend unreachable",
    };
  }

  const text = await res.text();

  // SAFELY parse JSON
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null; // backend returned HTML
  }

  // HANDLE errors
  if (!res.ok) {
    console.warn("Backend error:", res.status);

    throw {
      status: res.status,
      data,
      message:
        data?.detail ||
        data?.message ||
        (res.status === 500
          ? "Server error"
          : `HTTP ${res.status}`),
    };
  }

  return data;
}