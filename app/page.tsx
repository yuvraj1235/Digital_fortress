import IslandScene from "@/components/Island";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Navbar></Navbar>
     <IslandScene></IslandScene>
    </main>
  );
}
