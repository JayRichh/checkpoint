"use client";

import { HTMLMotionProps, Variants, motion } from "framer-motion";
import { ReactNode, forwardRef } from "react";
import { cn } from "~/utils/cn";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: "elevated" | "outlined" | "filled";
  interactive?: boolean;
  fullHeight?: boolean;
  noPadding?: boolean;
  children?: ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "elevated",
      interactive = false,
      fullHeight = false,
      noPadding = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      "rounded-xl md:rounded-2xl flex flex-col transition-all duration-200",
      {
        "h-full": fullHeight,
        "p-4 md:p-6": !noPadding,
        "bg-background/80 dark:bg-background/60 border border-border/40 shadow-lg hover:shadow-xl": variant === "elevated",
        "border border-border/40 hover:border-border/60": variant === "outlined",
        "bg-background-secondary/80 dark:bg-background-secondary/60": variant === "filled",
        "cursor-pointer hover:scale-[1.01]": interactive,
      },
      className
    );

    return (
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={baseStyles}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className }, ref) => (
    <div ref={ref} className={cn("flex justify-between items-start gap-4 mb-4", className)}>
      <div className="flex-1 min-w-0">
        <div className="text-xl font-semibold text-foreground leading-tight truncate">
          {title}
        </div>
        {subtitle && <div className="mt-2 text-foreground/60">{subtitle}</div>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

interface CardContentProps {
  children?: ReactNode;
  className?: string;
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn("text-foreground/70", className)}>
      {children}
    </div>
  )
);

CardContent.displayName = "CardContent";

interface CardFooterProps {
  children?: ReactNode;
  className?: string;
  noBorder?: boolean;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, noBorder = false, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mt-6",
        { "pt-4 border-t border-border/40": !noBorder },
        className
      )}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
