"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileModal from "../app/profile/page";

function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full bg-transparent">
        <div className="relative flex w-full items-center justify-between px-6 py-4">

          {/* LEFT LOGO */}
          <div className="z-10 shrink-0 hover:scale-110 transition">
            <a
              href="https://nitdgplug.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/logo/glug.png"
                alt="GLUG Logo"
                className="h-20 w-20 object-contain drop-shadow-lg"
              />
            </a>
          </div>

          {/* CENTER LOGO */}
          <div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition">
            <img
              src="/logo/DF.png"
              alt="Digital Fortress"
              onClick={() => router.push("/home")}
              className="h-24 md:h-28 cursor-pointer object-contain drop-shadow-lg"
            />
          </div>

          {/* RIGHT PROFILE ICON */}
          <button
            onClick={() => setOpen(true)}
            className="z-10 h-12 w-12 overflow-hidden rounded-full border-2 border-yellow-600 hover:scale-110 transition"
          >
            <img
              src="/avatar/default.png"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </button>
        </div>
      </nav>

      {/* PROFILE POPUP */}
      {open && <ProfileModal onClose={() => setOpen(false)} />}
    </>
  );
}

export default Navbar;
