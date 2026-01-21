// @/components/MyMap.tsx
import { Map, MapControls } from "@/components/ui/map";
import { Card } from "@/components/ui/card";

export function MyMap({ center, clues }: { center?: [number, number], clues?: any[] }) {
  return (
    // h-full and w-full ensures it takes up all space provided by the parent
    <Card className="w-full h-full p-0 overflow-hidden  bg-transparent">
      <Map
        center={center || [-74.006, 40.7128]}
        zoom={11}
        styles={{
          light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
          dark: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        }}
      >
        <MapControls />
      </Map>
    </Card>
  );
}