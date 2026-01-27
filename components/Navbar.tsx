"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter();
  const [playerImage, setPlayerImage] = useState("/avatar/default.png");

  const handleLogoClick = () => {
    router.push("/home");
  };

  return (
    // ⛔ Navbar ignores clicks by default
    <nav className="fixed top-0 left-0 z-50 w-full bg-gradient-to-b from-black/40 to-transparent pointer-events-none">
      <div className="relative flex w-full items-center justify-between px-4 md:px-6 py-3 md:py-4">

        {/* LEFT: GLUG LOGO (clickable) */}
        <div className="z-10 hover:scale-110 transition-transform pointer-events-auto">
          <a href="https://nitdgplug.org/" target="_blank" rel="noreferrer">
            <img src="/logo/glug.png" alt="GLUG" className="h-12 md:h-16 opacity-[0.85]" />
          </a>
        </div>

        {/* CENTER: DF LOGO (clickable) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform pointer-events-auto">
          <button onClick={handleLogoClick}>
            <img
              src="/logo/DF.png"
              alt="Digital Fortress"
              className="h-20 md:h-28"
            />
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
