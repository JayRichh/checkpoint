"use client";

import { motion, Variants } from "framer-motion";
import * as React from "react";
import { cn } from "~/utils/cn";

type BadgeVariant = "default" | "outline" | "solid" | "secondary";
type BadgeColor = "primary" | "success" | "warning" | "error" | "info";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  pulse?: boolean;
  className?: string;
}

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    }
  }
};

const variants = {
  default: "bg-background/95 text-foreground border border-border/60 dark:bg-background/90 dark:border-border/50",
  outline: "border-2 bg-transparent",
  solid: "border-transparent text-white dark:text-background",
  secondary: "bg-secondary/95 text-secondary-foreground border-none dark:bg-secondary/90",
} as const;

const sizes = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-2.5 py-1 gap-1.5",
  lg: "text-base px-3 py-1.5 gap-2",
} as const;

const colorStyles = {
  outline: {
    primary: "border-primary text-primary",
    success: "border-success text-success",
    warning: "border-warning text-warning",
    error: "border-error text-error",
    info: "border-info text-info",
  },
  solid: {
    primary: "bg-primary/95 dark:bg-primary/90",
    success: "bg-success/95 dark:bg-success/90",
    warning: "bg-warning/95 dark:bg-warning/90",
    error: "bg-error/95 dark:bg-error/90",
    info: "bg-info/95 dark:bg-info/90",
  },
  pulse: {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
    info: "bg-info",
  }
} as const;

export function Badge({
  children,
  variant = "default",
  color = "primary",
  size = "md",
  icon,
  removable = false,
  onRemove,
  pulse = false,
  className,
}: BadgeProps) {
  const baseStyles = cn(
    "inline-flex items-center justify-center",
    "font-medium rounded-full",
    "transition-all duration-200",
    sizes[size],
    variants[variant],
    {
      [colorStyles.outline[color]]: variant === "outline",
      [colorStyles.solid[color]]: variant === "solid",
      "hover:bg-background/80 dark:hover:bg-background/80": variant === "default",
      "hover:bg-secondary/80 dark:hover:bg-secondary/80": variant === "secondary",
    },
    className
  );

  return (
    <motion.span 
      variants={badgeVariants}
      initial="hidden"
      animate="visible"
      className={baseStyles}
    >
      {pulse && (
        <span className="relative flex h-2 w-2 mr-1.5">
          <span className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            colorStyles.pulse[color]
          )} />
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            colorStyles.pulse[color]
          )} />
        </span>
      )}

      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>

      {removable && (
        <button
          onClick={onRemove}
          className={cn(
            "flex-shrink-0 ml-1 -mr-1 p-0.5",
            "hover:bg-foreground/10 dark:hover:bg-foreground/5",
            "rounded-full transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1"
          )}
        >
          <svg
            className="w-3 h-3"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M1 1L11 11M1 11L11 1" />
          </svg>
        </button>
      )}
    </motion.span>
  );
}
