// components/MuteButton.tsx
"use client";
import { useAudio } from "@/contexts/AudioContext";
import { Volume2, VolumeX } from "lucide-react";

export default function MuteButton() {
  const { isMuted, toggleMute } = useAudio();

  return (
    <button 
      onClick={toggleMute}
      className="p-3 bg-black/40 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/10 transition-all active:scale-90"
      aria-label="Toggle Mute"
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-red-500" />
      ) : (
        <Volume2 className="w-6 h-6 text-white" />
      )}
    </button>
  );
}