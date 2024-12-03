"use client";

import { Info } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipProvider } from "~/components/ui/Tooltip";
import { cn } from "~/utils/cn";
import { scaleIn } from "~/utils/motion";

type TooltipSize = "sm" | "md" | "lg";

interface InfoTooltipProps {
  content: string;
  size?: TooltipSize;
}

const sizeClasses: Record<TooltipSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6"
} as const;

export function InfoTooltip({ content, size = "md" }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip 
        content={
          <motion.span
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="block max-w-xs text-sm leading-relaxed"
          >
            {content}
          </motion.span>
        }
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className={cn(
            "rounded-full",
            "text-foreground/50 hover:text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/30",
            "cursor-help transition-colors duration-200",
            sizeClasses[size]
          )}
          aria-label="More information"
        >
          <Info className="w-full h-full" />
        </motion.button>
      </Tooltip>
    </TooltipProvider>
  );
}
