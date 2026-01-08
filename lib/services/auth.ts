import { apiRequest } from "@/lib/api";

/**
 * Helper to handle session storage after successful auth
 */
const setSession = (data: any) => {
  if (data.status === 200 && data.token) {
    localStorage.setItem("df_token", data.token);
    // Sync with cookie for Middleware
    document.cookie = `df_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
    
    if (data.user) {
      localStorage.setItem("df_user", JSON.stringify(data.user));
    }
  }
};

/* ---------- LOGIN ---------- */
export async function loginUser(payload: { type: string; accesstoken?: string; accesscode?: string }) {
  const data = await apiRequest("quiz/auth/login", { 
    method: "POST",
    body: JSON.stringify(payload),
  });
  
  setSession(data);
  return data;
}

/* ---------- REGISTER ---------- */
export async function registerUser(payload: { type: string; accesstoken?: string; accesscode?: string }) {
  const data = await apiRequest("quiz/auth/register", { 
    method: "POST",
    body: JSON.stringify(payload),
  });
  
  setSession(data);
  return data;
}

/* ---------- LOGOUT ---------- */
export async function logoutUser() {
  try {
    // Knox logout requires the token in the header (handled by apiRequest)
    // and a POST request to the correct endpoint
    await apiRequest("quiz/auth/logout/", { 
      method: "POST",
    });
  } catch (err) {
    console.error("Server-side logout failed:", err);
  } finally {
    // Local cleanup is mandatory regardless of server response
    localStorage.removeItem("df_token");
    localStorage.removeItem("df_user");
    document.cookie = "df_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
  }
}