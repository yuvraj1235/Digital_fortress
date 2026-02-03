"use client";

import React, { useState } from 'react';
import { apiRequest } from "@/lib/api";
import { toast } from "sonner"; // Import Sonner

export default function ClueBox({ clues, onClose, refreshClues }: any) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [clueAnswer, setClueAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClueSubmit = async () => {
        if (!clueAnswer.trim()) {
            toast.warning("The scroll is empty", {
                description: "Please enter an answer to proceed.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await apiRequest("quiz/checkClue", {
                method: "POST",
                body: JSON.stringify({
                    clue_id: clues[activeIdx].id,
                    answer: clueAnswer.trim()
                }),
            });

            if (data.status === 200 || data.correct) {
                // Success Toast
                toast.success("Clue Deciphered!", {
                    description: "A new marker has been added to your map.",
                    style: {
                        background: '#3e2723',
                        color: '#ffecb3',
                        border: '1px solid #ffd54f',
                    }
                });

                setClueAnswer("");
                refreshClues();
                onClose();
            } else {
                // Wrong Answer Toast
                toast.error("Incorrect Decryption", {
                    description: data.message || "The archives remain silent. Try again.",
                    style: {
                        background: '#3e2723',
                        color: '#ffcdd2',
                        border: '1px solid #e57373',
                    }
                });
            }
        } catch (err) {
            console.error("Error submitting clue:", err);
            toast.error("Archive Error", {
                description: "The connection to the royal archives was lost.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isSubmitting) {
            handleClueSubmit();
        }
    };

    const currentClue = clues[activeIdx];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Royal Archive Card */}
            <div className="relative w-full max-w-lg transform transition-all shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
                style={{
                    background: 'linear-gradient(180deg, #2a1810 0%, #1f100b 100%)',
                    boxShadow: '0 0 0 1px #4e342e, 0 0 0 4px #1a0f0a'
                }}>

                {/* Texture Overlay */}
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* Decorative Corners */}
                <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#8d6e63]/30 rounded-lg pointer-events-none z-10" />
                <div className="absolute top-3 left-3 right-3 bottom-3 border border-[#8d6e63]/10 rounded-lg pointer-events-none z-10" />

                <div className="relative z-20 p-8 flex flex-col items-center min-h-[500px] max-h-[90vh] overflow-y-auto">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-30 text-[#8d6e63] hover:text-[#eaddcf] hover:rotate-90 transition-all duration-300 transform hover:scale-110"
                        aria-label="Close"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Header */}
                    <div className="mb-8 text-center relative w-full">
                        <div className="flex items-center justify-center gap-3 opacity-60 mb-2">
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#8d6e63]" />
                            <span className="text-[#8d6e63] text-[10px] uppercase tracking-[0.3em] font-serif">Classified</span>
                            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#8d6e63]" />
                        </div>
                        <h2 className="text-3xl text-[#eaddcf] font-medium tracking-wide drop-shadow-md" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                            Archive Clues
                        </h2>
                    </div>

                    {/* Clue Tabs */}
                    <div className="flex justify-center gap-2 mb-8 w-full px-2">
                        {clues.map((_: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setActiveIdx(i);
                                    setClueAnswer("");
                                }}
                                className={`flex-1 py-2 text-sm font-serif font-bold uppercase tracking-wider transition-all duration-300 border border-transparent rounded relative overflow-hidden group ${activeIdx === i
                                    ? 'bg-[#3e2723] text-[#ffd54f] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] border-[#5d4037]'
                                    : 'bg-[#1a0f0a] text-[#8d6e63] hover:text-[#bcaaa4] border-[#3e2723]/30'
                                    }`}
                            >
                                <span className="relative z-10">Clue {i + 1}</span>
                                {activeIdx === i && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ffd54f]/50" />}
                            </button>
                        ))}
                    </div>

                    <div key={activeIdx} className="flex-grow flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-2 duration-500">

                        {/* Clue Content */}
                        {currentClue?.image && (
                            <div className="mb-6 w-full max-w-sm rounded overflow-hidden border border-[#5d4037] shadow-lg relative group">
                                <div className="absolute inset-0 bg-[#2a1810]/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                                <img
                                    src={currentClue.image}
                                    alt="Clue visual hint"
                                    className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                            </div>
                        )}

                        <p className="text-xl md:text-2xl text-[#eaddcf] mb-8 text-center leading-snug max-w-md drop-shadow-sm px-4 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            "{currentClue?.question}"
                        </p>

                        {!currentClue?.solved ? (
                            <div className="w-full space-y-4 max-w-xs relative">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-[#0c0502] rounded shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] border-b border-[#3e2723]" />
                                    <input
                                        className="relative w-full bg-transparent text-[#eaddcf] placeholder-[#5d4037] px-4 py-3 text-center text-lg focus:outline-none focus:placeholder-[#8d6e63]/50 transition-colors font-serif"
                                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                        value={clueAnswer}
                                        onChange={(e) => setClueAnswer(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Decrypt..."
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <button
                                    onClick={handleClueSubmit}
                                    disabled={isSubmitting || !clueAnswer.trim()}
                                    className="w-full bg-[#3e2723] text-[#bcaaa4] border border-[#5d4037] py-3 rounded shadow-[0_4px_0_#271c19] hover:translate-y-[2px] hover:shadow-[0_2px_0_#271c19] hover:bg-[#4e342e] hover:text-[#eaddcf] transition-all font-serif font-bold uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                                >
                                    {isSubmitting ? "Verifying..." : "Unlock Clue"}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center animate-in zoom-in duration-500 py-4">
                                <div className="w-16 h-16 rounded-full border-2 border-[#66bb6a]/30 flex items-center justify-center bg-[#66bb6a]/10 mb-3 shadow-[0_0_20px_rgba(76,175,80,0.1)]">
                                    <svg className="w-8 h-8 text-[#66bb6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <p className="text-[#81c784] font-serif font-bold uppercase tracking-widest text-sm">
                                    Archive Unlocked
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 opacity-40 text-[10px] uppercase tracking-[0.4em] text-[#8d6e63] font-sans">
                        Digital Fortress
                    </div>
                </div>
            </div>
        </div>
    );
}