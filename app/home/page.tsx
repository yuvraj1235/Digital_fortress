import IslandScene from "@/components/Island";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
        <audio src="/sounds/waves.webm" autoPlay loop />
        <Navbar></Navbar>
     <IslandScene></IslandScene>
    </main>
  );
}
