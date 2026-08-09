"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type CursorMode = "default" | "interactive" | "text" | "level";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState("");
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouch) return;

    const move = (e: MouseEvent) => {
      if (!visible) setVisible(true);

      gsap.set(dotRef.current, { x: e.clientX, y: e.clientY });

      gsap.to(ringRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    const resolveMode = (el: HTMLElement | null): { mode: CursorMode; text: string } => {
      if (!el) return { mode: "default", text: "" };

      const levelEl = el.closest("[data-level]") as HTMLElement | null;
      if (levelEl) return { mode: "level", text: levelEl.getAttribute("data-level") || "" };

      const textEl = el.closest("input, textarea, [contenteditable='true']");
      if (textEl) return { mode: "text", text: "" };

      const interactiveEl = el.closest("a, button, [role='button'], [data-cursor='interactive']");
      if (interactiveEl) return { mode: "interactive", text: "" };

      return { mode: "default", text: "" };
    };

    const handleOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.contains(e.relatedTarget as Node)) return;
      const { mode: nextMode, text } = resolveMode(target);
      setMode(nextMode);
      setCursorText(text);
    };

    const handleOut = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.contains(e.relatedTarget as Node)) return;
      const { mode: nextMode, text } = resolveMode(e.relatedTarget as HTMLElement | null);
      setMode(nextMode);
      setCursorText(text);
    };

    const handleDown = () => {
      gsap.to([dotRef.current, ringRef.current], { scale: 0.8, duration: 0.15, ease: "power2.out" });
    };
    const handleUp = () => {
      gsap.to([dotRef.current, ringRef.current], { scale: 1, duration: 0.25, ease: "back.out(3)" });
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("pointerover", handleOver);
    document.addEventListener("pointerout", handleOut);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("pointerover", handleOver);
      document.removeEventListener("pointerout", handleOut);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [visible]);

  useEffect(() => {
    if (!ringRef.current) return;

    switch (mode) {
      case "interactive":
        gsap.to(ringRef.current, {
          width: 56,
          height: 56,
          borderRadius: 999,
          backgroundColor: "#111111",
          borderColor: "#111111",
          duration: 0.3,
          ease: "power3.out",
        });
        break;
      case "level":
        gsap.to(ringRef.current, {
          width: 64,
          height: 64,
          borderRadius: 999,
          backgroundColor: "#3fb4ff",
          borderColor: "#3fb4ff",
          duration: 0.3,
          ease: "power3.out",
        });
        break;
      case "text":
        gsap.to(ringRef.current, {
          width: 3,
          height: 28,
          borderRadius: 2,
          backgroundColor: "#111111",
          borderColor: "#111111",
          duration: 0.25,
          ease: "power3.out",
        });
        break;
      default:
        gsap.to(ringRef.current, {
          width: 32,
          height: 32,
          borderRadius: 999,
          backgroundColor: "transparent",
          borderColor: "#111111",
          duration: 0.3,
          ease: "power3.out",
        });
    }
  }, [mode]);

  return (
    <>
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] border-2
                    flex items-center justify-center
                    text-[10px] font-bold uppercase tracking-wide text-white
                    transition-opacity duration-300
                    ${visible ? "opacity-100" : "opacity-0"}`}
        style={{
          width: 32,
          height: 32,
          marginLeft: -16,
          marginTop: -16,
          borderColor: "#111111",
          borderRadius: 999,
        }}
      >
        {mode === "level" && cursorText}
      </div>

      <div
        ref={dotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full
                    transition-opacity duration-300
                    ${visible ? "opacity-100" : "opacity-0"}`}
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          backgroundColor: "#111111",
        }}
      />
    </>
  );
}