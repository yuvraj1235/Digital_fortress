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
      // Remove error so UI shows
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
        <div className="absolute left-[10%] top-0 hover:scale-110 transition-transform pointer-events-auto flex justify-center items-center">
          <button onClick={() => router.push("/leaderboard")} className="outline-none">
            <img
              src="/logo/leaderboard.png"
              alt="Leaderboard"
              className="h-32 md:h-40 w-auto object-contain"
            />
          </button>
        </div>

        {/* Rules Button - Right Side */}
        <div className="absolute right-[10%] top-0 hover:scale-110 transition-transform pointer-events-auto flex justify-center items-center">
          <button onClick={() => setShowRules(true)} className="outline-none">
            <img
              src="/logo/rules.png"
              alt="Rules"
              className="h-32 md:h-40 w-auto object-contain"
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center pt-32">
        <div className="flex flex-col md:flex-row w-[90%] max-w-6xl h-[65vh] bg-[#2D1B13]/90 rounded-xl overflow-hidden border-4 border-[#1a0f0a]">
          {/* Question */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
            {loading ? (
              <p className="text-[#C6AD8B]">Loading...</p>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : (
              <>
                <h2 className="text-[#C6AD8B] text-2xl mb-6 text-center">
                  {roundData?.question}
                </h2>

                <input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="p-3 text-center rounded"
                />

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowClues(true)}
                    className="px-6 py-2 bg-[#8B735B] text-[#3E2723] font-bold rounded border-2 border-[#5D4037] hover:bg-[#A89078] transition-colors"
                  >
                    CLUES
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-2 bg-[#C6AD8B] text-[#3E2723] font-bold rounded border-2 border-[#8B735B] disabled:opacity-50 hover:bg-[#DBC1A0] transition-colors"
                  >
                    {submitting ? "Checking..." : "SUBMIT"}
                  </button>
                </div>
              </>
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