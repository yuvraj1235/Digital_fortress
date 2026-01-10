"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    const move = (e: MouseEvent) => {
      // Direct GSAP move for smoothness without complex math
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-level]");
      if (target) {
        setCursorText(target.getAttribute("data-level") || "");
        gsap.to(cursorRef.current, { scale: 1.5, backgroundColor: "#5d4037", duration: 0.3 });
      }
    };

    const handleOut = () => {
      setCursorText("");
      gsap.to(cursorRef.current, { scale: 1, backgroundColor: "transparent", duration: 0.3 });
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] 
                 flex items-center justify-center
                 w-8 h-8 rounded-full border-2 border-[#8d6e63]
                 text-[10px] font-bold text-[#3e2723] transition-colors"
      style={{ marginLeft: "-16px", marginTop: "-16px" }}
    >
      {cursorText}
    </div>
  );
}