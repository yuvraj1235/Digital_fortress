import IslandScene from "@/components/Island";
import Navbar from "@/components/Navbar";
import BottomBar from "@/components/ShareIcon";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
        <audio src="/sounds/waves.webm" autoPlay loop />
        <Navbar></Navbar>
     <IslandScene></IslandScene>
     <BottomBar/>
    </main>
  );
}
