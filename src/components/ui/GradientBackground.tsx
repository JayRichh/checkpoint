"use client";

import { motion } from "framer-motion";
import { CSSProperties } from "react";
import { cn } from "~/utils/cn";

export interface GradientBackgroundProps {
  variant?: "default" | "radial" | "spotlight" | "mesh";
  interactive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface CustomCSSProperties extends CSSProperties {
  "--gradient-start"?: string;
  "--gradient-end"?: string;
}

const animationVariant = {
  initial: { scale: 1, opacity: 0.1 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.1, 0.15, 0.1],
  },
};

interface GradientConfig {
  style: string;
  vars: {
    start: string;
    end?: string;
  };
}

const gradientConfigs: Record<GradientBackgroundProps["variant"] & string, GradientConfig> = {
  default: {
    style: "bg-[radial-gradient(circle_at_center,var(--gradient-start)_0%,transparent_70%)]",
    vars: { start: "hsl(var(--primary))" }
  },
  radial: {
    style: "bg-[radial-gradient(circle_at_center,var(--gradient-start)_0%,var(--gradient-end)_25%,transparent_60%)]",
    vars: { start: "hsl(var(--primary))", end: "hsl(var(--accent))" }
  },
  spotlight: {
    style: "bg-[radial-gradient(circle_at_center,var(--gradient-start)_0%,transparent_80%)]",
    vars: { start: "hsl(var(--primary))" }
  },
  mesh: {
    style: "bg-[radial-gradient(circle_at_center,var(--gradient-start)_0%,var(--gradient-end)_50%,transparent_70%)]",
    vars: { start: "hsl(var(--primary))", end: "hsl(var(--accent))" }
  }
};

export function GradientBackground({
  variant = "default",
  interactive = false,
  className,
  children,
}: GradientBackgroundProps) {
  const config = gradientConfigs[variant];
  const style: CustomCSSProperties = {
    "--gradient-start": config.vars.start,
  };
  
  if (config.vars.end) {
    style["--gradient-end"] = config.vars.end;
  }

  return (
    <div className={cn("relative w-full h-full", className)}>
      <motion.div
        initial={animationVariant.initial}
        animate={interactive ? undefined : animationVariant.animate}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "absolute inset-0",
          config.style,
          "blur-[60px] dark:opacity-75"
        )}
        style={style}
      />
      {children}
    </div>
  );
}
