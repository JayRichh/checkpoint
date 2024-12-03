"use client";

import { Info } from "lucide-react";
import { Tooltip, TooltipProvider } from "../../../components/ui/Tooltip";

interface InfoTooltipProps {
  content: string;
  size?: "sm" | "md" | "lg";
}

export function InfoTooltip({ content, size = "md" }: InfoTooltipProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <TooltipProvider>
      <Tooltip content={content}>
        <Info className={`${sizeClasses[size]} text-muted-foreground/75 hover:text-muted-foreground cursor-help transition-colors`} />
      </Tooltip>
    </TooltipProvider>
  );
}
