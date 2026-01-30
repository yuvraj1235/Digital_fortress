// lib/api.ts

const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API_BASE_URL = RAW_API_BASE_URL
  ? RAW_API_BASE_URL.replace(/\/$/, "")
  : "";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const cleanEndpoint = endpoint.replace(/^\//, "");
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

  // ✅ ALWAYS read token here
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("df_token")
      : null;

  console.log("🔐 Using token:", token);
  console.log("➡️ API Request:", url);

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await res.text();
  let data: any = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: "Invalid JSON from server" };
  }

  if (!res.ok) {
    throw {
      status: res.status,
      data,
      message: data.detail || data.message || `HTTP ${res.status}`,
    };
  }

  return data;
}
