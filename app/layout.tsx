import type { Metadata } from "next";
import "./globals.css";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import Footer from "@/components/Footer";
import ReduxProvider from "@/components/ReduxProvider";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Summit - Discover Cutting-Edge AI Conferences",
  description:
    "Join cutting-edge conferences, workshops, and networking events in the world of AI",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
      >
        <ReduxProvider>
          <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
            <LightRays
              raysOrigin="top-center"
              raysColor="#5dfeca"
              raysSpeed={0.5}
              lightSpread={0.9}
              rayLength={1.4}
              followMouse={true}
              mouseInfluence={0.02}
              noiseAmount={0.0}
              distortion={0.01}
              className="custom-rays"
            />
          </div>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ChatBot />
        </ReduxProvider>
      </body>
    </html>
  );
}
