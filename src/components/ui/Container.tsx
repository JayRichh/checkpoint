"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode, forwardRef } from "react";
import { cn } from "~/utils/cn";

interface ContainerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full" | "ultra";
  centered?: boolean;
  glass?: boolean;
  glassDark?: boolean;
  noPadding?: boolean;
  className?: string;
}

const containerSizes = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  ultra: "max-w-[1920px]",
  full: "w-full",
} as const;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = "lg",
      centered = true,
      glass = false,
      glassDark = false,
      noPadding = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      "relative w-full",
      containerSizes[size],
      centered && "mx-auto",
      !noPadding && "px-4 md:px-6",
      className
    );

    if (!glass && !glassDark) {
      return (
        <motion.div
          ref={ref}
          className={baseStyles}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={baseStyles}
        {...props}
      >
        <div className={cn(
          "rounded-xl md:rounded-2xl transition-all duration-200",
          "bg-background/80 dark:bg-background/60",
          "border border-border/40",
          "shadow-lg shadow-background/5",
          !noPadding && "p-4 md:p-6",
          glass && "backdrop-blur-md",
          glassDark && "dark:backdrop-blur-md"
        )}>
          {children}
        </div>
      </motion.div>
    );
  }
);

Container.displayName = "Container";
