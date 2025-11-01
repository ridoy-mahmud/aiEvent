"use client";

import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Loader = ({ size = "md", className }: LoaderProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-transparent border-primary",
        sizeClasses[size],
        className
      )}
    />
  );
};

export const PageLoader = () => {
  return (
    <div className="flex-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" />
        <p className="text-light-100 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export const ButtonLoader = () => {
  return <Loader size="sm" className="w-4 h-4" />;
};

