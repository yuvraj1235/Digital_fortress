"use client";

import Image from "next/image";
import { useState } from "react";

export default function QuizPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#3E2723]">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/quiz/quiz_bg.png"
          alt="Quiz Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for better contrast if needed */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Header Area */}
      <div className="absolute top-0 left-0 w-full z-20 pointer-events-none flex items-start justify-between p-4 min-h-[5rem]">
        {/* Pointer events removed from container so clicks pass through, re-enabled on buttons/logos */}

        {/* Left Corner: Club Logo */}
        <div className="relative w-10 h-10 md:w-13 md:h-13 pointer-events-auto z-30">
          <Image
            src="/logo/glug.png"
            alt="Club Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* Back Button: somewhat in the center of the logo and website name - Desktop Only */}
        <div className="hidden md:block absolute left-[15%] top-0 w-38 h-32 cursor-pointer pointer-events-auto hover:scale-105 transition-transform">
          <Image
            src="/logo/back.png"
            alt="Back Button"
            fill
            className="object-contain object-top"
          />
        </div>

        {/* Center: Website Name (DF Logo) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[40vw] md:w-[30vw] max-w-[500px] h-24 md:h-32 pointer-events-auto z-20">
          <Image
            src="/logo/DF.png"
            alt="Digital Fortress Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* Right Corner: Rules Button - Desktop Only */}
        <div className="hidden md:block absolute right-[15%] top-0 w-39 h-34 cursor-pointer pointer-events-auto hover:scale-105 transition-transform">
          <Image
            src="/logo/rules.png"
            alt="Rules Button"
            fill
            className="object-contain object-top"
          />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden relative pointer-events-auto z-50 text-white p-2"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMenuOpen(false);
          }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden text-white animate-in fade-in duration-200"
        >
          <div className="w-48 h-14 bg-orange-500/60 border-2 border-orange-300 flex items-center justify-center font-bold text-xl rounded-lg cursor-pointer hover:bg-orange-600/60">
            Back
          </div>
          <div className="w-48 h-14 bg-yellow-500/60 border-2 border-yellow-300 flex items-center justify-center font-bold text-xl rounded-lg cursor-pointer hover:bg-yellow-600/60">
            Rules
          </div>
        </div>
      )
      }

      {/* Center Board Area */}
      <div className="relative z-8 flex min-h-screen flex-col items-center justify-center p-4 pt-32 pb-32 md:pt-4 md:pb-4">
        {/* Main Rectangular Board */}
        <div className="flex flex-col top-40vh md:flex-row w-[calc(95%-20px)] md:w-[calc(80%-20px)] max-w-6xl h-[70vh] md:h-[60vh] bg-[#2D1B13] rounded-xl overflow-hidden shadow-[0_0_60px_rgba(255,230,150,0.5),0_0_100px_rgba(255,215,0,0.2),inset_0_0_30px_rgba(0,0,0,0.8),0_0_0_8px_#3E2723,0_0_0_12px_#5D4037] translate-y-10 border-4 border-[#1a100c]">

          {/* Left Div: Questions and Answer (Top on mobile) */}
          <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center border-b-2 md:border-b-0 md:border-r- border-[#8D6E63]/50 p-6 text-white order-1 overflow-hidden">

            {/* --- MANUAL BACKGROUND SIZE ADJUSTMENT --- */}
            {/* Change the width and height numbers below to resize the image as you like */}
            <div className="absolute z-0 flex items-center justify-center pointer-events-none">
              <Image
                src="/quiz/quizquest.png"
                alt="Questions Background"
                width={1000}
                height={700}
                className="opacity-100 max-w-none"
              />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full px-4 md:px-12 h-full justify-center">
              {/* Question Text */}
              <h2 className="text-2xl md:text-4xl text-[#C6AD8B] font-serif text-center mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-relaxed">
                What is the capital of India?
              </h2>

              {/* Answer Input */}
              <input
                type="text"
                placeholder="Enter your answer..."
                className="w-full max-w-lg bg-[#1a0f0a]/60 border-2 border-[#5D4037] text-[#FFE0B2] placeholder-[#8D6E63] text-xl md:text-2xl px-6 py-4 rounded-lg focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/50 transition-all font-serif text-center mb-10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
              />

              {/* Buttons Row */}
              <div className="flex w-full max-w-lg justify-between gap-6">
                {/* Clues Button */}
                <button className="flex-1 bg-[#3E2723] hover:bg-[#4E342E] text-[#FFE082] border-2 border-[#8D6E63] py-3 px-6 rounded shadow-[0_4px_4px_rgba(0,0,0,0.5)] active:translate-y-0.5 transition-all font-serif tracking-widest uppercase text-lg md:text-xl flex items-center justify-center gap-2 group">
                  <span className="group-hover:text-white transition-colors">Clues</span>
                </button>

                {/* Submit Button */}
                <button className="flex-1 bg-gradient-to-b from-[#FFD700] to-[#FFB300] hover:from-[#FFC107] hover:to-[#FFA000] text-[#3E2723] border-2 border-[#FFD700] py-3 px-6 rounded shadow-[0_4px_15px_rgba(255,215,0,0.3)] active:translate-y-0.5 transition-all font-bold font-serif tracking-widest uppercase text-lg md:text-xl">
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* Right Div: Map (Bottom on mobile) */}
          <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center p-6 text-white order-2 overflow-hidden">

            {/* --- MANUAL BACKGROUND SIZE ADJUSTMENT --- */}
            {/* Change the width and height numbers below to resize the image as you like */}
            <div className="absolute z-0 flex items-center justify-center pointer-events-none">
              <Image
                src="/quiz/quizmap.png"
                alt="Map Background"
                width={1000}
                height={800}
                className="opacity-100 max-w-none"
              />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="text-2xl font-bold mb-2">Map</div>
              <p className="opacity-70 text-center">Map Area Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
