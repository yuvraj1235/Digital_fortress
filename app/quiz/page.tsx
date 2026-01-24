"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Rules from "@/components/Rules";
import { MyMap } from "@/components/MyMap";
import { apiRequest } from "@/lib/api";
import ClueBox from "@/components/Cluebox";

export default function QuizPage() {
  const router = useRouter();

  const [showRules, setShowRules] = useState(false);
  const [showClues, setShowClues] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [roundData, setRoundData] = useState<any>(null);
  const [clues, setClues] = useState<any[]>([]);
  const [mapCentre, setMapCentre] = useState<[number, number]>([23.48, 87.32]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      const data = await apiRequest("quiz/getRound");
      if (data.status === 200) {
        setRoundData(data.question);
        setMapCentre(data.centre);
      } else if (data.status === 410) {
        setError("The quiz has not started yet or has ended.");
      }
    } catch (err: any) {
      console.warn("API Failed, using MOCK data for Round");
      setRoundData({ question: "The Golden Ratio is hidden within the architecture of the Parthenon. Find the next sequence." });
      setMapCentre([23.48, 87.32]);
      setError("");
    }
  };

  const fetchClueData = async () => {
    try {
      const data = await apiRequest("quiz/getClue");
      if (data.status === 200) setClues(data.clues);
    } catch (err) {
      console.warn("API Failed, using MOCK data for Clues");
      setClues([
        { id: 1, question: "Look near the ancient pillars.", solved: false },
        { id: 2, question: "Where the shadow falls at noon.", solved: true },
        { id: 3, question: "The code is written in stone.", solved: false }
      ]);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    try {
      setSubmitting(true);
      const data = await apiRequest("quiz/checkRound", {
        method: "POST",
        body: JSON.stringify({ answer: answer.trim() }),
      });

      if (data.status === 200) {
        setAnswer("");
        initRound();
        alert("Correct! Moving to next round.");
      } else {
        alert("Wrong Answer. Try again!");
      }
    } catch (err: any) {
      alert(err.data?.message || "Error submitting answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitting) {
      handleSubmit();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#3E2723]">
      <Navbar />

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg.jpeg"
          alt="Quiz Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

       {/* Header Container */}
      <div className="absolute top-0 left-0 w-full z-20 pointer-events-none">

        {/* Leaderboard Button - Left Side */}
         <div className="absolute top-0 left-0 w-full z-20 pointer-events-none flex items-start justify-between p-4 min-h-[5rem]">
        <div onClick={() => router.push("/leaderboard")} className="hidden md:block absolute left-[15%] top-0 w-38 h-32 cursor-pointer pointer-events-auto hover:scale-105 transition-transform">
          <Image src="/logo/leaderboard.png" alt="Back Button" fill className="object-contain object-top" />
        </div>

        <div onClick={() => setShowRules(true)} className="hidden md:block absolute right-[15%] top-0 w-39 h-34 cursor-pointer pointer-events-auto hover:scale-105 transition-transform">
          <Image src="/logo/rules.png" alt="Rules Button" fill className="object-contain object-top" />
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-8 flex min-h-screen flex-col items-center justify-center p-4 pt-32 pb-32 md:pt-4 md:pb-4">
        <div className="flex flex-col md:flex-row w-[calc(95%-20px)] md:w-[calc(80%-20px)] max-w-6xl h-[70vh] md:h-[60vh] bg-[#2D1B13]/90 rounded-xl overflow-hidden shadow-[0_0_60px_rgba(255,230,150,0.5)] translate-y-10 border-4 border-[#1a100c] backdrop-blur-sm">

          {/* Question */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
            {loading ? (
              <p className="text-[#C6AD8B] font-serif text-xl text-center">Loading...</p>
            ) : error ? (
              <p className="text-red-400 font-serif text-center">{error}</p>
            ) : (
              <div className="w-full max-w-md space-y-6">
                <h2 className="text-[#C6AD8B] text-2xl md:text-3xl font-serif text-center leading-relaxed drop-shadow-lg">
                  {roundData?.question}
                </h2>

                <div className="relative">
                  <input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your answer..."
                    className="w-full p-4 text-center text-lg font-serif rounded-lg bg-[#EADDCA] text-[#3E2723] placeholder-[#5D4037]/60 border-4 border-[#8B735B] focus:outline-none focus:border-[#C6AD8B] focus:ring-4 focus:ring-[#C6AD8B]/30 shadow-[0_0_20px_rgba(198,173,139,0.4)] transition-all"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* Clues Button - Bronze/Brown Theme */}
                  <button
                    onClick={() => setShowClues(true)}
                   className="px-8 py-3 bg-gradient-to-b from-[#d1cdcc] to-[#2D1B13] 
           text-[#C6AD8B] font-bold font-serif text-lg rounded-lg 
           border-2 border-[#5D4037] hover:from-[#8B735B] hover:to-[#3E2723] 
           hover:text-[#EADDCA] active:scale-95 transition-all 
           shadow-[0_4px_15px_rgba(0,0,0,0.5)] uppercase tracking-wider"
                  >
                    🔍 Clues
                  </button>

                  {/* Submit Button - Gold/Amber Theme */}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !answer.trim()}
                    className="px-8 py-3 bg-gradient-to-b from-[#C6AD8B] to-[#8B735B] 
               text-[#2D1B13] font-bold font-serif text-lg rounded-lg 
               border-2 border-[#EADDCA] disabled:opacity-40 disabled:grayscale 
               disabled:cursor-not-allowed hover:from-[#DBC1A0] hover:to-[#C6AD8B] 
               hover:scale-105 active:scale-95 transition-all 
               shadow-[0_4px_20px_rgba(198,173,139,0.4)] uppercase tracking-wider"
                  >
                    {submitting ? "⏳ Checking..." : "✓ Submit"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="w-full md:w-1/2 p-4">
            <MyMap center={mapCentre} clues={clues} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <Rules open={showRules} onClose={() => setShowRules(false)} />
      {showClues && (
        <ClueBox
          clues={clues}
          onClose={() => setShowClues(false)}
          refreshClues={fetchClueData}
        />
      )}
    </div>
  );
}