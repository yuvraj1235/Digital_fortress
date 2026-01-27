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
      className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors duration-200 shadow-lg border-2 border-amber-900/50"
    >
      Proceed to Round {round}
    </button>
  );
}