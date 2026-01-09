import { apiRequest } from "@/lib/api";

export const authService = {
  // Fetches player score, rank, and name
  getUserProfile: async () => {
    try {
      const response = await apiRequest("quiz/user");
      if (response.status === 200) {
        return response; // returns { name, score, rank, email, status }
      }
      throw new Error(response.message || "Failed to fetch profile");
    } catch (error) {
      throw error;
    }
  },

  // Clears session and tokens
  logout: async () => {
    try {
      await apiRequest("quiz/logout", { method: "POST" });
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }
};