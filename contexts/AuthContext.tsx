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

// contexts/AuthContext.tsx
useEffect(() => {
  async function initAuth() {
    const token = localStorage.getItem("df_token");
    const storedUser = localStorage.getItem("df_user");

    // STOP: If there is no token, don't even call the backend
    if (!token) {
      setIsLoading(false);
      return; 
    }

    try {
      // Only runs if token exists
      const freshUser = await apiRequest("quiz/user"); 
      setUser(freshUser);
      localStorage.setItem("df_user", JSON.stringify(freshUser));
    } catch (err: any) {
      // Only clear data if it's a genuine 401 (expired token)
      if (err.status === 401) {
        clearAuthData();
      }
    } finally {
      setIsLoading(false);
    }
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
      console.error("Logout failed");
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