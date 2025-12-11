"use client";
import IslandScene from "@/components/Island";
import Navbar from "@/components/Navbar";

import LoadingScreen from "@/components/LoadingPage";
import { useState } from "react";
import { Loader } from "@react-three/drei";

import BottomBar from "@/components/ShareIcon";



export default function Home() {

  const [progress, setProgress] = useState(0);
  return (
    <main className="flex min-h-screen items-center justify-center">
       <LoadingScreen progress={progress} />
        <audio src="/sounds/waves.webm" autoPlay loop />
        <Navbar></Navbar>
     <IslandScene></IslandScene>
      <Loader
  dataInterpolation={(p) => {
    const val = Math.floor(p);
    setProgress(val);
    return val.toString(); // ✔
  }}
/>

     <BottomBar/>
    </main>
  );
}
