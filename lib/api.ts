// lib/api.ts
const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, "");

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const cleanEndpoint = endpoint.replace(/^\//, "");
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("df_token")
      : null;

  console.log("🔐 Using token:", token);
  console.log("➡️ API Request:", url);

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

  // ✅ SAFELY parse JSON
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null; // backend returned HTML
  }

  // ✅ HANDLE 500 GRACEFULLY
  if (!res.ok) {
    console.warn("⚠️ Backend error:", res.status, text);

    throw {
      status: res.status,
      data,
      message:
        data?.detail ||
        data?.message ||
        (res.status === 500
          ? "Server error (handled safely)"
          : `HTTP ${res.status}`),
    };
  }

  return data;
}
