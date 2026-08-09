"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/services/auth";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

declare global {
  interface Window {
    google?: any;
  }
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useAuth();
  
  // Ref to track if the button is already rendered to prevent duplicates
  const googleBtnRef = useRef<HTMLDivElement>(null);

  /* ---------------- GOOGLE CALLBACK ---------------- */
  const handleGoogleResponse = useCallback(
    async (response: any) => {
      try {
        setLoading(true);
        setError(null);

        const data = await registerUser({
          type: "1", 
          accesstoken: response.credential,
        });

        if (data && data.user) {
          setUser(data.user);
          router.push("/home");
        }
      } catch (err: any) {
        setError(err?.message || "Registration failed. Try again.");
        setLoading(false);
      }
    },
    [router, setUser]
  );

  /* ---------------- GOOGLE INIT ---------------- */
  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google || !googleBtnRef.current) return;

      // 1. Initialize Google Identity
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleGoogleResponse,
        use_fedcm_for_prompt: true,
      });

      // 2. Render the Official Button
      // This solves the 'disabled' issue because it renders a fresh button
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signup_with",
        shape: "pill",
        width: googleBtnRef.current.offsetWidth,
      });

      // 3. Optionally show the One-Tap prompt
      window.google.accounts.id.prompt();
    };

    // If script is already loaded in layout, initialize immediately
    if (window.google) {
      initializeGoogle();
    } else {
      // Fallback: check every 100ms if script is ready
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogle();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [handleGoogleResponse]);

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center font-sans"
      style={{ backgroundImage: "url('/regn.webp')" }}
    >
      <Navbar />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl">
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative px-8 py-14 flex flex-col items-center gap-6 w-full text-center">
          <img
            src="/logo/DF_LOGO.png"
            alt="Logo"
            className="w-24 h-24 mb-2 drop-shadow-lg"
          />

          <h2 className="text-3xl font-black text-white tracking-[0.2em] uppercase">
            Create Account
          </h2>

          <p className="text-white/60 text-sm tracking-wide mb-4">
            Join Digital Fortress using Google
          </p>

          {error && (
            <div className="w-full p-4 bg-red-950/40 border border-red-500/50 rounded-lg text-red-200 text-xs mb-4">
              {error}
            </div>
          )}

          {/* THE FIX: Official Google Button Container */}
          <div className="w-full flex flex-col items-center min-h-[50px]">
            <div 
              ref={googleBtnRef} 
              className={`w-full transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
            ></div>
            
            {loading && (
              <p className="mt-4 text-white/70 text-xs animate-pulse tracking-widest">
                VERIFYING WITH GOOGLE...
              </p>
            )}
          </div>

          <Link
            href="/login"
            className="mt-6 text-xs text-white/50 hover:text-white transition-colors uppercase tracking-widest border-b border-transparent hover:border-white"
          >
            Already a Player? <span className="font-bold">Login Here</span>
          </Link>
        </div>
      </div>
    </div>
  );
}