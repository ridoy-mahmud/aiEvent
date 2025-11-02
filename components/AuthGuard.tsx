"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { PageLoader } from "./Loader";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect if mounted, not loading, not authenticated, and not already on login page
    if (mounted && !loading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        router.push("/login");
      }
    }
  }, [mounted, isAuthenticated, loading, router]);

  // Show loader on initial mount or while loading
  if (!mounted || loading) {
    return <PageLoader />;
  }

  // Show nothing if not authenticated (redirect is happening)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

