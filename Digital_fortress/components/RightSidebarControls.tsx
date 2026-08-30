"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Profile from "@/components/Profile";
import LeaderboardButton from "@/components/LeaderboardButton";
import MuteButton from "@/components/MuteButton";

export default function RightSidebarControls() {
  const pathname = usePathname();

  // Hide all right-side controls on auth pages and quiz page
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");
  const isQuizPage = pathname?.startsWith("/quiz");

  if (isAuthPage || isQuizPage) return null;

  return (
    <div className="fixed top-5 right-6 z-[100] flex flex-col items-center gap-3 pointer-events-auto">
      <Profile />
      <LeaderboardButton />
      <MuteButton />
    </div>
  );
}
