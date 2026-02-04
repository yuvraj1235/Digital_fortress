"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";

// import MuteButton from "@/components/MuteButton";

export default function SideNav() {
    const router = useRouter();
    const { isMuted, toggleMute } = useAudio();
    const [userImage, setUserImage] = useState("/avatar/default.png");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("df_user");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.image) setUserImage(parsed.image);
                } catch (e) {
                    console.error("Failed to parse user data", e);
                }
            }
        }
    }, []);

    return (
        <div className="fixed right-6 top-24 z-[60] flex flex-col gap-6 items-center">
            {/* 1. Profile */}
            {/* <button
                onClick={() => router.push("/profile")}
                className="group relative flex items-center justify-center w-12 h-12 transition-transform hover:scale-110 active:scale-95"
                title="Profile"
            >
                <div className="absolute inset-0 bg-[#3fb4ff]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-full border border-[#3fb4ff]/50 overflow-hidden group-hover:border-[#3fb4ff] transition-colors">
                    <Image
                        src={userImage}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                    />
                </div>
            </button> */}

            {/* 2. Back Button - Styled consistenly */}
            <button
                onClick={() => router.back()}
                className="group relative flex items-center justify-center w-12 h-12 transition-transform hover:scale-110 active:scale-95"
                title="Go Back"
            >
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white/50 bg-black/40 group-hover:border-white transition-colors">
                    <ArrowLeft className="w-6 h-6 text-white transition-colors group-hover:-translate-x-0.5" />
                </div>
            </button>

            {/* 3. Audio Control */}
            <button
                onClick={toggleMute}
                className="group relative flex items-center justify-center w-12 h-12 transition-transform hover:scale-110 active:scale-95"
                title={isMuted ? "Unmute" : "Mute"}
            >
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white/50 bg-black/40 group-hover:border-white transition-colors">
                    {isMuted ? (
                        <VolumeX className="w-6 h-6 text-white transition-colors" />
                    ) : (
                        <Volume2 className="w-6 h-6 text-white transition-colors" />
                    )}
                </div>
            </button>

            {/* 4. Leaderboard */}
            <button
                onClick={() => router.push("/leaderboard")}
                className="group relative flex items-center justify-center w-12 h-12 transition-transform hover:scale-110 active:scale-95"
                title="Leaderboard"
            >
                <div className="absolute inset-0 bg-[#3fb4ff]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <Image
                    src="/logo/dfCup.png"
                    alt="Leaderboard"
                    width={50}
                    height={50}
                    className="object-contain drop-shadow-[0_0_5px_rgba(63,180,255,0.3)] transition-transform group-hover:scale-110"
                />
            </button>
        </div>
    );
}
