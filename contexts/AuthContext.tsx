"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/services/auth";

// --- Types ---
interface User {
  name: string;
  first_name: string;
  email: string;
  imageLink: string;
  score: number;
  roundNo: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void; // Added for easy score/round updates
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider ---
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("df_token");
    const storedUser = localStorage.getItem("df_user");
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Session restore failed:", err);
        clearAuthData();
      }
    }
    setIsLoading(false);
  }, []);

  const clearAuthData = () => {
    setUser(null);
    localStorage.removeItem("df_token");
    localStorage.removeItem("df_user");
    // Clear the cookie for Middleware
    document.cookie = "df_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
  };

  const logout = async () => {
    try {
      // Notify Django backend to invalidate the Knox token
      await logoutUser();
    } catch (err) {
      console.error("Backend logout failed, clearing local session anyway:", err);
    } finally {
      clearAuthData();
      router.push("/login");
      router.refresh(); // Forces Middleware to re-evaluate immediately
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

// --- Hook ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}