// lib/api.ts

const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!RAW_API_BASE_URL) {
  console.error("❌ NEXT_PUBLIC_API_URL is NOT defined!");
}

const API_BASE_URL = RAW_API_BASE_URL
  ? RAW_API_BASE_URL.replace(/\/$/, "")
  : "";

console.log("🌐 API_BASE_URL =", API_BASE_URL);

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  if (!API_BASE_URL) {
    throw {
      status: 0,
      message: "API base URL not configured. Set NEXT_PUBLIC_API_URL."
    };
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("df_token")
      : null;

  // Normalize endpoint (remove leading slash)
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
    });

    clearTimeout(timeoutId);

    const text = await res.text();
    let data: any = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      console.error("❌ Invalid JSON from server:", text);
      data = { message: "Invalid JSON response from server" };
    }

    // Auto logout on token expiry
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("df_token");
      localStorage.removeItem("df_user");
    }

    if (!res.ok) {
      console.error("❌ API Error:", res.status, data);
      throw {
        status: res.status,
        data,
        message: data.message || `HTTP ${res.status}`,
      };
    }

    console.log("✅ API Response:", data);
    return data;

  } catch (error: any) {
    if (error.name === "AbortError") {
      throw { status: 408, message: "Request timed out" };
    }

    if (error.status) throw error;

    console.error("❌ Network/Server error:", error);

    throw {
      status: 0,
      message: "Server unreachable or CORS/network error",
      error,
    };
  }
}
