"use client";

import React, { useState } from 'react';
import { apiRequest } from "@/lib/api";

export default function ClueBox({ clues, onClose, refreshClues }: any) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [clueAnswer, setClueAnswer] = useState("");

  const handleClueSubmit = async () => {
    try {
      const data = await apiRequest("quiz/checkClue", {
        method: "POST",
        body: JSON.stringify({ clue_id: clues[activeIdx].id, answer: clueAnswer }),
      });

      if (data.status === 200) {
        alert("Correct! Marker added to map.");
        setClueAnswer("");
        refreshClues(); // Updates map markers
      } else {
        alert("Wrong answer!");
      }
    } catch (err) { alert("Error submitting."); }
  };

  const currentClue = clues[activeIdx];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative p-1 bg-[#8B735B] rounded-lg border-4 border-[#5D4037] w-full max-w-md">
        <div className="bg-[#EADDCA] min-h-[400px] rounded-md p-8 border-2 border-[#C19A6B] flex flex-col items-center">
          
          <div className="flex justify-center gap-8 mb-6 border-b border-[#C19A6B]/50 w-full pb-2">
            {clues.map((_: any, i: number) => (
              <button 
                key={i} 
                onClick={() => setActiveIdx(i)}
                className={`text-2xl font-black uppercase ${activeIdx === i ? 'text-[#3E2723]' : 'text-[#A89078]'}`}
              >
                Clue {i + 1}
              </button>
            ))}
          </div>

          <p className="text-xl font-serif italic text-[#3E2723] mb-8 text-center">{currentClue?.question}</p>

          {!currentClue?.solved ? (
            <div className="w-full space-y-4">
              <input 
                className="w-full bg-[#1a0f0a] text-[#FFE0B2] border-2 border-[#8B735B] rounded px-4 py-2 text-center"
                value={clueAnswer}
                onChange={(e) => setClueAnswer(e.target.value)}
                placeholder="Answer clue..."
              />
              <button onClick={handleClueSubmit} className="w-full bg-[#1A365D] text-white py-2 rounded font-bold uppercase">Verify Clue</button>
            </div>
          ) : (
            <p className="text-green-700 font-bold uppercase">✓ Location Revealed</p>
          )}

          <button onClick={onClose} className="mt-6 text-[#5D4037] font-bold hover:underline">Close</button>
        </div>
      </div>
    </div>
  );
}