"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getLeaderboard } from "@/lib/services/leaderboard";

// Define the shape based on your Django 'players_array'
interface PlayerStanding {
  name: string;
  rank: number;
  score: number;
  image: string;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [standings, setStandings] = useState<PlayerStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await getLeaderboard();
        // Django returns: {"standings": [...], "status": 200, ...}
        if (data.status === 200) {
          setStandings(data.standings);
        } else if (data.status === 203) {
          console.warn("Leaderboard is currently hidden by admin.");
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black flex flex-col">
      {/* NAVBAR */}
      <div className="relative z-30">
        <Navbar />
      </div>

      {/* BACKGROUND */}
      <Image
        src="/leaderboard/leaderboard-bg.jpeg"
        alt="Leaderboard Background"
        fill
        priority
        className="object-cover scale-[1.08] translate-y-[-3%]"
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-between pt-24 pb-8 px-4">
        {/* LEADERBOARD TITLE */}
        <div className="relative shrink-0">
          <Image
            src="/leaderboard/head_rock.png"
            alt="Leaderboard"
            width={400}
            height={80}
            priority
          />
          <span className="absolute inset-0 flex items-center justify-center text-[24px] font-bold tracking-widest text-[#f3e2c3]">
            LEADERBOARD
          </span>
        </div>

        {/* TABLE CONTAINER */}
        <div className="mt-6 w-full max-w-[520px] flex-1 min-h-0 flex flex-col p-6 rounded-xl
                     bg-[#0e1416]/70 backdrop-blur-md border border-[#3fb4ff]/60
                     shadow-[0_0_40px_rgba(63,180,255,0.25),inset_0_0_30px_rgba(0,0,0,0.85)]">
          
          <div className="flex justify-between px-6 pb-4 text-[#d6c08a] font-semibold tracking-wider">
            <span>NAME</span>
            <span>POINTS</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 
                          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {loading ? (
              <div className="text-center text-[#f1e6d0] mt-10 animate-pulse">Loading Standings...</div>
            ) : standings.length > 0 ? (
              standings.map((player, idx) => (
                <div
                  key={idx}
                  className="relative flex items-center justify-between px-6 py-4 rounded-md overflow-hidden text-[#f1e6d0] shadow-[0_0_12px_rgba(0,0,0,0.6)]"
                >
                  <Image
                    src="/leaderboard/head_rock.png"
                    alt="Row Background"
                    fill
                    className="object-fill opacity-80"
                  />
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="text-[#3fb4ff] font-bold w-6">{player.rank}.</span>
                    <span className="tracking-wide font-medium">{player.name}</span>
                  </div>
                  <span className="relative z-10 font-bold text-[#3fb4ff]">
                    {player.score}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-[#f1e6d0] mt-10">No data available</div>
            )}
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="relative mt-6 shrink-0">
          <button
            onClick={() => router.back()}
            className="relative hover:scale-105 active:scale-95 transition-transform"
          >
            <Image
              src="/textures/back-button.png"
              alt="Back"
              width={110}
              height={44}
            />
          </button>
        </div>
      </div>
    </div>
  );
}