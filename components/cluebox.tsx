"use client";

import React, { useState } from "react";

interface ClueBoxProps {
  clue1: string;
  clue2: string;
  onClose: () => void;
}

const ClueBox = ({ clue1, clue2, onClose }: ClueBoxProps) => {
  const [activeTab, setActiveTab] = useState(1);
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (!answer.trim()) return;
    // Handle answer submission here
    console.log("Answer submitted:", answer);
    setAnswer("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4">
      {/* FRAME CONTAINER */}
      <div className="relative w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[650px] lg:max-w-[750px] aspect-[4/3]">
        {/* FRAME IMAGE */}
        <img
          src="/clue/frame.png"
          alt="Frame"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        />

        {/* CONTENT - Positioned to fit within the visible parchment area */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-between"
          style={{
            padding: '14% 16% 12% 16%',
            paddingTop: 'clamp(10%, 14%, 60px)',
            paddingBottom: 'clamp(8%, 12%, 50px)'
          }}
        >

          {/* TOP SECTION: Close Button & Tab Navigation */}
          <div className="w-full flex flex-col items-center gap-2 sm:gap-3">
            {/* CLOSE BUTTON - positioned in top right */}
            <div className="w-full flex justify-end mb-1">
              <button
                onClick={onClose}
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center bg-[#8B4513] hover:bg-[#A0522D] rounded-full text-white font-bold text-sm sm:text-base md:text-lg hover:scale-110 transition shadow-lg border-2 border-[#654321]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setActiveTab(1)}
                className={`px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 rounded-md font-serif font-bold text-xs sm:text-sm transition-all ${activeTab === 1
                    ? "bg-[#8B4513] text-[#F5DEB3] shadow-lg scale-105"
                    : "bg-[#654321] text-[#D2B48C] hover:bg-[#7B3F00]"
                  }`}
              >
                Clue 1
              </button>
              <button
                onClick={() => setActiveTab(2)}
                className={`px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 rounded-md font-serif font-bold text-xs sm:text-sm transition-all ${activeTab === 2
                    ? "bg-[#8B4513] text-[#F5DEB3] shadow-lg scale-105"
                    : "bg-[#654321] text-[#D2B48C] hover:bg-[#7B3F00]"
                  }`}
              >
                Clue 2
              </button>
            </div>
          </div>

          {/* MIDDLE SECTION: Clue Text */}
          <div className="flex-1 flex items-center justify-center w-full px-1 sm:px-2 my-2 sm:my-3">
            <p className="text-[#2e1b14] text-sm sm:text-base md:text-lg lg:text-xl font-serif italic font-bold leading-snug sm:leading-relaxed text-center drop-shadow-sm">
              {activeTab === 1 ? clue1 : clue2}
            </p>
          </div>

          {/* BOTTOM SECTION: Input & Button */}
          <div className="w-full flex flex-col items-center gap-1.5 sm:gap-2">
            {/* INPUT FIELD */}
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Type your answer..."
              className="w-full bg-[#F5DEB3]/90 border-2 border-[#8B4513] text-[#2e1b14] text-xs sm:text-sm md:text-base font-serif text-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] placeholder-[#8B4513]/50 shadow-inner"
            />

            {/* CHECK BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={!answer.trim()}
              className="relative w-28 h-10 sm:w-36 sm:h-12 md:w-44 md:h-14 hover:brightness-110 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                src="/clue/checkbutton.png"
                alt="Check Answer"
                className="w-full h-full object-contain"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClueBox;
