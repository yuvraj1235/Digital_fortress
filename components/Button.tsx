"use client";

import { useRouter } from 'next/navigation';

interface ProceedButtonProps {
  round: number | string;
}

export default function ProceedButton({ round }: ProceedButtonProps) {
  const router = useRouter();

  const handleNavigation = () => {
    // Redirects to /quiz/[roundNumber]
    router.push(`/quiz`);
  };

  return (
    <button
      onClick={handleNavigation}
      className="group relative px-8 py-4 bg-[#1a1200] text-[#ffecd1] font-bold rounded-xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#C6A355]/30 hover:border-[#C6A355] hover:shadow-[0_0_30px_rgba(198,163,85,0.3)] active:scale-95 overflow-hidden"
    >
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      {/* Scanning Line Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C6A355]/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

      <div className="relative flex items-center gap-3 z-10">
        <div className="h-2 w-2 rounded-full bg-[#C6A355] shadow-[0_0_10px_#C6A355] animate-pulse" />
        <span className="font-serif tracking-widest uppercase text-sm md:text-base">Enter Round {round}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C6A355] group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
      </div>
    </button>
  );
}