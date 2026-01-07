import { apiRequest } from "@/lib/api";

export async function getLeaderboard() {
  return apiRequest("quiz/leaderboard");
}

export async function saveLeaderboard() {
  return apiRequest("quiz/saveLeaderBoard", {
    method: "POST",
  });
}
