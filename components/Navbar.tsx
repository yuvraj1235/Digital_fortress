"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService"; // Double check this path!

function Navbar() {
  const router = useRouter();
  const [playerImage, setPlayerImage] = useState("/avatar/default.png");
  // You can also track the round number to show it in the UI
  const [roundNo, setRoundNo] = useState(1);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await authService.getUserProfile();
        if (data.image) {
          setPlayerImage(data.image);
        }
        if (data.roundNo) {
          setRoundNo(data.roundNo);
        }
      } catch (err) {
        console.log("User not logged in or error fetching profile");
      }
    };

    fetchUserData();
  }, []);

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

        {/* RIGHT: PROFILE */}
        <div className="z-10 flex flex-col items-center">
          <button className="h-12 w-12 md:h-14 md:w-14 overflow-hidden rounded-full border-2 border-yellow-600 shadow-lg">
            <img
              src={playerImage}
              alt="Profile"
              className="h-full w-full object-cover"
              onError={() => setPlayerImage("/avatar/default.png")}
            />
          </button>
          {/* Displays the round number we extracted */}
          <p className="text-[10px] md:text-xs text-yellow-500 font-bold mt-1">
            Round {roundNo}
          </p>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;