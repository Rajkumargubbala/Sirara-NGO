"use client";

import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-12", className)}>
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <LoadingSpinner />
      <p className="text-gray-400 font-medium animate-pulse italic">Loading impact...</p>
    </div>
  );
}
