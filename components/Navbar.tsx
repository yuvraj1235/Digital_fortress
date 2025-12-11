import React from "react";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent">
      {/* Container with justify-between pushes items to edges */}
      <div className="relative flex items-center justify-between px-6 py-4 w-full">
        
        {/* LEFT LOGO */}
        <div className="shrink-0 z-10">
          <img 
            src="/logo/glug.png" 
            alt="GLUG Logo" 
            className="w-20 h-20 object-contain drop-shadow-lg" 
          />
        </div>

        {/* CENTER LOGO - Absolutely Positioned */}
        {/* 'left-1/2 -translate-x-1/2' locks it to the exact screen center */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
          <img 
            src="/logo/DF.png" 
            alt="Digital Fortress" 
            // Reduced h-40 to h-24 or h-28 to align better with the left logo
            className="h-24 md:h-28 object-contain drop-shadow-lg" 
          />
        </div>

        
      </div>
    </nav>
  );
}

export default Navbar;