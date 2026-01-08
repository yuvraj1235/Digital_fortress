"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import Rules from "@/components/Rules";
import { MyMap } from "@/components/MyMap";
import { apiRequest } from "@/lib/api";

export default function QuizPage() {
  const [showRules, setShowRules] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // --- UPDATED STATE ---
  const [roundData, setRoundData] = useState<any>(null);
  const [mapCentre, setMapCentre] = useState<[number, number]>([23.48, 87.32]); // Added this
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCurrentRound();
  }, []);

  const fetchCurrentRound = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("quiz/getRound");
      
      if (data.status === 200) {
        // Backend returns: { "question": serializer.data, "centre": [lat, lng], "status": 200 }
        setRoundData(data.question);
        setMapCentre(data.centre);    // Correctly setting mapCentre from backend
      } else if (data.status === 410) {
        setError("The quiz has not started yet or has ended.");
      }
    } catch (err: any) {
      setError(err.data?.message || "Failed to load the round.");
    } finally {
      setLoading(false);
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
        fetchCurrentRound();
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
      
      {/* Background Section: Ensure this is at the top of the return */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/quiz/quiz_bg.png" 
          alt="Quiz Background" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 pt-32 pb-32 md:pt-4 md:pb-4">
        <div className="flex flex-col md:flex-row w-[calc(95%-20px)] md:w-[calc(80%-20px)] max-w-6xl h-[70vh] md:h-[60vh] bg-[#2D1B13]/90 rounded-xl overflow-hidden shadow-[0_0_60px_rgba(255,230,150,0.5)] translate-y-10 border-4 border-[#1a100c] backdrop-blur-sm">

          {/* Left: Questions and Answer */}
          <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center p-6 text-white order-1 overflow-hidden">
            <div className="absolute z-0 flex items-center justify-center pointer-events-none">
              <Image src="/quiz/quizquest.png" alt="Scroll" width={1000} height={700} className="opacity-100 max-w-none" />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full px-4 md:px-12 h-full justify-center">
              {loading ? (
                <p className="text-[#C6AD8B] animate-pulse">Loading Scroll...</p>
              ) : error ? (
                <p className="text-red-400 text-center">{error}</p>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl text-[#C6AD8B] font-serif text-center mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-relaxed">
                    {/* Changed question_text to question to match your Round model */}
                    {roundData?.question || "No question available"}
                  </h2>

                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer..."
                    className="w-full max-w-lg bg-[#1a0f0a]/60 border-2 border-[#5D4037] text-[#FFE0B2] text-xl px-6 py-4 rounded-lg focus:outline-none focus:border-[#FFD700] text-center mb-10"
                  />

                  <div className="flex w-full max-w-lg justify-between gap-6">
                    <button className="flex-1 bg-[#3E2723] hover:bg-[#4E342E] text-[#FFE082] border-2 border-[#8D6E63] py-3 rounded uppercase text-lg">
                      Clues
                    </button>

                    <button 
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-b from-[#FFD700] to-[#FFB300] text-[#3E2723] py-3 rounded font-bold uppercase text-lg disabled:opacity-50"
                    >
                      {submitting ? "Checking..." : "Submit"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Map */}
          <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center p-4 text-white order-2 overflow-hidden">
            <div className="absolute z-0 flex items-center justify-center pointer-events-none">
              <Image src="/quiz/quizmap.png" alt="Map Background" width={1000} height={800} className="opacity-100 max-w-none" />
            </div>
            <div className="relative z-10 w-full h-full">
              {/* Corrected: Passing the mapCentre state to MyMap */}
              <MyMap center={mapCentre} />
            </div>
          </div>
        </div>
      </div>
      <Rules open={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
}