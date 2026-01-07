// @/components/MyMap.tsx
import { Map, MapControls } from "@/components/ui/map";
import { Card } from "@/components/ui/card";

export function MyMap() {
  return (
    // h-full and w-full ensures it takes up all space provided by the parent
    <Card className="w-full h-full p-0 overflow-hidden  bg-transparent">
     <Map
  center={[-74.006, 40.7128]}
  zoom={11}
  styles={{
    light: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  }}
>
  <MapControls />
</Map>
    </Card>
  );
}