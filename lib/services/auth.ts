import { apiRequest } from "@/lib/api";

const setSession = (data: any) => {
  // Support different backend token keys
  const token = data.token || data.auth_token || data.key;

  console.log("🔑 Setting session, token =", token);

  if (!token) {
    console.error("❌ Login response missing token:", data);
    return;
  }

  // Client storage
  if (typeof window !== "undefined") {
    localStorage.setItem("df_token", token);
    if (data.user) {
      localStorage.setItem("df_user", JSON.stringify(data.user));
    }
  }

  // Cookie for SSR + proxy
  document.cookie = `df_token=${token}; path=/; max-age=86400; SameSite=Lax`;
};

/* ---------- LOGIN ---------- */
export async function loginUser(payload: {
  type: string;
  accesstoken?: string;
  accesscode?: string;
}) {
  const data = await apiRequest("quiz/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  console.log("🟢 LOGIN RESPONSE:", data);

  setSession(data);
  return data;
}

/* ---------- REGISTER ---------- */
export async function registerUser(payload: {
  type: string;
  accesstoken?: string;
  accesscode?: string;
}) {
  const data = await apiRequest("quiz/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  console.log("🟢 REGISTER RESPONSE:", data);

  setSession(data);
  return data;
}

/* ---------- LOGOUT ---------- */
export async function logoutUser() {
  try {
    await apiRequest("quiz/auth/logout/", {
      method: "POST",
    });
  } catch (err) {
    console.warn("⚠️ Server-side logout failed, cleaning locally anyway");
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("df_token");
      localStorage.removeItem("df_user");
    }

    document.cookie =
      "df_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }
}
