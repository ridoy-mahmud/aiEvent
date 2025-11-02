"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "@/lib/store/hooks";

export default function DevToolsProtection() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const devToolsOpen = useRef(false);

  useEffect(() => {
    // Allow admins to use dev tools
    if (isAuthenticated && user?.role === "admin") {
      return;
    }

    // Block right-click context menu for non-admins
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Block keyboard shortcuts for dev tools
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 - Open DevTools
      if (e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+I - Open DevTools
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+J - Open Console
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+C - Open Element Inspector
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U - View Source
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+S - Save Page
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+P - Command Palette (some browsers)
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Detect DevTools opening
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;

      if (widthThreshold || heightThreshold) {
        if (!devToolsOpen.current) {
          devToolsOpen.current = true;
          // Clear console and show warning
          console.clear();
          console.log("%cStop!", "color: red; font-size: 50px; font-weight: bold;");
          console.log("%cThis is a browser feature intended for developers.", "color: red; font-size: 16px;");
          console.log("%cIf someone told you to copy-paste something here, it is a scam and will give them access to your account.", "color: red; font-size: 14px;");
        }
      } else {
        devToolsOpen.current = false;
      }
    };

    // Block copy shortcut (Ctrl+C in dev tools context)
    const handleCopy = (e: ClipboardEvent) => {
      // Only block if dev tools might be open
      if (devToolsOpen.current) {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopy);

    // Monitor for DevTools
    const interval = setInterval(detectDevTools, 500);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopy);
      clearInterval(interval);
    };
  }, [isAuthenticated, user]);

  return null;
}

