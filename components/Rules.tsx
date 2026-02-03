"use client";

import React, { useEffect, useState } from "react";

type RulesProps = {
  open: boolean;
  onClose: () => void;
};

export default function Rules({ open, onClose }: RulesProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!show && !open) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${open ? "bg-black/80 backdrop-blur-sm opacity-100" : "bg-black/0 opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
    >
      {/* Royal Archive Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-xl flex flex-col items-center overflow-hidden rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${open ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-12 opacity-0"
          }`}
        style={{
          background: 'linear-gradient(180deg, #2a1810 0%, #1f100b 100%)',
          boxShadow: '0 0 0 1px #4e342e, 0 0 0 4px #1a0f0a'
        }}
      >
        {/* Texture Overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* Decorative Corners */}
        <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#8d6e63]/30 rounded-lg pointer-events-none z-10" />
        <div className="absolute top-3 left-3 right-3 bottom-3 border border-[#8d6e63]/10 rounded-lg pointer-events-none z-10" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-[#8d6e63] hover:text-[#eaddcf] hover:rotate-90 transition-all duration-300"
          aria-label="Close Rules"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="w-full text-center pt-10 pb-6 px-8 relative z-20">
          <div className="inline-flex flex-col items-center gap-2">
            <span className="text-[#8d6e63] text-[10px] tracking-[0.3em] font-serif uppercase">Digital Fortress</span>
            <h2
              className="text-3xl sm:text-4xl text-[#eaddcf] font-medium uppercase tracking-widest drop-shadow-sm"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Protocol
            </h2>
            <div className="flex items-center gap-3 mt-2 opacity-60">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#8d6e63]" />
              <div className="w-1.5 h-1.5 rotate-45 border border-[#8d6e63] bg-[#1f100b]" />
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#8d6e63]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full px-6 sm:px-10 pb-10 overflow-y-auto max-h-[60vh] sm:max-h-[70vh] z-20 scrollbar-thin scrollbar-thumb-[#4e342e] scrollbar-track-transparent">
          <ul className="space-y-3">
            {[
              { text: "Solving each round rewards you 10 points.", idx: "I" },
              { text: "Each round implies a theme you must decipher.", idx: "II" },
              { text: "Main questions are supported by hidden clues.", idx: "III" },
              { text: "Clues unlock specific positions on the map.", idx: "IV" },
              { text: "Locations & shapes are the key to the answer.", idx: "V" },
              { text: "Leaderboards are frozen during training.", idx: "VI" },
            ].map((rule, i) => (
              <li
                key={i}
                className="group relative flex items-center gap-4 p-4 rounded-lg border border-[#3e2723]/50 bg-[#1a0f0a]/40 hover:bg-[#3e2723]/30 transition-all duration-300"
              >
                {/* Roman Numeral */}
                <span className="flex-shrink-0 w-8 font-serif text-sm font-bold text-[#8d6e63] group-hover:text-[#ffd54f] transition-colors text-right">
                  {rule.idx}.
                </span>

                {/* Text */}
                <span
                  className="text-[#bcaaa4] text-lg leading-snug group-hover:text-[#eaddcf] transition-colors duration-200"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {rule.text}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-[#3e2723]/50 flex flex-col items-center gap-2 opacity-60">
            <div className="text-[#5d4037] text-[10px] tracking-[0.2em] uppercase font-sans">
              Review Complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}