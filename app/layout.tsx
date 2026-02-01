// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AudioProvider } from "@/contexts/AudioContext";
import Profile from "@/components/Profile";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Fortress",
  description: "The ultimate treasure hunt experience",
};

/**
 * ✅ ContentWrapper prevents "401 Unauthorized" 
 * It waits for AuthContext to finish loading before rendering components 
 * that depend on a token (like the Profile component).
 */
function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // If AuthContext is still checking localStorage/API for a token
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        {/* You can replace this with your actual LoadingPage component */}
        <div className="text-white tracking-widest animate-pulse">
          INITIALIZING...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Only render Profile if the user is logged in */}
      {user && <Profile />}
      {children}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <AudioProvider>
          <AuthProvider>
            <ContentWrapper>
              {children}
            </ContentWrapper>
            
            {/* Global Notifications */}
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </AudioProvider>

        {/* ✅ Google Identity Services 
          Loading it here once globally is better than loading it 
          inside individual Login/Register pages.
        */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}