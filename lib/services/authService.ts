// lib/services/authService.ts
import { apiRequest } from "@/lib/api";

export const authService = {
  /**
   * Fetch current user profile
   * Call this ONLY when you need fresh data, not immediately after login
   */
  async getUserProfile() {
    console.log("👤 Fetching profile...");

    try {
      const response = await apiRequest("quiz/user");

      return {
        name: response.name,
        first_name: response.first_name,
        score: response.score,
        rank: response.rank,
        email: response.email,
        image: response.imageLink || response.image || null,
        roundNo: response.roundNo,
      };
    } catch (err: any) {
      if (err.status === 401) {
        console.warn("⚠️ Not authenticated");
        // Optionally redirect to login
        // window.location.href = "/login";
      }
      throw err;
    }
  },

  async logout() {
    try {
      await apiRequest("quiz/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("df_token");
      localStorage.removeItem("df_user");
      document.cookie = "df_token=; path=/; max-age=0";
      window.location.href = "/login";
    }
  },
};