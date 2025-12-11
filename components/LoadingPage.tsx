"use client";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";

export default function LoadingScreen({ progress = 0 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setVisible(false), 500); // fade out delay
    }
  }, [progress]);

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex flex-col items-center justify-center
        transition-opacity duration-700 
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
      style={{
        backgroundImage: "url('/bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
     <Navbar/>

      {/* Center DF Logo */}
      <img
        src="/logo/DF_LOGO.png"
        className="h-28 mb-6 drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]"
        alt="DF Logo"
      />

      {/* Progress Bar */}
      <div className="w-72 h-[3px] bg-black/40 rounded overflow-hidden">
        <div
          className="h-full bg-gray-200 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
