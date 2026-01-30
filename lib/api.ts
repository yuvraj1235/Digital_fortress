// lib/api.ts

const API_BASE_URL = "/api";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  // 🔴 FORCE client-side token only
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("df_token")
      : null;

  console.log("🔐 Using token:", token); // MUST NOT be null

  const cleanEndpoint = endpoint.replace(/^\//, "");
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Token ${token}` }),
      ...options.headers,
    },
  });

  const text = await res.text();
  let data: any = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: "Invalid JSON response" };
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
