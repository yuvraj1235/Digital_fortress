import { apiRequest } from "@/lib/api";

export async function loginUser(payload: any) {
  return await apiRequest("quiz/auth/login", { 
    method: "POST",
    body: JSON.stringify(payload),
  });
}
/* ---------- REGISTER ---------- */
export async function registerUser(payload: any) {
  const data = await apiRequest("quiz/auth/register", { 
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
}