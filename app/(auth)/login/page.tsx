"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/services/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      // ✅ Store token in cookie (middleware-compatible)
      document.cookie = `df_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;

      // Optional: also keep in localStorage for client usage
      localStorage.setItem("df_token", data.token);

      router.push("/home");
    } catch (err: any) {
      switch (err.status) {
        case 401:
          setError("Invalid credentials");
          break;
        case 402:
          setError("Session expired");
          break;
        default:
          setError("Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
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

        <div className="relative px-6 py-8 flex flex-col items-center gap-5 w-full">
          <img
            src="/logo/DF_LOGO.png"
            alt="Logo"
            className="w-14 h-14 mb-2 drop-shadow-lg"
          />

          <h2 className="text-3xl font-extrabold text-white tracking-widest">
            WELCOME USER
          </h2>

          <p className="text-white/70 text-sm text-center">
            Log in to continue your journey in the Digital Fortress
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <input
              type="email"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl bg-black/40 px-5 py-3 text-white placeholder:text-white/70 focus:ring-2 focus:ring-amber-500 border border-white/10"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl bg-black/40 px-5 py-3 pr-14 text-white placeholder:text-white/70 focus:ring-2 focus:ring-amber-500 border border-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold tracking-widest hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>

            <p className="text-center text-sm text-white/80">
              New here?{" "}
              <Link href="/register" className="text-amber-300 font-semibold">
                REGISTER
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
