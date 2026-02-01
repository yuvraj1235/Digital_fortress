// lib/services/authService.ts
import { apiRequest } from "@/lib/api";

export const authService = {
  async getUserProfile() {
    try {
      const response = await apiRequest("quiz/user");

      const userData = {
        name: response.name,
        first_name: response.first_name,
        score: response.score,
        rank: response.rank,
        email: response.email,
        image: response.imageLink || response.image || null,
        roundNo: response.roundNo,
      };

      // ✅ 1. Store in LocalStorage for UI use
      localStorage.setItem("df_user", JSON.stringify(userData));

      // ✅ 2. Sync with Cookie for Middleware use
      // We set path=/ so it's available across all routes
      document.cookie = `df_round=${userData.roundNo}; path=/; max-age=86400; SameSite=Lax`;

      return userData;
    } catch (err: any) {
      if (err.status === 401) {
        this.logout();
      }
      throw err;
    }
  },

  async logout() {
    try {
      await apiRequest("auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // ✅ 3. Clear everything
      localStorage.removeItem("df_token");
      localStorage.removeItem("df_user");
      document.cookie = "df_token=; path=/; max-age=0";
      document.cookie = "df_round=; path=/; max-age=0"; // Clear round cookie
      window.location.href = "/login";
    }
  },
};