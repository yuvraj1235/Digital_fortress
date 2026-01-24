"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService"; // Double check this path!

function Navbar() {
  const router = useRouter();
  const [playerImage, setPlayerImage] = useState("/avatar/default.png");
  

 
  const handleLogoClick = () => {
    router.push("/home");
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-gradient-to-b from-black/40 to-transparent">
      <div className="relative flex w-full items-center justify-between px-4 md:px-6 py-3 md:py-4">
        
        {/* LEFT: GLUG LOGO */}
        <div className="z-10 hover:scale-110 transition-transform brightness-40">
          <a href="https://nitdgplug.org/" target="_blank" rel="noreferrer">
            <img src="/logo/glug.png" alt="GLUG" className="h-16 md:h-20" />
          </a>
        </div>

        {/* CENTER: DF LOGO */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
          <button onClick={handleLogoClick}>
            <img src="/logo/DF.png" alt="Digital Fortress" className="h-20 md:h-28" />
          </button>
        </div>

        
      </div>
    </nav>
  );
}

export default Navbar;