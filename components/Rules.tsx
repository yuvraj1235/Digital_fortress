"use client";

import React from 'react';

type RulesProps = {
  open: boolean;
  onClose: () => void;
};

export default function Rules({ open, onClose }: RulesProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      
      {/* PARCHMENT CONTAINER */}
      <div
        className="relative"
        style={{
          width: "90vw",
          maxWidth: "1000px",
          aspectRatio: "4 / 3",
          backgroundImage: "url('/rules_scroll.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
      >
        {/* ✅ THE CLOSE BUTTON (Anchored to Scroll Corner) */}
        <button
          onClick={onClose}
          className="absolute top-[19%] right-[22%] w-10 h-10 flex items-center justify-center bg-[#3a2a1a] text-[#f3e2c3] rounded-full border-2 border-[#6b4a2d] hover:bg-[#6b4a2d] hover:scale-110 transition-all shadow-xl z-[120]"
          title="Close Rules"
        >
          <span className="text-xl font-bold leading-none">✕</span>
        </button>

        {/* CONTENT SAFE AREA */}
        <div
          className="absolute flex flex-col items-center text-[#3a2a1a]"
          style={{
            top: "25%",
            bottom: "28%",
            left: "15%",
            right: "14%",
            fontSize: "clamp(0.65rem, 1.1vw, 1rem)",
            fontFamily: "'Cormorant Garamond', 'Garamond', serif",
          }}
        >
          {/* TITLE */}
          <h1
            className="mb-4 text-center uppercase"
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              letterSpacing: "0.2em",
              fontSize: "1.8em",
            }}
          >
            Rules of the Game
          </h1>

          {/* RULES LIST */}
          <ul className="space-y-3 leading-snug max-w-2xl overflow-y-auto pr-2 scrollbar-hide">
            {[
              "Solving each round rewards you 10 points.",
              "Each round is based on a theme which you need to figure out.",
              "Each round consists of a main question and a few clue questions.",
              "Answering each clue question unlocks a position on the map.",
              "These locations, shapes, or street-views are hints to the main question.",
              "The leaderboard will be inactive during sample rounds.",
            ].map((rule, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-[#6b4a2d] text-[1.1em] mt-[0.2em]">
                  ✦
                </span>
                <span className="font-medium">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}