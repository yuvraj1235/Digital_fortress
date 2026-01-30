"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Panorama from "@/components/village";
import BottomBar from "@/components/ShareIcon";
import LoadingScreen from "@/components/LoadingPage";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingScreen progress={progress} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Navbar />
      <Panorama />
      <BottomBar />
    </main>
  );
}
