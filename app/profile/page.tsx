"use client";

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md font-serif p-4">
      
      {/* CONTAINER: 
         Added 'mt-12' to give space for the avatar sticking out the top.
         Removed 'overflow-hidden' from here to allow the avatar to pop out.
      */}
      <div className="relative w-full max-w-[700px] bg-[#1a1614] rounded-[40px] border-4 border-[#8b7355] shadow-[0_0_60px_rgba(0,0,0,1)] pt-12 pb-6 px-1">
        
        {/* THE FLOATING AVATAR: Positioned absolutely to prevent overlap issues */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50">
          <div className="relative">
            {/* Ornate Gold Ring */}
            <div className="h-24 w-24 rounded-full border-[6px] border-[#c5a059] bg-[#2a2420] shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-[#1a1614]">
               {/* Replace with your image tag: <img src="..." /> */}
               <div className="w-full h-full bg-gradient-to-b from-blue-900 to-indigo-700" /> 
            </div>
            {/* Top Ornament */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#c5a059] text-2xl drop-shadow-md">✦</div>
          </div>
        </div>

        {/* INNER FRAME: The double-line gold border */}
        <div className="rounded-[32px] border-2 border-[#c5a059] p-6 flex flex-col items-center">
          
          {/* HEADER */}
          <div className="text-center space-y-1 mb-8">
            <h2 className="text-4xl font-bold tracking-[0.2em] text-[#e8d5b5] font-['Cinzel'] drop-shadow-md uppercase">
              ARCED_USER
            </h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8b7355] font-bold">
              From Google Auth
            </p>
          </div>

          {/* MIDDLE SECTION */}
          <div className="w-full flex flex-row justify-between items-center gap-6 mb-8">
            {/* BADGES */}
            <div className="grid grid-cols-3 gap-y-6 gap-x-4">
              {[
                { label: "COMPLETED", active: true },
                { label: "HISTORY", active: false },
                { label: "LOCKED", lock: true },
                { label: "COMPLETED", active: true },
                { label: "HISTORY", active: false },
                { label: "CURRENT", active: false },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="h-14 w-12 bg-[#2a2420] rounded-t-lg rounded-b-2xl border-2 border-[#634e34] shadow-inner flex items-center justify-center relative">
                    {item.active && <span className="text-green-500 text-xl">✓</span>}
                    {item.lock && <span className="text-gray-600 text-sm">🔒</span>}
                  </div>
                  <span className="text-[8px] mt-1 font-bold text-[#8b7355] uppercase">{item.label}</span>
                </div>
              ))}
            </div>

            {/* SCROLL */}
            <div className="w-36 h-40 bg-[#d2b48c] rounded-sm shadow-2xl flex flex-col p-3 border-x-4 border-[#b8956a] relative">
               <div className="absolute -top-2 left-[-5%] w-[110%] h-4 bg-[#e5c7a3] rounded-full border-b border-[#8b7355]"></div>
               <div className="w-full h-full border border-[#8b7355]/20 flex flex-col gap-1.5 pt-2 opacity-40">
                  <div className="h-1 w-full bg-[#8b7355]"></div>
                  <div className="h-1 w-[90%] bg-[#8b7355]"></div>
                  <div className="h-1 w-[95%] bg-[#8b7355]"></div>
                  <div className="h-1 w-full bg-[#8b7355]"></div>
               </div>
               <div className="absolute -bottom-2 left-[-5%] w-[110%] h-4 bg-[#e5c7a3] rounded-full border-t border-[#8b7355]"></div>
            </div>
          </div>

          {/* XP SECTION */}
          <div className="w-full max-w-md mb-8">
            <div className="relative h-6 w-full rounded-full border-2 border-[#c5a059] bg-[#000] p-[2px] shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]" 
                style={{ width: '86%' }}
              />
            </div>
            <div className="text-center mt-2">
              <p className="text-[#e8d5b5] text-sm font-bold tracking-widest">XP: 3450 / 4000</p>
              <p className="text-[#8b7355] text-[10px] uppercase font-bold tracking-widest">Next Level: Strategy</p>
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="w-full flex justify-between items-center px-4 relative">
            <button className="flex-1 max-w-[180px] py-2.5 rounded-full border-2 border-[#8b7355] bg-gradient-to-b from-[#4a1c1c] to-[#2d1111] text-[#e8d5b5] text-[11px] font-bold uppercase tracking-widest shadow-lg hover:brightness-110">
              Edit Profile
            </button>

            {/* Middle Google Button - Re-aligned to bottom center */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px]">
              <div className="h-12 w-12 rounded-full border-2 border-[#c5a059] bg-[#1a1614] flex items-center justify-center shadow-2xl ring-4 ring-[#1a1614]">
                <span className="text-xl font-bold bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent font-sans">G</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex-1 max-w-[180px] py-2.5 rounded-full border-2 border-[#8b7355] bg-gradient-to-b from-[#4a1c1c] to-[#2d1111] text-[#e8d5b5] text-[11px] font-bold uppercase tracking-widest shadow-lg hover:brightness-110"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}