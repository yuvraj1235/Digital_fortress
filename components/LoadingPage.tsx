import { useState, useEffect } from "react";

type LoadingScreenProps = {
  progress?: number;
  onFinished?: () => void;
};

export default function LoadingScreen({ progress = 0, onFinished }: LoadingScreenProps) { // ✅ Add prop
  const [visible, setVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setIsFading(true); // Start the 700ms CSS fade
      const timer = setTimeout(() => {
        setVisible(false);
        if (onFinished) onFinished(); // ✅ Tell Home.tsx the screen is gone
      }, 700); // Match your transition duration
      return () => clearTimeout(timer);
    }
  }, [progress, onFinished]);

  if (!visible) return null;
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* DF Logo with Pulse Effect */}
      <div className="relative mb-12">
        <img
          src="/logo/DF_LOGO.png"
          className="h-32 md:h-40 object-contain animate-pulse"
          style={{ filter: "drop-shadow(0 0 15px rgba(255,255,255,0.2))" }}
          alt="Digital Fortress Logo"
        />
      </div>

      {/* Progress Bar Container */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-64 md:w-80 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ 
              width: `${progress}%`,
              boxShadow: "0 0 10px #fff"
            }}
          />
        </div>
        
        {/* Progress Percentage */}
        <span 
          className="text-white/50 font-mono"
          style={{ 
            fontSize: "10px",
            letterSpacing: "0.3em"
          }}
        >
          INITIALIZING {progress}%
        </span>
      </div>

      {/* Experience Disclaimer */}
      <div className="flex flex-col items-center gap-3 text-center px-4 mt-16">
        <p 
          className="text-white font-bold uppercase"
          style={{ 
            fontSize: "12px",
            letterSpacing: "0.2em"
          }}
        >
          For the Best Experience
        </p>
        <div 
          className="flex items-center gap-6 text-white font-bold uppercase"
          style={{ 
            fontSize: "11px",
            letterSpacing: "0.15em"
          }}
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">🖥️</span> Desktop Recommended
          </span>
          <span className="w-px h-4 bg-white/30" />
          <span className="flex items-center gap-2">
            <span className="text-xl">🎧</span> Use Headphones
          </span>
        </div>
      </div>
    </div>
  );
}