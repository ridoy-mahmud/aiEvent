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

// Event Card Skeleton Loader
export const EventCardSkeleton = () => {
  return (
    <div className="glass p-4 md:p-6 rounded-lg card-shadow relative overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative h-[180px] md:h-[200px] w-full rounded-lg overflow-hidden mb-3 md:mb-4 bg-gradient-to-br from-dark-200 via-dark-100 to-dark-200">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent" 
             style={{ 
               animation: 'shimmer-slow 3s infinite',
               transform: 'translateX(-100%)'
             }} />
        {/* Category Badge Skeleton */}
        <div className="absolute top-2 right-2 w-20 h-6 rounded-full bg-dark-200/50 backdrop-blur-sm animate-pulse" />
      </div>

      {/* Title Skeleton */}
      <div className="space-y-2 mb-3">
        <div className="h-6 bg-gradient-to-r from-dark-200 via-dark-100 to-dark-200 rounded-lg w-3/4 animate-shimmer" />
        <div className="h-4 bg-gradient-to-r from-dark-200 via-dark-100 to-dark-200 rounded w-1/2 animate-shimmer" style={{ animationDelay: '0.2s' }} />
      </div>

      {/* Description Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gradient-to-r from-dark-200 via-dark-100 to-dark-200 rounded w-full animate-shimmer" style={{ animationDelay: '0.3s' }} />
        <div className="h-3 bg-gradient-to-r from-dark-200 via-dark-100 to-dark-200 rounded w-5/6 animate-shimmer" style={{ animationDelay: '0.4s' }} />
      </div>

      {/* Info Icons Skeleton */}
      <div className="datetime mb-4 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/20 animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-dark-200 via-dark-100 to-dark-200 rounded w-32 animate-shimmer" style={{ animationDelay: `${0.5 + i * 0.1}s` }} />
          </div>
        ))}
      </div>

      {/* Buttons Skeleton */}
      <div className="flex gap-3">
        <div className="flex-1 h-9 bg-gradient-to-r from-dark-200 via-dark-100 to-dark-200 rounded-lg animate-shimmer" style={{ animationDelay: '0.9s' }} />
        <div className="flex-1 h-9 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-lg animate-shimmer" style={{ animationDelay: '1s' }} />
      </div>

      {/* Shimmer overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
          animation: 'shimmer-slow 3s infinite',
        }}
      />
    </div>
  );
};

// Event Cards Grid Skeleton (multiple cards)
interface EventCardsSkeletonProps {
  count?: number;
}

export const EventCardsSkeleton = ({ count = 6 }: EventCardsSkeletonProps) => {
  return (
    <div className="events grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="relative overflow-hidden">
          <EventCardSkeleton />
        </div>
      ))}
    </div>
  );
};

