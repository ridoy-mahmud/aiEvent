import type { Metadata } from "next";
import "./globals.css";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReduxProvider from "@/components/ReduxProvider";
import DevToolsProtection from "@/components/DevToolsProtection";
import DynamicComponents from "@/components/DynamicComponents";

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
          <DevToolsProtection />
          <DynamicComponents />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
