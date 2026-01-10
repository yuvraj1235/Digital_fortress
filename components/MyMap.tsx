"use client";

import { useEffect, useRef } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MarkerPopup,
  MapControls,
  type MapRef, // Import the type for the ref
} from "@/components/ui/map";
import { Navigation, MapPin } from "lucide-react";

interface MyMapProps {
  center: [number, number]; // [lat, lng] from backend
  clues: any[]; //
}

export function MyMap({ center, clues }: MyMapProps) {
  const mapRef = useRef<MapRef>(null);

  // Focus Logic: Triggered when the center prop changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [center[1], center[0]], // Convert [lat, lng] to [lng, lat]
        zoom: 15,
        essential: true, // This animation is considered essential with respect to prefers-reduced-motion
      });
    }
  }, [center]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border-2 border-[#1a100c] relative">
<Map 
  ref={mapRef}
  initialViewState={{
    longitude: center[1],
    latitude: center[0],
    zoom: 13
  }}
  // REPLACE THIS LINE:
  mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json"
>
        <MapControls
        />

        {clues.map((clue) => {
          if (!clue.solved || !clue.position) return null;

          return (
            <MapMarker
              key={clue.id}
              longitude={clue.position[1]}
              latitude={clue.position[0]}
            >
              <MarkerContent>
                <div className="group relative flex items-center justify-center cursor-pointer">
                  <div className="absolute size-8 bg-[#FFD700]/30 rounded-full animate-ping" />
                  <div className="size-6 rounded-full bg-[#FFD700] border-2 border-[#3E2723] shadow-[0_0_15px_rgba(255,215,0,1)] flex items-center justify-center transition-transform group-hover:scale-125">
                    <MapPin className="size-3.5 text-[#3E2723]" />
                  </div>
                </div>
              </MarkerContent>
              
              <MarkerTooltip>Clue {clue.id} Unlocked</MarkerTooltip>

              <MarkerPopup className="bg-[#EADDCA] border-2 border-[#8B735B] p-0 overflow-hidden w-48 shadow-2xl">
                <div className="bg-[#3E2723] p-2 text-center">
                  <span className="text-[10px] font-bold text-[#FFD700] uppercase tracking-widest">Discovery</span>
                </div>
                <div className="p-3 text-center space-y-2">
                  <h3 className="font-serif font-bold text-[#3E2723] leading-tight text-sm">Location Revealed</h3>
                  <div className="pt-1 flex items-center justify-center gap-1 text-[10px] font-bold text-[#1A365D] uppercase">
                    <Navigation className="size-3" />
                    Sector Unlocked
                  </div>
                </div>
              </MarkerPopup>
            </MapMarker>
          );
        })}
      </Map>

      {/* Manual Focus Button */}
      <button 
        onClick={() => mapRef.current?.flyTo({ center: [center[1], center[0]], zoom: 15 })}
        className="absolute top-4 right-4 z-10 bg-[#3E2723]/80 backdrop-blur-md border border-[#FFD700]/50 p-2 rounded-full shadow-lg hover:bg-[#5D4037] transition-all group"
      >
        <Navigation className="size-5 text-[#FFD700] group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}