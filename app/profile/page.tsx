"use client";

import { useEffect, useState } from 'react';
import { authService } from '@/lib/services/authService';

export default function ProfilePage() {
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    authService.getUserProfile().then(setPlayer).catch(() => {});
  }, []);

  // Badge Logic based on score
  const getBadge = (score: number) => {
    if (score >= 3000) return { name: "LEGEND", color: "text-cyan-400" };
    if (score >= 1500) return { name: "MASTER", color: "text-yellow-400" };
    return { name: "NOVICE", color: "text-orange-500" };
  };

  if (!player) return <div className="text-yellow-100">Loading Quest...</div>;

  const badge = getBadge(player.score);

  return (
    <div className="min-h-screen bg-[#1a0f0a] flex items-center justify-center p-4">
      <div className="bg-[#2D1B13] border-4 border-[#1a100c] p-8 rounded-xl max-w-sm w-full text-center">
        {/* Profile Pic - Backend uses player.imageLink */}
        <img src={player.image || "/avatar/default.png"} className="w-24 h-24 rounded-full mx-auto border-4 border-[#8B735B]" alt="Profile" />
        
        <div className={`mt-4 font-bold ${badge.color}`}>{badge.name}</div>
        <h1 className="text-2xl text-[#FFD700] mt-2 uppercase">{player.name}</h1>
        
        <div className="mt-6 space-y-2 text-[#FFE0B2]">
          <div className="flex justify-between"><span>Score:</span> <span>{player.score}</span></div>
          <div className="flex justify-between"><span>Rank:</span> <span>#{player.rank}</span></div>
        </div>

        <button onClick={() => authService.logout()} className="mt-8 text-red-500 text-xs font-bold hover:underline">
          LOGOUT
        </button>
      </div>
    </div>
  );
}