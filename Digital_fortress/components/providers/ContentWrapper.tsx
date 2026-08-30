// components/providers/ContentWrapper.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import RightSidebarControls from "@/components/RightSidebarControls";

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
      <RightSidebarControls />
      {children}
    </>
  );
}