"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/regn.webp')",
      }}
    >
      <Navbar />

      {/* Global overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-[#2d1a3a]/90 via-[#1a1222]/80 to-[#120b1f]/90 backdrop-blur-md flex flex-col items-center justify-center"
        style={{
          background: 'rgba(26, 18, 34, 0.82)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1.5px solid rgba(255,255,255,0.15)',
        }}
      >
        {/* Card overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="relative px-6 py-8 flex flex-col items-center gap-5 w-full">
          {/* Logo */}
          <img src="/logo/DF_LOGO.png" alt="Logo" className="w-14 h-14 mb-2 drop-shadow-lg" />
          
          {/* Title */}
          <h2 className="text-center text-3xl font-extrabold text-white mb-2 tracking-widest drop-shadow">WELCOME USER</h2>
          
          {/* Subtitle */}
          <p className="text-center text-white/70 text-sm mb-2 tracking-wide">Log in to continue your journey in the Digital Fortress</p>
          
          {/* Form */}
          <form className="w-full space-y-4">
            <input
              type="email"
              placeholder="EMAIL"
              className="w-full rounded-xl bg-black/40 px-5 py-3 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-white/10 transition shadow-sm"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD"
                className="w-full rounded-xl bg-black/40 px-5 py-3 pr-14 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-white/10 transition shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white transition-colors"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            {/* Links */}
            <div className="flex items-center justify-between text-xs text-white/70">
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" className="accent-amber-500" />
                Remember me
              </label>
              <a href="#" className="hover:underline">Forgot password?</a>
            </div>

            {/* THEMED GOOGLE BUTTON */}
            <button
              type="button"
              className="w-full mt-4 transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none"
            >
              <img 
                src="/logo/google.png" 
                alt="Login with Google" 
                className="w-full h-auto drop-shadow-2xl"
              />
            </button>

            {/* Redirect to Register */}
            <p className="text-center text-sm text-white/80 pt-2">
              New here?{' '}
              <Link href="/register" className="font-semibold text-amber-300 hover:underline">
                REGISTER
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}