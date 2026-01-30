import { apiRequest } from "@/lib/api";

export const authService = {
  async getUserProfile() {
    console.log("👤 Fetching profile...");

    const response = await apiRequest("quiz/user", {
      method: "GET",
    });

    return {
      name: response.name,
      first_name: response.first_name,
      score: response.score,
      rank: response.rank,
      email: response.email,
      image: response.imageLink || response.image || null,
      roundNo: response.roundNo,
    };
  },

  async logout() {
    try {
      await apiRequest("quiz/auth/logout/", { method: "POST" });
    } catch {}
    finally {
      localStorage.removeItem("df_token");
      localStorage.removeItem("df_user");
      window.location.href = "/login";
    }
  }
};
