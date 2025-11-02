"use client";

import dynamic from "next/dynamic";

// Lazy load heavy components for better initial load performance
const LightRays = dynamic(() => import("@/components/LightRays"), {
  ssr: false, // Disable SSR for WebGL component
});

const ChatBot = dynamic(() => import("@/components/ChatBot"), {
  ssr: false, // Disable SSR for client-only component
});

export default function DynamicComponents() {
  return (
    <>
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
      <ChatBot />
    </>
  );
}

