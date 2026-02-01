// components/providers/ContentWrapper.tsx
"use client"; // This is the magic line

import { useAuth } from "@/contexts/AuthContext";
import Profile from "@/components/Profile";

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white tracking-widest animate-pulse">
          INITIALIZING...
        </div>
      </div>
    );
  }

  return (
    <>
      {user && <Profile />}
      {children}
    </>
  );
}