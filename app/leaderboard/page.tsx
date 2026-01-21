"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Cinzel, Cinzel_Decorative } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"] });
const cinzelDecorative = Cinzel_Decorative({
    weight: ["700", "900"],
    subsets: ["latin"],
});

const data = [
    { name: "NAME_ONE", points: 100 },
    { name: "NAME_TWO", points: 95 },
    { name: "NAME_THREE", points: 90 },
    { name: "NAME_FOUR", points: 85 },
    { name: "NAME_FIVE", points: 80 },
    { name: "NAME_SIX", points: 75 },
    { name: "NAME_SEVEN", points: 70 },
    { name: "NAME_EIGHT", points: 80 },
    { name: "NAME_NINE", points: 75 },
    { name: "NAME_TEN", points: 70 },
];

export default function LeaderboardPage() {
    const router = useRouter();

    return (
        // Changed overflow-hidden and h-screen to prevent page-level scrolling
        <div className="relative h-screen w-full overflow-hidden bg-black">
            <Navbar />

            {/* BACKGROUND - stays fixed */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/leaderboard/leaderboard-bg.jpeg"
                    alt="Leaderboard Background"
                    fill
                    priority
                    className="object-cover scale-[1.08]"
                />
            </div>

            {/* MAIN CONTENT CONTAINER */}
            {/* h-full and flex-col ensures we stay within the screen height */}
            <div className="relative z-10 flex h-full flex-col items-center pt-24 pb-8 px-4">

                {/* TITLE SECTION - Fixed size */}
                <div className="relative flex-shrink-0 mb-4">
                    <Image
                        src="/leaderboard/head_rock.png"
                        alt="Leaderboard"
                        width={400}
                        height={80}
                        priority
                        className="mix-blend-screen object-contain"
                    />
                    <span className={`absolute inset-0 flex items-center justify-center text-[28px] font-black tracking-widest text-[#f3e2c3] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] ${cinzelDecorative.className}`}>
                        LEADERBOARD
                    </span>
                </div>

                {/* TABLE CONTAINER */}
                <div className="w-full max-w-[520px] flex flex-col flex-1 min-h-0 p-6 rounded-xl bg-[#0e1416]/60 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                    <div className={`flex justify-between px-6 pb-4 text-[#d6c08a] font-bold tracking-widest text-xs flex-shrink-0 ${cinzel.className}`}>
                        <span>NAME</span>
                        <span>POINTS</span>
                    </div>

                    {/* INNER SCROLLABLE AREA - Added no-scrollbar here */}
                    <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                        {data.map((item, idx) => (
                            <div key={idx} className="relative flex items-center justify-between px-8 py-4 min-h-[60px] flex-shrink-0">
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src="/leaderboard/rock.png"
                                        alt=""
                                        fill
                                        className="object-stretch mix-blend-lighten opacity-90"
                                    />
                                </div>
                                <span className={`relative z-10 tracking-widest font-bold text-[#f1e6d0] ${cinzel.className}`}>
                                    {item.name}
                                </span>
                                <span className={`relative z-10 font-bold text-cyan-400 ${cinzel.className}`}>
                                    {item.points}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BACK BUTTON - Fixed at bottom */}
                <div className="flex-shrink-0 mt-6">
                    <button
                        onClick={() => router.back()}
                        className="hover:scale-110 active:scale-95 transition-all duration-300 drop-shadow-[0_0_8px_rgba(198,173,139,0.6)] hover:drop-shadow-[0_0_20px_rgba(198,173,139,1)]"
                    >
                        <Image
                            src="/leaderboard/back.png"
                            alt="Back"
                            width={120}
                            height={45}
                            className="object-contain"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
