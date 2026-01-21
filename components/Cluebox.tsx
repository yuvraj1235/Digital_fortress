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
            <div className="relative p-1 rounded-xl w-full max-w-lg transform transition-all shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                style={{
                    background: 'linear-gradient(135deg, #4E342E 0%, #3E2723 100%)',
                    border: '2px solid #C6AD8B',
                    boxShadow: '0 0 0 6px #3E2723, 0 0 0 8px #C6AD8B, 0 20px 50px rgba(0,0,0,0.5)'
                }}>

                {/* Royal Corner Ornaments */}
                <div className="absolute -top-[10px] -left-[10px] w-12 h-12 border-t-[6px] border-l-[6px] border-[#C6AD8B] rounded-tl-xl z-20 pointer-events-none"></div>
                <div className="absolute -top-[10px] -right-[10px] w-12 h-12 border-t-[6px] border-r-[6px] border-[#C6AD8B] rounded-tr-xl z-20 pointer-events-none"></div>
                <div className="absolute -bottom-[10px] -left-[10px] w-12 h-12 border-b-[6px] border-l-[6px] border-[#C6AD8B] rounded-bl-xl z-20 pointer-events-none"></div>
                <div className="absolute -bottom-[10px] -right-[10px] w-12 h-12 border-b-[6px] border-r-[6px] border-[#C6AD8B] rounded-br-xl z-20 pointer-events-none"></div>

                <div className="bg-[#EADDCA] min-h-[450px] rounded-lg p-8 border border-[#8B735B] flex flex-col items-center relative overflow-hidden">

                    {/* Close Button X (Top Right) */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 text-[#5D4037] hover:text-[#3E2723] hover:rotate-90 transition-transform duration-300"
                        aria-label="Close"
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Subtle texture overlay for paper effect (CSS Vignette) */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ background: 'radial-gradient(circle, transparent 40%, #8B735B 100%)' }}></div>

                    <h2 className="text-3xl text-[#3E2723] font-serif font-black mb-6 border-b-2 border-[#8B735B] pb-2 px-12 uppercase tracking-[0.2em] drop-shadow-sm">
                        Royal Archives
                    </h2>

                    <div className="flex justify-center gap-4 mb-8 w-full z-10 px-4">
                        {clues.map((_: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setActiveIdx(i)}
                                className={`flex-1 py-3 text-sm md:text-lg font-bold uppercase transition-all duration-300 border-2 rounded-lg ${activeIdx === i
                                    ? 'bg-[#3E2723] text-[#C6AD8B] border-[#3E2723] shadow-xl -translate-y-1'
                                    : 'bg-[#EADDCA] text-[#5D4037] border-[#8B735B] hover:bg-[#D7C6B5]'
                                    }`}
                            >
                                Clue {i + 1}
                            </button>
                        ))}
                    </div>

                    <div key={activeIdx} className="flex-grow flex flex-col items-center justify-center w-full z-10 animate-in fade-in zoom-in-95 duration-500">
                        <p className="text-xl md:text-2xl font-serif italic text-[#3E2723] mb-8 text-center leading-relaxed max-w-sm">
                            "{currentClue?.question}"
                        </p>

                        {!currentClue?.solved ? (
                            <div className="w-full space-y-4 max-w-xs relative">
                                <div className="relative">
                                    <input
                                        className="w-full bg-[#3E2723]/5 text-[#3E2723] placeholder-[#5D4037]/50 border-2 border-[#8B735B] rounded-md px-4 py-3 text-center text-lg font-serif focus:outline-none focus:border-[#3E2723] transition-colors"
                                        value={clueAnswer}
                                        onChange={(e) => setClueAnswer(e.target.value)}
                                        placeholder="Decipher the riddle..."
                                    />
                                </div>
                                <button
                                    onClick={handleClueSubmit}
                                    className="w-full bg-gradient-to-r from-[#3E2723] to-[#5D4037] text-[#EADDCA] py-3 rounded-md text-lg font-bold uppercase tracking-wider hover:shadow-lg hover:from-[#5D4037] hover:to-[#3E2723] transition-all border border-[#C6AD8B]"
                                >
                                    Verify Clue
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center animate-in zoom-in duration-500">
                                <div className="text-6xl mb-4 drop-shadow-md">💎</div>
                                <p className="text-[#2E7D32] font-black uppercase text-xl tracking-widest border-2 border-[#2E7D32] px-6 py-2 rounded-full bg-[#2E7D32]/10">
                                    Location Revealed
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 opacity-50 text-xs uppercase tracking-widest text-[#5D4037]">
                        — For the worthy —
                    </div>
                </div>
            </div>
        </div>
    );
}
