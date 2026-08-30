"use client";

import { useAudio } from "@/contexts/AudioContext";
import { usePathname } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";

export default function MuteButton() {
  const { isMuted, toggleMute } = useAudio();
  const pathname = usePathname();

  // Hide on auth pages and quiz page
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");
  const isQuizPage = pathname?.startsWith("/quiz");
  if (isAuthPage || isQuizPage) return null;

  return (
    <button 
      onClick={toggleMute}
      className="p-2.5 md:p-3 bg-black/50 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all active:scale-90 shadow-lg cursor-pointer flex items-center justify-center"
      aria-label="Toggle Mute"
      title={isMuted ? "Unmute Sound" : "Mute Sound"}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
      ) : (
        <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
      )}
    </button>
  );
}