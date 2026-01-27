"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Trophy, Target, ChevronDown, User, Shield } from "lucide-react";

export default function Profile() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Hide on login/signup pages
    const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
    };

    if (isAuthPage) return null;

    if (!user) return null;

    return (
        <div className="fixed top-5 right-6 z-[100] flex flex-col items-end font-sans group/profile" ref={dropdownRef}>
            {/* Trigger Button - Minimal Circle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative cursor-pointer outline-none transition-transform active:scale-95"
            >
                {/* Profile Image with Ring */}
                <div className="relative">
                    {/* Rotating Outer Ring */}
                    <div className={`absolute -inset-2 rounded-full border border-[#C6A355]/40 border-dashed animate-[spin_10s_linear_infinite] ${isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-500`} />

                    {/* Main Avatar Container */}
                    <div className={`relative h-12 w-12 overflow-hidden rounded-full border-2 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${isOpen ? 'border-[#C6A355] ring-2 ring-[#C6A355]/30' : 'border-[#C6A355]/70 group-hover:border-[#C6A355]'}`}>
                        <img
                            src={user.imageLink || "/avatar/default.png"}
                            alt="Profile"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/avatar/default.png"; }}
                        />
                    </div>

                    {/* Status Indicator */}
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#1a1500]" />
                </div>
            </button>

            {/* Dropdown Menu - Fortress Vibe */}
            {isOpen && (
                <div className="absolute top-full mt-6 w-80 origin-top-right animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                    <div className="relative overflow-hidden rounded-xl border border-[#C6A355]/40 bg-[#0f0b05] shadow-[0_0_50px_rgba(198,163,85,0.15)] backdrop-blur-3xl">

                        {/* Background Texture/Noise */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

                        {/* Scanning Line Animation */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C6A355]/5 to-transparent h-[200%] w-full animate-[scan_4s_linear_infinite] pointer-events-none" />

                        {/* Header Section */}
                        <div className="relative p-6 pb-4 border-b border-[#C6A355]/20">
                            <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 shrink-0 group">
                                    <div className="absolute -inset-1 rounded-full border border-[#C6A355] border-dashed animate-[spin_20s_linear_infinite] opacity-30" />
                                    <img
                                        src={user.imageLink || "/avatar/default.png"}
                                        alt="Profile"
                                        className="h-full w-full rounded-full object-cover ring-2 ring-[#C6A355]/50 p-0.5"
                                        onError={(e) => { (e.target as HTMLImageElement).src = "/avatar/default.png"; }}
                                    />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="text-lg font-bold text-[#ffecd1] font-serif tracking-wide truncate">{user.name || "Unknown Agent"}</h3>
                                        <Shield className="w-3.5 h-3.5 text-[#C6A355]" />
                                    </div>
                                    <p className="text-[10px] text-[#C6A355] font-mono tracking-widest uppercase opacity-80 mb-1">Authenticated</p>
                                    <p className="text-[11px] text-gray-400 truncate font-mono bg-black/30 px-2 py-0.5 rounded border border-white/5">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-5 space-y-4">

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Rank Card */}
                                <div className="group relative overflow-hidden rounded bg-gradient-to-br from-[#1a1500] to-[#0a0800] p-3 border border-[#C6A355]/20 hover:border-[#C6A355]/50 transition-colors">
                                    <div className="absolute top-0 right-0 p-1 opacity-20">
                                        <Trophy className="w-5 h-5 text-[#C6A355]" />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#C6A355] font-bold block mb-1">Global Rank</span>
                                    <div className="text-2xl font-bold text-[#ffecd1] font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
                                        #{user.rank ?? '-'}
                                    </div>
                                </div>

                                {/* Score Card */}
                                <div className="group relative overflow-hidden rounded bg-gradient-to-br from-[#1a1500] to-[#0a0800] p-3 border border-[#C6A355]/20 hover:border-[#C6A355]/50 transition-colors">
                                    <div className="absolute top-0 right-0 p-1 opacity-20">
                                        <Target className="w-5 h-5 text-[#C6A355]" />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#C6A355] font-bold block mb-1">Total Score</span>
                                    <div className="text-2xl font-bold text-[#ffecd1] font-mono tracking-tight group-hover:scale-105 transition-transform origin-left">
                                        {user.score || 0}
                                    </div>
                                </div>
                            </div>

                            {/* Round Info Banner */}
                            <div className="relative rounded bg-[#1a1500] border border-[#C6A355]/30 p-3 overflow-hidden group">
                                <div className="absolute inset-0 bg-[#C6A355]/5 group-hover:bg-[#C6A355]/10 transition-colors" />
                                <div className="relative flex justify-between items-center z-10">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-[#C6A355] uppercase tracking-widest font-bold mb-0.5">Current Objective</span>
                                        <span className="text-lg font-bold text-[#ffecd1] font-serif">Round {user.roundNo || 1}</span>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-[#C6A355] shadow-[0_0_10px_#C6A355] animate-pulse" />
                                </div>
                            </div>

                            {/* Divider with Glyph */}
                            <div className="flex items-center gap-2 opacity-30 my-2">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C6A355]" />
                                <div className="h-1.5 w-1.5 rotate-45 border border-[#C6A355]" />
                                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C6A355]" />
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="group w-full relative overflow-hidden rounded border border-red-900/50 bg-[#2a0a0a]/40 hover:bg-red-950/50 transition-all duration-300"
                            >
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                                <div className="relative flex items-center justify-center gap-2 py-3">
                                    <LogOut className="w-3.5 h-3.5 text-red-400 group-hover:text-red-300 transition-colors" />
                                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-red-400 group-hover:text-red-300">Log Out</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
