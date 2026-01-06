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
            bottom: "28%",
            left: "15%",
            right: "14%",
            fontSize: "clamp(0.7rem, 1.2vw, 1.05rem)",
            fontFamily: "'Cormorant Garamond', 'Garamond', 'Times New Roman', serif",
          }}
        >
          {/* TITLE */}
          <h1
            className="mb-6 text-center"
            style={{
              fontFamily: "'Cinzel', 'Trajan Pro', 'Times New Roman', serif",
              fontWeight: 600,
              letterSpacing: "0.25em",
              fontSize: "1.9em",
            }}
          >
            RULES OF THE GAME
          </h1>

          {/* RULES LIST */}
          <ul className="space-y-2 leading-relaxed max-w-3xl">
            {[
              "Solving each round rewards you 10 points.",
              "Each round is based on a theme which you need to figure out.",
              "Each round consists of a main question and a few clue questions.",
              "Answering each clue question unlocks a position on the map.",
              "These locations, shapes, or street-views are hints to the main question.",
              "The leaderboard will be inactive during sample rounds.",
            ].map((rule, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-[#6b4a2d] text-[1.2em] mt-[0.15em]">
                  ✦
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
