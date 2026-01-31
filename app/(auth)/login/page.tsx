"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/services/auth";
import Script from "next/script";
import { useAuth } from "@/contexts/AuthContext";

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    if (scriptLoaded && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleGoogleResponse,
        use_fedcm_for_prompt: false,
      });
    }
  }, [scriptLoaded]);

  const handleGoogleResponse = async (response: any) => {
    try {
      setLoading(true);
      setError(null);

      const data = await loginUser({
        type: "1",
        accesstoken: response.credential,
      });

      // ✅ TRUST LOCAL STORAGE, NOT RESPONSE SHAPE
      const token = localStorage.getItem("df_token");

      if (token) {
        setUser(data.user || null);
        router.refresh();
        router.push("/home");
      } else {
        throw new Error("Login failed: token not found");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err?.data?.message ||
        err?.message ||
        "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!window.google) {
      setError("Google authentication is still initializing...");
      return;
    }
    window.google.accounts.id.prompt();
  };

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/regn.webp')" }}
    >
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => setScriptLoaded(true)}
      />

      <Navbar />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-md">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative px-6 py-12 flex flex-col items-center gap-6 w-full text-center">
          <img src="/logo/DF_LOGO.png" alt="Logo" className="w-20 h-20 mb-2" />

          <h2 className="text-3xl font-extrabold text-white tracking-widest uppercase">
            Digital Fortress
          </h2>

          <p className="text-white/70 text-sm">
            Access the secure zone using your Google account
          </p>

          {error && (
            <div className="w-full p-3 bg-red-500/20 border border-red-500 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading || !scriptLoaded}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-white text-black font-bold tracking-widest hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-6 h-6"
            />
            {loading ? "AUTHENTICATING..." : "CONTINUE WITH GOOGLE"}
          </button>
        </div>
      </div>
    </div>
  );
}
