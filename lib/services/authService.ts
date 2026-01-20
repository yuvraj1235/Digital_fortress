import { apiRequest } from "@/lib/api";

export const authService = {
  // Fetches player score, rank, and name
 getUserProfile: async () => {
    try {
      const response = await apiRequest("quiz/user");
      if (response.status === 200) {
        // Now returns { name, score, rank, email, image, roundNo, status }
        return {
            name: response.name,
            score: response.score,
            rank: response.rank,
            email: response.email,
            image: response.imageLink,   // New field
            roundNo: response.roundNo // New field
        };
      }
      throw new Error(response.message || "Failed to fetch profile");
    } catch (error) {
      console.error("Profile Fetch Error:", error);
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