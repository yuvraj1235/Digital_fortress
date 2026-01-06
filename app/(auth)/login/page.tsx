"use client";
import {useState} from "react";
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
          marginLeft: '0.5cm',
        }}
      >
        {/* Card overlay */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Content */}
        <div className="relative px-6 py-8 flex flex-col items-center gap-5">
          {/* Logo */}
          <img src="/logo/DF_LOGO.png" alt="Logo" className="w-14 h-14 mb-2 drop-shadow-lg" />
          {/* Title */}
          <h2 className="text-center text-3xl font-extrabold text-white mb-2 tracking-widest drop-shadow">WELCOME USER</h2>
          {/* Subtitle (login message) */}
          <p className="text-center text-white/70 text-base mb-2 tracking-wide">Log in to continue your journey in the Digital Fortress</p>
          {/* Form */}
          <form className="w-full space-y-5">
            <input
              type="email"
              placeholder="EMAIL"
              className="w-full rounded-xl bg-black/40 px-5 py-3 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-white/10 focus:border-amber-400 transition shadow-sm"
            />
            {/* Password input with show/hide */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD"
                className="w-full rounded-xl bg-black/40 px-5 py-3 pr-14 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-white/10 focus:border-amber-400 transition shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 hover:bg-black/60 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M6.343 6.343A7.963 7.963 0 004 9c0 4.418 3.582 8 8 8 1.657 0 3.22-.403 4.575-1.125M17.657 17.657A7.963 7.963 0 0020 15c0-4.418-3.582-8-8-8-1.657 0-3.22.403-4.575 1.125M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.857-.67 1.67-1.175 2.414" />
                  </svg>
                )}
              </button>
            </div>
            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between text-xs text-white/70 mt-1">
              <label className="flex items-center gap-1">
                <input type="checkbox" className="accent-amber-500" />
                Remember me
              </label>
              <a href="#" className="hover:underline text-white/60">Forgot password?</a>
            </div>
            {/* Login */}
            <p className="text-center text-sm text-white/80">
              Here for the first time?{' '}
              <Link
                href="/register"
                className="font-semibold text-amber-300 hover:underline"
              >
                REGISTER
              </Link>
            </p>
            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-amber-500/90 to-amber-700/90 py-4 text-lg font-bold tracking-widest text-white shadow-lg hover:from-amber-400 hover:to-amber-600 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400/70 mt-2"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
