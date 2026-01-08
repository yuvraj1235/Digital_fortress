"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/services/auth";
import { useState, useEffect } from "react";
import Script from "next/script"; // Added for script loading

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Initialize Google when script is loaded AND component mounts
  useEffect(() => {
    if (scriptLoaded && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleGoogleResponse,
        use_fedcm_for_prompt: true, // Modern browser requirement
      });
    }
  }, [scriptLoaded]);

  const handleGoogleResponse = async (response: any) => {
    try {
      setLoading(true);
      setError("");

      const data = await registerUser({
        type: "1",
        accesstoken: response.credential,
      });

      if (data.status === 200 && data.token) {
        // Clear old sessions and store new token
        localStorage.setItem("df_token", data.token);
        document.cookie = `df_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        
        // Redirect to home or dashboard after successful registration
        router.push("/home"); 
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err: any) {
      console.error("Registration Error:", err);
      const errorMessage = err.data?.message || err.message || "Registration failed. User may already exist.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    if (!window.google) {
      setError("Google SDK is still loading...");
      return;
    }
    window.google.accounts.id.prompt();
  };

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/regn.webp')" }}
    >
      {/* Load Google Script properly */}
      <Script 
        src="https://accounts.google.com/gsi/client" 
        onLoad={() => setScriptLoaded(true)}
      />

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

          {error && (
            <div className="w-full bg-red-500/20 border border-red-500 rounded-lg p-3">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleRegister}
            disabled={loading || !scriptLoaded}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-white text-black font-bold tracking-widest hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-6 h-6"
            />
            {loading ? "REGISTERING..." : "SIGN UP WITH GOOGLE"}
          </button>

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