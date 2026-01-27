"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/services/auth";
import Link from "next/link";
import Script from "next/script"; // Required for reliable script loading
import { useAuth } from "@/contexts/AuthContext";

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false); // Track script status
  const router = useRouter();

  // Initialize Google when script is ready
  useEffect(() => {
    if (scriptLoaded && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleGoogleResponse,
        use_fedcm_for_prompt: false, // Recommended for modern browser security
      });
    }
  }, [scriptLoaded]);

  const { setUser } = useAuth(); // Access setUser from context

  const handleGoogleResponse = async (response: any) => {
    try {
      setLoading(true);
      setError(null);

      const data = await loginUser({
        type: "1",
        accesstoken: response.credential,
      });

      if (data.status === 200 && data.token) {
        // Update context immediately
        setUser(data.user);

        // Force router refresh closely followed by navigation
        router.refresh();
        router.push("/home");
      } else if (data.status === 401) {
        setError("Account not found. Please register first.");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err.data?.message || err.message || "An unexpected error occurred.";
      setError(errorMessage);
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
      {/* Load Google SDK with explicit onLoad handler */}
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