// lib/services/auth.ts
import { apiRequest } from "@/lib/api";

const setSession = (data: any) => {
  console.log("🟢 FULL LOGIN RESPONSE =", data);

  const token =
    data.token ||
    data.auth_token ||
    data.key ||
    data?.data?.token;

  console.log("🟢 EXTRACTED TOKEN =", token);

  if (!token) {
    console.error("❌ No token found in login response!");
    return;
  }

  localStorage.setItem("df_token", token);

  if (data.user) {
    localStorage.setItem("df_user", JSON.stringify(data.user));
    console.log("🟢 STORED USER =", data.user);
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

  // ✅ VERIFY player exists by trying to fetch round
  try {
    await apiRequest("quiz/getRound");
  } catch (error: any) {
    // If player doesn't exist, logout and force re-registration
    if (error.needsReauth || error.status === 500) {
      console.error("❌ Player mismatch detected, clearing session");
      localStorage.removeItem("df_token");
      localStorage.removeItem("df_user");
      throw {
        ...error,
        message: "Account setup incomplete. Please logout from Google and register again.",
        forceLogout: true
      };
    }
  }

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

  // ✅ VERIFY player was created properly
  try {
    await apiRequest("quiz/getRound");
  } catch (error: any) {
    if (error.needsReauth || error.status === 500) {
      console.error("❌ Player creation failed");
      localStorage.removeItem("df_token");
      localStorage.removeItem("df_user");
      throw {
        ...error,
        message: "Registration failed. Please try again.",
        forceLogout: true
      };
    }
  }

  return data;
}

/* ---------- LOGOUT ---------- */
export async function logoutUser() {
  try {
    await apiRequest("quiz/auth/logout", { method: "POST" });
  } catch {}
  finally {
    localStorage.removeItem("df_token");
    localStorage.removeItem("df_user");
    window.location.href = "/login";
  }
}