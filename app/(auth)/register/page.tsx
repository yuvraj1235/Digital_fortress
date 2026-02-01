"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/services/auth";
import Script from "next/script";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Added useAuth

declare global {
  interface Window {
    google?: any;
  }
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const router = useRouter();
  const { setUser } = useAuth(); // ✅ Get setUser from Context

  /* ---------------- GOOGLE CALLBACK ---------------- */
  const handleGoogleResponse = useCallback(
    async (response: any) => {
      try {
        setLoading(true);
        setError(null);

        // 1. Call Register API
        const registrationData = await registerUser({
          type: "1", // Google
          accesstoken: response.credential,
        });

        // 2. Extract token from storage (set by setSession inside registerUser)
        const token = localStorage.getItem("df_token");

        if (!token) {
          throw new Error("Registration failed: Token was not saved.");
        }

        // 3. Update global AuthContext immediately
        // Assuming your backend returns { user: {...}, token: "..." }
        if (registrationData && registrationData.user) {
          setUser(registrationData.user);
        }

        // 4. Redirect to home
        console.log("✅ Registration successful, redirecting...");
        router.push("/home");

      } catch (err: any) {
        console.error("❌ Google Register error:", err);
        setError(
          err?.data?.message ||
          err?.message ||
          "Google registration failed. Maybe you already have an account?"
        );
      } finally {
        setLoading(false);
      }
    },
    [router, setUser]
  );

  /* ---------------- GOOGLE INIT ---------------- */
  useEffect(() => {
    if (!scriptLoaded || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleGoogleResponse,
      use_fedcm_for_prompt: true, // ✅ Recommended for 2026 browsers
    });
  }, [scriptLoaded, handleGoogleResponse]);

  const handleGoogleLogin = () => {
    if (!window.google) {
      setError("Google authentication is still initializing...");
      return;
    }
    window.google.accounts.id.prompt();
  };

  /* ---------------- UI ---------------- */
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center font-sans"
      style={{ backgroundImage: "url('/regn.webp')" }}
    >
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => setScriptLoaded(true)}
      />

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

          <p className="text-white/60 text-sm tracking-wide">
            Join Digital Fortress using Google
          </p>

          {error && (
            <div className="w-full p-4 bg-red-950/40 border border-red-500/50 rounded-lg text-red-200 text-xs italic">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading || !scriptLoaded}
            className="group flex items-center justify-center gap-4 w-full py-4 rounded-xl bg-white text-black font-bold tracking-widest hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50"
          >
            {!loading && (
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-6 h-6"
              />
            )}
            {loading ? "PROCESSING..." : "REGISTER WITH GOOGLE"}
          </button>

          <Link
            href="/login"
            className="mt-2 text-xs text-white/50 hover:text-white transition-colors duration-300 uppercase tracking-widest border-b border-transparent hover:border-white"
          >
            Already a Player? <span className="font-bold">Login Here</span>
          </Link>
        </div>
      </div>
    </div>
  );
}