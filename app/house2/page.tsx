import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Panorama from "@/components/House2";
import BottomBar from "@/components/ShareIcon";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Navbar></Navbar>
      <Panorama/>
     <BottomBar></BottomBar>
    </main>
  );
}
