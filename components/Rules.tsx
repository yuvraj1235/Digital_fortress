"use client";

type RulesProps = {
  open: boolean;
  onClose: () => void;
};

export default function Rules({ open, onClose }: RulesProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-2xl font-bold hover:scale-110 transition z-[110]"
      >
        ✕
      </button>

      {/* PARCHMENT */}
      <div
        className="relative"
        style={{
          width: "90vw",
          maxWidth: "1200px",
          aspectRatio: "4 / 3",
          backgroundImage: "url('/rules_scroll.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
      >
        {/* CONTENT SAFE AREA */}
        <div
          className="absolute flex flex-col items-center text-[#3a2a1a]"
          style={{
            top: "25%",
            bottom: "26%",
            left: "13%",
            right: "13%",
          }}
        >
          {/* TITLE */}
          <h1
            className="font-bold tracking-widest mb-5 text-center"
            style={{
              fontSize: "clamp(1.3rem, 2.5vw, 2.2rem)",
            }}
          >
            RULES OF THE GAME
          </h1>

          {/* RULES LIST */}
          <ul
            className="list-disc space-y-3 leading-relaxed"
            style={{
              fontSize: "clamp(0.75rem, 1.4vw, 1.05rem)",
              maxWidth: "42rem",
            }}
          >
            <li>Solving each round rewards you <b>10 points</b>.</li>
            <li>Each round is based on a theme which you need to figure out.</li>
            <li>Each round consists of a main question and a few clue questions.</li>
            <li>Answering each clue question unlocks a position on the map.</li>
            <li>These locations, shapes, or street-views are hints to the main question.</li>
            <li>The leaderboard will be inactive during sample rounds.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
