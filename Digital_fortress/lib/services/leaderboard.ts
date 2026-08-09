import { apiRequest } from "@/lib/api";

export interface PlayerStanding {
  name: string;
  rank: number;
  score: number;
  image: string;
}

export interface LeaderboardResponse {
  standings: PlayerStanding[];
  safe: boolean;
  status: 200 | 203;
}

export async function getLeaderboard(): Promise<LeaderboardResponse> {
  return apiRequest("quiz/leaderboard");
}

export async function saveLeaderboard(): Promise<void> {
  return apiRequest("quiz/saveLeaderBoard", {
    method: "POST",
  });
}