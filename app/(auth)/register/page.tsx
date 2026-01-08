"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/services/auth";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

const handleGoogleLogin = () => {
  setLoading(true);

  // @ts-ignore
  window.google.accounts.id.initialize({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    callback: async (response: any) => {
      try {
        // ✅ REAL Google-issued ID token
        const googleIdToken = response.credential;

        const data = await registerUser({
          type: "1",                 // tells backend: Google auth
          accesstoken: googleIdToken // REAL token
        });

        router.push("/home");
      } catch (err) {
        console.error("Login Error:", err);
        alert("Google login failed");
      } finally {
        setLoading(false);
      }
    },
  });

  // @ts-ignore
  window.google.accounts.id.prompt(); // opens Google popup
};

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/regn.webp')" }}
    >
      <Navbar />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-md">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative px-10 py-12 flex flex-col items-center gap-6">
          <img src="/logo/DF_LOGO.png" alt="Logo" className="w-16 h-16 drop-shadow-lg" />

          <h2 className="text-3xl font-extrabold text-white tracking-widest text-center">
            START YOUR JOURNEY
          </h2>

          <p className="text-white/70 text-center">
            Unlock the gateway with your Google account
          </p>

          {/* Custom Google Button using your image */}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <img 
              src="/logo/google.png" 
              alt="Sign in with Google" 
              className="w-[300px] h-auto cursor-pointer"
            />
          </button>

          {loading && <p className="text-amber-400 text-sm animate-pulse">Authenticating...</p>}

          <p className="text-center text-sm text-white/80 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-amber-300 hover:underline">
              LOGIN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}