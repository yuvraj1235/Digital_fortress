// app/home/page.tsx (or wherever your quiz page is)
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

  const [roundData, setRoundData] = useState<any>(null);
  const [clues, setClues] = useState<any[]>([]);
  const [mapCentre, setMapCentre] = useState<[number, number]>([23.48, 87.32]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState(false); // NEW

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
      setAuthError(false); // NEW
      const data = await apiRequest("quiz/getRound");
      if (data.status === 200) {
        setRoundData(data.question);
        setMapCentre(data.centre);
      } else if (data.status === 410) {
        setError("The quiz has not started yet or has ended.");
      }
    } catch (err: any) {
      // ✅ Handle auth error
      if (err.needsReauth || (err.status === 500 && err.message.includes("account is incomplete"))) {
        setAuthError(true);
        setError(err.message || "Please register again with Google");
        
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/register?error=incomplete_profile");
        }, 3000);
        return;
      }

      // Fallback demo data
      setRoundData({
        question:
          "The Golden Ratio is hidden within the architecture of the Parthenon. Find the next sequence.",
      });
      setMapCentre([23.48, 87.32]);
      setError("");
    }
  };

  const fetchClueData = async () => {
    try {
      const data = await apiRequest("quiz/getClue");
      if (data.status === 200) setClues(data.clues);
    } catch (err: any) {
      // ✅ Handle auth error
      if (err.needsReauth) {
        return; // Already handled in fetchCurrentRound
      }

      // Fallback demo data
      setClues([
        { id: 1, question: "Look near the ancient pillars.", solved: false },
        { id: 2, question: "Where the shadow falls at noon.", solved: true },
        { id: 3, question: "The code is written in stone.", solved: false },
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
      // ✅ Handle auth error
      if (err.needsReauth) {
        router.push("/register?error=incomplete_profile");
        return;
      }

      alert(err.data?.message || "Error submitting answer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#3E2723]">
      <div className="relative z-[60]">
        <Navbar />
      </div>

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

      <div className="absolute top-0 left-0 w-full z-50 flex items-start justify-between p-4 min-h-[5rem]">
        <button
          onClick={() => router.push("/leaderboard")}
          className="hidden md:block absolute left-[15%] top-0 w-38 h-32 
                     cursor-pointer hover:scale-105 transition-transform"
        >
          <Image
            src="/logo/leaderboard.png"
            alt="Leaderboard"
            fill
            className="object-contain object-top"
          />
        </button>

        <button
          onClick={() => setShowRules(true)}
          className="hidden md:block absolute right-[15%] top-0 w-39 h-34 
                     cursor-pointer hover:scale-105 transition-transform"
        >
          <Image
            src="/logo/rules.png"
            alt="Rules"
            fill
            className="object-contain object-top"
          />
        </button>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 pt-32 pb-32 md:pt-4 md:pb-4">
        <div className="flex flex-col md:flex-row w-[calc(95%-20px)] md:w-[calc(80%-20px)] max-w-6xl h-[70vh] md:h-[60vh] bg-[#2D1B13]/90 rounded-xl overflow-hidden shadow-[0_0_60px_rgba(255,230,150,0.5)] translate-y-10 border-4 border-[#1a100c] backdrop-blur-sm">

          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
            {loading ? (
              <p className="text-[#C6AD8B] font-serif text-xl text-center">
                Loading...
              </p>
            ) : authError ? (
              // ✅ NEW: Auth error display
              <div className="w-full max-w-md space-y-4 text-center">
                <p className="text-red-400 font-serif text-lg">{error}</p>
                <p className="text-[#C6AD8B] font-serif text-sm">
                  Redirecting to registration...
                </p>
              </div>
            ) : error ? (
              <p className="text-red-400 font-serif text-center">{error}</p>
            ) : (
              <div className="w-full max-w-md space-y-6">
                <h2 className="text-[#C6AD8B] text-2xl md:text-3xl font-serif text-center leading-relaxed drop-shadow-lg">
                  {roundData?.question}
                </h2>

                <input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="w-full p-4 text-center text-lg font-serif rounded-lg bg-[#EADDCA] text-[#3E2723]"
                />

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setShowClues(true)}
                    className="px-8 py-3 bg-[#2D1B13] text-[#C6AD8B] rounded-lg"
                  >
                    🔍 Clues
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !answer.trim()}
                    className="px-8 py-3 bg-[#C6AD8B] text-[#2D1B13] rounded-lg"
                  >
                    {submitting ? "⏳ Checking..." : "✓ Submit"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-4">
            <MyMap center={mapCentre} clues={clues} />
          </div>
        </div>
      </div>

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