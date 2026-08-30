"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function LeaderboardButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide on authentication pages, quiz page, and on leaderboard page itself
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");
  const isQuizPage = pathname?.startsWith("/quiz");
  const isLeaderboardPage = pathname === "/leaderboard";

  if (isAuthPage || isQuizPage || isLeaderboardPage) return null;

  return (
    <button
      onClick={() => router.push("/leaderboard")}
      className="relative block w-20 h-10 md:w-24 md:h-12 focus:outline-none cursor-pointer drop-shadow-[0_0_12px_rgba(255,215,0,0.35)] transition-transform duration-200 hover:scale-110 active:scale-95"
      title="Leaderboard"
    >
      <Image
        src="/Leaderboard.png"
        alt="Leaderboard"
        fill
        sizes="(max-width: 768px) 80px, 96px"
        priority
        className="object-contain"
      />
    </button>
  );
}
