const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("df_token") : null;

  // Normalize URL to prevent double slashes (e.g., //quiz/)
  const cleanEndpoint = endpoint.replace(/^\//, "");
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

  // Add a 10-second timeout
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
    let data;
    
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      data = { message: "Invalid JSON response from server" };
    }

    // HANDLE TOKEN EXPIRATION AUTOMATICALLY
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("df_token");
      localStorage.removeItem("df_user");
      // Optional: window.location.href = "/login";
    }

    if (!res.ok) {
      throw {
        status: res.status,
        data: data,
        message: data.message || `Error ${res.status}`
      };
    }

    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw { status: 408, message: "Request timed out" };
    }
    if (error.status) throw error;
    
    throw {
      status: 0,
      message: "Server unreachable. Check your connection."
    };
  }
}