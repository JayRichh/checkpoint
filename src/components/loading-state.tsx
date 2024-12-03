"use client";

import React from "react";
import { motion } from "framer-motion";
import { ProgressLoader } from "./ui/progress-loader";
import { Text } from "./ui/Text";

interface LoadingStateProps {
  message?: string;
  isDataReady?: boolean;
  compact?: boolean;
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export function LoadingState({ message, isDataReady, compact }: LoadingStateProps) {
  if (compact) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        aria-label="Loading"
      >
        <ProgressLoader compact />
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="flex min-h-[400px] flex-col items-center justify-center"
      role="status"
      aria-label="Loading content"
    >
      <div className="text-center">
        <ProgressLoader isDataReady={isDataReady} />
        {message && (
          <Text 
            variant="body-sm" 
            className="mt-4 text-foreground/60"
          >
            {message}
          </Text>
        )}
      </div>
    </motion.div>
  );
}

export function LoadingSpinner() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-5 w-5 animate-spin items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div className="h-2.5 w-2.5 rounded-full border-2 border-current border-t-transparent opacity-70" />
    </motion.div>
  );
}

export function PageLoadingState() {
  return (
    <div 
      className="flex min-h-[calc(100vh-5rem)] items-center justify-center"
      role="status"
      aria-label="Loading page"
    >
      <LoadingState message="Loading..." />
    </div>
  );
}

export function SectionLoadingState() {
  return (
    <div 
      className="flex min-h-[300px] items-center justify-center"
      role="status"
      aria-label="Loading section"
    >
      <LoadingState compact />
    </div>
  );
}
