// lib/services/auth.ts
import { apiRequest } from "@/lib/api";

const setSession = (data: any) => {
  const token =
    data.token ||
    data.auth_token ||
    data.key ||
    data?.data?.token;

  if (!token) {
    console.error("Session setup failed");
    return;
  }

  // Store in localStorage
  localStorage.setItem("df_token", token);
  
  // Store in cookies (for middleware)
  document.cookie = `df_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;

  if (data.user) {
    localStorage.setItem("df_user", JSON.stringify(data.user));
  }
};

/* ---------- LOGIN ---------- */
export async function loginUser(payload: {
  type: string;
  accesstoken?: string;
  accesscode?: string;
}) {
  // ADDED 'quiz/' prefix
  const data = await apiRequest("quiz/auth/login", { 
    method: "POST",
    body: JSON.stringify(payload),
  });

  setSession(data);
  return data;
}

/* ---------- REGISTER ---------- */
export async function registerUser(payload: {
  type: string;
  accesstoken?: string;
  accesscode?: string;
}) {
  // ADDED 'quiz/' prefix
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
    await apiRequest("quiz/auth/logout", { method: "POST" });
  } catch (error) {
    // Logout error handled silently
  } finally {
    localStorage.removeItem("df_token");
    localStorage.removeItem("df_user");
    
    // Remove cookie
    document.cookie = "df_token=; path=/; max-age=0";
    
    window.location.href = "/login";
  }
}