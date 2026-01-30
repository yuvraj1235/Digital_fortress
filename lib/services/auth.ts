import { apiRequest } from "@/lib/api";

const setSession = (data: any) => {
  if (data.status === 200 && data.token) {
    // Client storage
    if (typeof window !== "undefined") {
      localStorage.setItem("df_token", data.token);
      localStorage.setItem("df_user", JSON.stringify(data.user));
    }

    // Server + Client (cookie for SSR)
    document.cookie = `df_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
  }
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
    console.error("Server-side logout failed:", err);
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("df_token");
      localStorage.removeItem("df_user");
    }

    document.cookie =
      "df_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }
}
