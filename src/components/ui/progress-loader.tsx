"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "~/utils/cn";
import { useGitHubStore } from "~/lib/github";
import { Text } from "./Text";

interface ProgressLoaderProps {
  onComplete?: () => void;
  className?: string;
  isDataReady?: boolean;
  compact?: boolean;
}

type LoadingMessage = {
  threshold: number;
  message: string;
};

const loadingMessages: LoadingMessage[] = [
  { threshold: 10, message: "Initializing connection..." },
  { threshold: 20, message: "Connecting to GitHub API..." },
  { threshold: 30, message: "Fetching recent contributions..." },
  { threshold: 40, message: "Processing contribution data..." },
  { threshold: 50, message: "Analyzing contribution patterns..." },
  { threshold: 60, message: "Organizing contribution history..." },
  { threshold: 70, message: "Fetching repository data..." },
  { threshold: 80, message: "Processing language statistics..." },
  { threshold: 90, message: "Analyzing code distribution..." },
  { threshold: 95, message: "Finalizing data processing..." },
  { threshold: 100, message: "Preparing visualization..." },
] as const;

export function ProgressLoader({
  onComplete,
  className,
  isDataReady,
  compact = false,
}: ProgressLoaderProps) {
  const progress = useGitHubStore((state) => state.progress);
  const error = useGitHubStore((state) => state.error);

  useEffect(() => {
    if (progress === 100 && isDataReady) {
      onComplete?.();
    }
  }, [progress, isDataReady, onComplete]);

  const getLoadingMessage = () => {
    if (error) return "Error loading data";
    if (progress === 100) return "Complete";
    
    const currentMessage = loadingMessages.find(msg => progress < msg.threshold);
    return currentMessage?.message || "Complete";
  };

  if (compact) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2"
        role="status"
        aria-label="Loading"
      >
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/80 border-t-transparent" />
        <Text variant="body-sm" className="text-foreground/60">
          Loading...
        </Text>
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
      role="status"
      aria-label={`Loading ${Math.round(progress)}%`}
    >
      <div className="relative h-2 w-64 overflow-hidden rounded-full bg-background/50">
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0",
            error ? "bg-destructive/90" : "bg-primary/90"
          )}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            duration: 0.3, 
            ease: [0.16, 1, 0.3, 1]
          }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Text 
          variant="body-sm"
          className={cn(
            error ? "text-destructive" : "text-foreground/60"
          )}
        >
          {getLoadingMessage()} {!error && `(${Math.round(progress)}%)`}
        </Text>
      </motion.div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Text 
            variant="body-sm"
            className="text-destructive/90"
          >
            {error}
          </Text>
        </motion.div>
      )}
    </div>
  );
}
