import { apiRequest } from "@/lib/api";
/* ---------- LOGIN ---------- */
export async function loginUser(payload: any) {
  return await apiRequest("quiz/auth/login/", { // Added slash here
    method: "POST",
    body: JSON.stringify(payload),
  });
}
/* ---------- REGISTER ---------- */
export async function registerUser(payload: any) {
  // Check if your backend actually uses 'auth/' in the path
  // Try 'quiz/register/' if 'quiz/auth/register/' fails
  const data = await apiRequest("quiz/auth/register/", { 
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
}