"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const data = [
  { name: "NAME_ONE", points: 100 },
  { name: "NAME_TWO", points: 95 },
  { name: "NAME_THREE", points: 90 },
  { name: "NAME_FOUR", points: 85 },
  { name: "NAME_FIVE", points: 80 },
];

export default function LeaderboardPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">

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


      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen flex-col items-center
                      justify-between pt-28 pb-10">

        {/* LEADERBOARD TITLE (IMAGE BASED) */}
        <div className="relative mt-4">
          <Image
            src="/leaderboard/head_rock.jpeg"
            alt="Leaderboard"
            width={420}
            height={90}
            priority
          />
          <span
            className="absolute inset-0 flex items-center justify-center
                       text-[26px] font-bold tracking-widest
                       text-[#f3e2c3]"
          >
            LEADERBOARD
          </span>
        </div>

        {/* TABLE CONTAINER */}
        <div
          className="mt-10 w-[520px] p-6 rounded-xl
                     bg-[#0e1416]/70 backdrop-blur-md
                     border border-[#3fb4ff]/60
                     shadow-[0_0_40px_rgba(63,180,255,0.25),
                             inset_0_0_30px_rgba(0,0,0,0.85)]"
        >

          {/* TABLE HEADER */}
          <div className="flex justify-between px-4 pb-4
                          text-[#d6c08a] font-semibold tracking-wider">
            <span>NAME</span>
            <span>POINTS</span>
          </div>

          {/* ROWS */}
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {data.map((item, idx) => (
              <div
                key={idx}
                className="relative flex items-center justify-between
                           px-6 py-4 rounded-md overflow-hidden
                           text-[#f1e6d0]
                           shadow-[0_0_12px_rgba(0,0,0,0.6)]"
              >
                {/* ROW BACKGROUND */}
                <Image
                  src="/leaderboard/rock.jpeg"
                  alt="Row Background"
                  fill
                  className="object-fill"
                />

                {/* ROW CONTENT */}
                <span className="relative z-10 tracking-wide">
                  {item.name}
                </span>
                <span className="relative z-10 font-semibold">
                  {item.points}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTERED BACK BUTTON */}
        <div className="relative mt-12">
          <button
            onClick={() => router.back()}
            className="relative hover:scale-105 transition"
          >
            <Image
              src="/textures/back-button.png"
              alt="Back"
              width={120}
              height={48}
            />
          </button>
        </div>
      </div>
    </div>
  );
}



