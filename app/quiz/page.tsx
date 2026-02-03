"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Rules from "@/components/Rules";
import { MyMap } from "@/components/MyMap";
import { apiRequest } from "@/lib/api";
import ClueBox from "@/components/Cluebox";
import { toast } from "sonner"; // Import Sonner

export default function QuizPage() {
  const router = useRouter();

  const [showRules, setShowRules] = useState(false);
  const [showClues, setShowClues] = useState(false);

  const [roundData, setRoundData] = useState<any>(null);
  const [clues, setClues] = useState<any[]>([]);
  const [mapCentre, setMapCentre] = useState<[number, number]>([23.48, 87.32]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    initRound();
  }, []);

  const initRound = async () => {
    setLoading(true);
    await fetchCurrentRound();
    await fetchClueData();
    setLoading(false);
  };

  const fetchCurrentRound = async () => {
    try {
      setError("");
      setAuthError(false);
      const data = await apiRequest("quiz/getRound");
      if (data.status === 200) {
        setRoundData(data.question);
        setMapCentre(data.centre);
      } else if (data.status === 410) {
        setError("The quiz has not started yet or has ended.");
      }
    } catch (err: any) {
      if (err.needsReauth || (err.status === 500 && err.message.includes("account is incomplete"))) {
        setAuthError(true);
        setError(err.message || "Please register again with Google");

        setTimeout(() => {
          router.push("/register?error=incomplete_profile");
        }, 3000);
        return;
      }
      setRoundData({ question: "The Golden Ratio is hidden within the architecture of the Parthenon. Find the next sequence." });
      setMapCentre([23.48, 87.32]);
    }
  };

  const fetchClueData = async () => {
    try {
      const data = await apiRequest("quiz/getClue");
      if (data.status === 200) setClues(data.clues);
    } catch (err: any) {
      if (err.needsReauth) return;
      setClues([
        { id: 1, question: "Look near the ancient pillars.", solved: false },
        { id: 2, question: "Where the shadow falls at noon.", solved: true },
        { id: 3, question: "The code is written in stone.", solved: false },
      ]);
    }
  };

  const handleSubmit = async () => {
    const formattedAnswer = answer.trim().toLowerCase();
    if (!formattedAnswer) return;

    try {
      setSubmitting(true);
      const data = await apiRequest("quiz/checkRound", {
        method: "POST",
        body: JSON.stringify({ answer: formattedAnswer }),
      });

      if (data.status === 200) {
        setAnswer("");

        // 1. Success Notification
        toast.success("Correct!", {
          description: "You have conquered this round. Returning to the map in 3 seconds...",
          style: { background: "#1a100c", color: "#C6AD8B", border: "1px solid #C6AD8B" }
        });

        // 2. Automatic Redirect after 3 seconds
        setTimeout(() => {
          router.push("/home");
        }, 3000);

        // We still call initRound if you want the state refreshed before leaving
        initRound();
      } else {
        toast.error("Incorrect", {
          description: "The archives remain silent. Try again!",
          style: { background: "#2D1B13", color: "#FFB3B3", border: "1px solid #FF0000" }
        });
      }
    } catch (err: any) {
      if (err.needsReauth) {
        router.push("/register?error=incomplete_profile");
        return;
      }
      toast.error("Submission Error", {
        description: err.data?.message || "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#3E2723]">
      <div className="relative z-[60]">
        <Navbar />
      </div>

      {/* Background Section */}
      <div className="absolute inset-0 z-0">
        <Image src="/bg.jpeg" alt="Quiz Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Action Buttons (Leaderboard/Rules) */}
      <div className="absolute top-0 left-0 w-full z-50 flex items-start justify-between p-4 min-h-[5rem]">
        <button onClick={() => router.push("/leaderboard")} className="hidden md:block absolute left-[15%] top-0 w-38 h-32 cursor-pointer hover:scale-105 transition-transform">
          <Image src="/logo/leaderboard.png" alt="Leaderboard" fill className="object-contain object-top" />
        </button>

        <button onClick={() => setShowRules(true)} className="hidden md:block absolute right-[15%] top-0 w-39 h-34 cursor-pointer hover:scale-105 transition-transform">
          <Image src="/logo/rules.png" alt="Rules" fill className="object-contain object-top" />
        </button>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 pt-32 pb-32 md:pt-4 md:pb-4">
        {/* Royal Archive Card */}
        <div
          className="flex flex-col md:flex-row w-full max-w-6xl h-auto md:h-[65vh] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-transform duration-300"
          style={{
            // Rich Mahogany Gradient Base
            background: 'linear-gradient(180deg, #2a1810 0%, #1f100b 100%)',
            // Double Border effect using box-shadow
            boxShadow: '0 0 0 1px #4e342e, 0 0 0 4px #1a0f0a, 0 0 20px rgba(0,0,0,0.8)'
          }}
        >
          {/* Texture Overlay (Noise) */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          />

          {/* Decorative Corner Borders (Gold Inlay) */}
          <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#8d6e63]/30 rounded-lg pointer-events-none z-10" />
          <div className="absolute top-3 left-3 right-3 bottom-3 border border-[#8d6e63]/10 rounded-lg pointer-events-none z-10" />

          {/* Left Panel: The Riddle Tablet */}
          <div className="relative w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center z-20">

            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-[#8d6e63] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#8d6e63] font-serif tracking-widest text-sm uppercase">Unlocking Archives...</p>
              </div>
            ) : authError ? (
              <div className="w-full max-w-md space-y-4 text-center">
                <p className="text-red-400 font-serif text-lg">{error}</p>
                <button
                  onClick={() => router.push("/register")}
                  className="text-[#8d6e63] border-b border-[#8d6e63] hover:text-[#bcaaa4] transition-colors font-serif text-sm"
                >
                  Restore Identification
                </button>
              </div>
            ) : error ? (
              <div className="px-6 py-3 bg-[#3e2723] border border-red-900/50 text-red-300 font-serif text-center rounded shadow-inner">
                {error}
              </div>
            ) : (
              <div className="w-full max-w-lg space-y-8">
                {/* Question Header */}
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3 opacity-50">
                    <span className="h-[1px] w-8 bg-[#8d6e63]"></span>
                    <span className="text-[#8d6e63] text-xs font-serif uppercase tracking-[0.25em]">Enigma</span>
                    <span className="h-[1px] w-8 bg-[#8d6e63]"></span>
                  </div>
                  <h2
                    className="text-2xl md:text-3xl text-[#eaddcf] leading-snug drop-shadow-md"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                  >
                    {roundData?.question}
                  </h2>
                </div>

                {/* Input Field (Inlaid Dark Wood) */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#1a0f0a] rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border-b border-[#3e2723]" />
                  <input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Inscribe your answer..."
                    className="relative w-full p-4 text-center text-xl bg-transparent text-[#eaddcf] placeholder-[#5d4037] focus:outline-none focus:placeholder-[#8d6e63]/50 transition-colors font-serif tracking-wide"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  />
                </div>

                {/* Interactive Plaques (Buttons) */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <button
                    onClick={() => setShowClues(true)}
                    className="px-8 py-3 bg-[#3e2723] text-[#bcaaa4] border border-[#5d4037] rounded shadow-[0_4px_0_#271c19] hover:translate-y-[2px] hover:shadow-[0_2px_0_#271c19] hover:bg-[#4e342e] transition-all font-serif tracking-widest text-sm uppercase flex items-center gap-2 justify-center group"
                  >
                    <span className="opacity-70 group-hover:opacity-100">✦</span> Clues
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !answer.trim()}
                    className="px-10 py-3 bg-[#ffd54f]/10 text-[#ffecb3] border border-[#ffca28]/40 rounded shadow-[0_4px_0_#4e342e] hover:translate-y-[2px] hover:shadow-[0_2px_0_#4e342e] hover:bg-[#ffd54f]/20 transition-all font-serif tracking-widest text-sm uppercase font-bold disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                  >
                    {submitting ? "Verifying..." : "Submit Board"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Map with Frame */}
          <div className="relative w-full md:w-1/2 bg-[#1a0f0a] shadow-[inset_10px_0_30px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 z-20 pointer-events-none border-t md:border-t-0 md:border-l border-[#3e2723]/50" />
            <div className="w-full h-full opacity-90 mix-blend-normal">
              <MyMap center={mapCentre} clues={clues} />
            </div>
          </div>
        </div>
      </div>

      <Rules open={showRules} onClose={() => setShowRules(false)} />
      {showClues && (
        <ClueBox clues={clues} onClose={() => setShowClues(false)} refreshClues={fetchClueData} />
      )}
    </div>
  );
}