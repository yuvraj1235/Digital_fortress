"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/services/auth";
import { apiRequest } from "@/lib/api"; // Import your api helper

interface User {
  name: string;
  first_name: string;
  email: string;
  imageLink: string;
  score: number;
  roundNo: number;
  rank?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ✅ New: Sync session with Backend on mount
  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem("df_token");
      const storedUser = localStorage.getItem("df_user");

      if (token) {
        try {
          // 1. Try to fetch the latest user data from Django
          // This verifies if the token is still valid on the server
          const freshUser = await apiRequest("quiz/user"); 
          setUser(freshUser);
          localStorage.setItem("df_user", JSON.stringify(freshUser));
        } catch (err: any) {
          console.error("Session verification failed:", err);
          // 2. If backend says 401, clear everything
          if (err.status === 401) {
            clearAuthData();
          } else if (storedUser) {
            // Fallback to local data if it's just a network hiccup
            setUser(JSON.parse(storedUser));
          }
        }
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  const clearAuthData = () => {
    setUser(null);
    localStorage.removeItem("df_token");
    localStorage.removeItem("df_user");
    document.cookie = "df_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Backend logout failed:", err);
    } finally {
      clearAuthData();
      router.push("/login");
      // Use replace instead of refresh for a cleaner redirect
      router.replace("/login"); 
    }
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem("df_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser: (u) => {
          setUser(u);
          if (u) localStorage.setItem("df_user", JSON.stringify(u));
        },
        updateUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}