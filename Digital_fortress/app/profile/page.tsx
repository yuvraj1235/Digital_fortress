"use client";

import { useEffect, useState } from 'react';
import { authService } from '@/lib/services/authService';

export default function ProfilePage() {
  // FIX 1: Initialize state from localStorage so it's there on frame 1
  const [player, setPlayer] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("df_user");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  useEffect(() => {
    // Refresh the data from the server to ensure score/rank are current
    authService.getUserProfile()
      .then((data) => {
        setPlayer(data);
      })
      .catch((err) => {
        console.error("Failed to sync profile:", err);
      });
  }, []);

  const getBadge = (score: number) => {
    if (score >= 30) return { name: "LEGEND", color: "text-cyan-400" };
    if (score >= 20) return { name: "MASTER", color: "text-yellow-400" };
    return { name: "NOVICE", color: "text-orange-500" };
  };

  if (!player) return (
    <div className="min-h-screen bg-[#1a0f0a] flex items-center justify-center">
      <div className="text-[#FFD700] font-serif animate-pulse">Summoning your records...</div>
    </div>
  );

  const badge = getBadge(player.score || 0);

  return (
    <div className="min-h-screen bg-[#1a0f0a] flex items-center justify-center p-4">
      <div className="bg-[#2D1B13] border-4 border-[#1a100c] p-8 rounded-xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* FIX 2: Added a 'key' and 'referrerPolicy' for Google/GitHub images */}
        <img 
          key={player.image} 
          src={player.image || "/avatar/default.png"} 
          className="w-24 h-24 rounded-full mx-auto border-4 border-[#8B735B] object-cover shadow-lg" 
          alt="Warrior Avatar"
          referrerPolicy="no-referrer" 
        />
        
        <div className={`mt-4 font-bold tracking-widest ${badge.color}`}>{badge.name}</div>
        <h1 className="text-2xl text-[#FFD700] mt-2 font-serif uppercase tracking-tight">{player.name}</h1>
        
        <div className="mt-6 border-t border-[#8B735B]/30 pt-6 space-y-3 text-[#FFE0B2] font-serif">
          <div className="flex justify-between px-2">
            <span className="opacity-70">CURRENT SCORE</span> 
            <span className="font-bold text-[#FFD700]">{player.score}</span>
          </div>
          <div className="flex justify-between px-2">
            <span className="opacity-70">WORLD RANK</span> 
            <span className="font-bold text-[#3fb4ff]">#{player.rank}</span>
          </div>
        </div>

        <button 
          onClick={() => authService.logout()} 
          className="mt-10 px-6 py-2 border border-red-900/50 text-red-500/70 text-[10px] tracking-[0.3em] font-bold hover:bg-red-900/20 hover:text-red-500 transition-all rounded"
        >
          ABANDON QUEST
        </button>
      </div>
    </div>
  );
}