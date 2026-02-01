"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/services/auth";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useAuth();
  
  // Use a ref to target the button container
  const googleBtnRef = useRef<HTMLDivElement>(null);

  /* ---------------- GOOGLE CALLBACK ---------------- */
  const handleGoogleResponse = useCallback(
    async (response: any) => {
      try {
        setLoading(true);
        setError(null);

        const loginData = await loginUser({
          type: "1",
          accesstoken: response.credential,
        });

        if (loginData && loginData.user) {
          setUser(loginData.user); 
          router.push("/home");
        } else {
          throw new Error("Invalid response from server");
        }
        
      } catch (err: any) {
        console.error("Login error:", err);
        setError(err?.message || "Authentication failed");
        setLoading(false); // Reset loading on error
      }
    },
    [router, setUser]
  );

  /* ---------------- GOOGLE INIT ---------------- */
  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google || !googleBtnRef.current) return;

      // 1. Initialize
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleGoogleResponse,
        use_fedcm_for_prompt: true,
      });

      // 2. Render the Official Button
      // This ensures the button is always active and clickable
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "pill",
        width: googleBtnRef.current.offsetWidth,
      });

      // 3. Optional: One-tap prompt
      window.google.accounts.id.prompt();
    };

    // Since script is in layout.tsx, it might already be ready
    if (window.google) {
      initializeGoogle();
    } else {
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
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/regn.webp')" }}
    >
      <Navbar />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-md">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative px-6 py-12 flex flex-col items-center gap-6 w-full text-center">
          <img
            src="/logo/DF_LOGO.png"
            alt="Logo"
            className="w-20 h-20 mb-2"
          />

          <h2 className="text-3xl font-extrabold text-white tracking-widest uppercase">
            Digital Fortress
          </h2>

          <p className="text-white/70 text-sm">
            Login using your Google account
          </p>

          {error && (
            <div className="w-full p-3 bg-red-500/20 border border-red-500 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* THE FIX: Button Container */}
          <div className="w-full flex flex-col items-center min-h-[50px]">
            <div 
              ref={googleBtnRef} 
              className={`w-full transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
            ></div>
            
            {loading && (
              <p className="mt-4 text-white/70 text-xs animate-pulse tracking-widest">
                AUTHENTICATING...
              </p>
            )}
          </div>

          <Link
            href="/register"
            className="text-sm text-white/70 hover:text-white underline transition mt-4"
          >
            New here? Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}