import { apiRequest } from "@/lib/api";

export const authService = {
  // Fetches player profile
  async getUserProfile() {
    try {
      const response = await apiRequest("quiz/user", {
        method: "GET",
      });

      // apiRequest already throws on non-2xx
      // So if we are here, it's SUCCESS
      return {
        name: response.name,
        first_name: response.first_name,
        score: response.score,
        rank: response.rank,
        email: response.email,
        image: response.imageLink || response.image, // safety
        roundNo: response.roundNo,
        status: response.status, // if backend sends it
      };
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      await apiRequest("quiz/auth/logout/", {
        method: "POST",
      });
    } catch (error) {
      console.warn("Server-side logout failed, clearing local session anyway");
    } finally {
      // ✅ Correct token key
      localStorage.removeItem("df_token");
      localStorage.removeItem("df_user");

      document.cookie =
        "df_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

      window.location.href = "/login";
    }
  },
};
