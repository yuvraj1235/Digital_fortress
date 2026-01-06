"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  let mouseX = 0, mouseY = 0;
  let cx = 0, cy = 0;
  let lastX = 0, lastY = 0;

  const [cursorText, setCursorText] = useState("VISIT");
  const speed = 0.2;

  // ----------- SMOOTH FOLLOW (circle + text together) -------------
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", move);

    const tick = () => {
      cx += (mouseX - cx) * speed;
      cy += (mouseY - cy) * speed;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
      }
      if (textRef.current) {
        textRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
      }

      // ROTATION BASED ON MOVEMENT
      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      gsap.to(cursorRef.current, {
        rotate: angle,
        duration: 0.3,
        ease: "power2.out",
      });

      lastX = mouseX;
      lastY = mouseY;

      requestAnimationFrame(tick);
    };

    tick();
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // ----------- LEVEL HOVER INTERACTIONS (scale + text change ONLY) -------------
  useEffect(() => {
    const items = document.querySelectorAll("[data-level]");

    const enter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const name = el.getAttribute("data-level");

      setCursorText(name || "VISIT");

      // Grow cursor
      gsap.to(cursorRef.current, {
        scale: 1.7,
        duration: 0.25,
        ease: "power3.out",
      });
    };

    const leave = () => {
      setCursorText("VISIT");

      // Shrink cursor
      gsap.to(cursorRef.current, {
        scale: 1,
        duration: 0.25,
        ease: "power3.out",
      });
    };

    items.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    return () =>
      items.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
  }, []);

  return (
    <>
      {/* Cursor Circle */}
      <div
        ref={cursorRef}
        className="
          fixed top-0 left-0 pointer-events-none z-[9999]
          w-24 h-24 rounded-full
          border-2 border-[#00eaff]
          shadow-[0_0_15px_#00eaff]
        "
        style={{
          marginLeft: "-48px",
          marginTop: "-48px",
        }}
      />

      {/* Cursor Text */}
      <div
        ref={textRef}
        className="
          fixed top-0 left-0 pointer-events-none z-[10000]
          text-white text-xs font-bold tracking-wide
        "
        style={{
          marginLeft: "-12px",
          marginTop: "-6px",
        }}
      >
        {cursorText}
      </div>
    </>
  );
}
