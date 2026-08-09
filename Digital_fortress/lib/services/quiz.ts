import { apiRequest } from "@/lib/api";

export async function getRound() {
  // Try adding the trailing slash '/'
  return apiRequest("quiz/getRound/");
}

export async function checkRound(payload: { answer: string }) {
  return apiRequest("quiz/checkRound", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}