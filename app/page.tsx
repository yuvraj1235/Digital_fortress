import IslandScene from "@/components/Island";
import Navbar from "@/components/Navbar";
import BottomBar from "@/components/ShareIcon";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Navbar></Navbar>
     <IslandScene></IslandScene>
     <BottomBar></BottomBar>
    </main>
  );
}
