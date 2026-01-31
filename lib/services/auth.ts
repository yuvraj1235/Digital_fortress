// auth.ts
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

  // ✅ Store user data properly
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
    await apiRequest("quiz/auth/logout", { method: "POST" });
  } catch {}
  finally {
    localStorage.removeItem("df_token");
    localStorage.removeItem("df_user");
    window.location.href = "/login";
  }
}