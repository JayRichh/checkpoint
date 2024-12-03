"use client";

import React from "react";
import { ProgressLoader } from "./ui/progress-loader";

interface LoadingStateProps {
  message?: string;
  isDataReady?: boolean;
  compact?: boolean;
}

export function LoadingState({ message, isDataReady, compact }: LoadingStateProps) {
  if (compact) {
    return <ProgressLoader compact />;
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <div className="text-center">
        <ProgressLoader isDataReady={isDataReady} />
        {message && (
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex h-5 w-5 animate-spin items-center justify-center">
      <div className="h-2.5 w-2.5 rounded-full border-2 border-current border-t-transparent" />
    </div>
  );
}

export function PageLoadingState() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <LoadingState message="Loading..." />
    </div>
  );
}

export function SectionLoadingState() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <LoadingState compact />
    </div>
  );
}
