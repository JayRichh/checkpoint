"use client";

import { type VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "~/utils/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "hover:-translate-y-0.5 active:translate-y-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-background/50 text-foreground",
          "border border-border/50",
          "backdrop-blur-sm backdrop-saturate-150",
          "shadow-sm hover:shadow-md",
          "hover:bg-background/80 hover:border-border",
          "active:bg-background/90 active:shadow-sm",
        ],
        primary: [
          "bg-primary text-primary-foreground font-semibold",
          "border border-primary/20",
          "shadow-lg shadow-primary/20",
          "hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30",
          "active:bg-primary/95 active:shadow-md",
        ],
        secondary: [
          "bg-secondary text-secondary-foreground",
          "border border-secondary/30",
          "shadow-lg shadow-secondary/20",
          "hover:bg-secondary/90 hover:border-secondary/40 hover:shadow-xl hover:shadow-secondary/30",
          "active:bg-secondary/95 active:shadow-md",
        ],
        outline: [
          "border-2 text-foreground",
          "border-primary/80",
          "shadow-sm hover:shadow-md shadow-primary/10",
          "hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-primary/20",
          "active:bg-primary/95 active:shadow-sm",
        ],
        ghost: [
          "text-foreground",
          "hover:bg-foreground/10",
          "active:bg-foreground/15",
          "glass glass-hover",
        ],
        link: [
          "text-primary underline-offset-4",
          "hover:underline hover:bg-transparent hover:text-primary/90",
          "active:text-primary/80",
          "h-auto p-0 hover:translate-y-0",
        ],
        destructive: [
          "bg-error/10 text-error font-semibold",
          "border border-error/30",
          "shadow-sm shadow-error/10",
          "hover:bg-error hover:text-error-foreground hover:shadow-md hover:shadow-error/20",
          "hover:border-error active:bg-error/95 active:shadow-sm",
        ],
      },
      size: {
        sm: "h-8 text-xs rounded-lg px-3",
        md: "h-10 text-sm rounded-lg px-4",
        lg: "h-12 text-base rounded-lg px-6",
        icon: "h-10 w-10 rounded-lg p-0",
      },
      hasLeftIcon: {
        true: "pl-3",
        false: "",
      },
      hasRightIcon: {
        true: "pr-3",
        false: "",
      },
    },
    compoundVariants: [
      {
        size: "sm",
        hasLeftIcon: true,
        className: "pl-2.5",
      },
      {
        size: "sm",
        hasRightIcon: true,
        className: "pr-2.5",
      },
      {
        size: "lg",
        hasLeftIcon: true,
        className: "pl-5",
      },
      {
        size: "lg",
        hasRightIcon: true,
        className: "pr-5",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      hasLeftIcon: false,
      hasRightIcon: false,
    },
  }
);

const iconSizes: Record<NonNullable<VariantProps<typeof buttonVariants>["size"]>, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  icon: "h-4 w-4",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = "md",
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const iconSize = iconSizes[size || "md"];

    return (
      <button
        className={cn(
          buttonVariants({
            variant,
            size,
            hasLeftIcon: !!leftIcon,
            hasRightIcon: !!rightIcon,
            className,
          })
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <Loader2 className={cn("animate-spin", iconSize)} />
        ) : (
          <>
            {leftIcon && (
              <span className={cn("inline-flex shrink-0 mr-2", iconSize)}>{leftIcon}</span>
            )}
            {children}
            {rightIcon && (
              <span className={cn("inline-flex shrink-0 ml-2", iconSize)}>{rightIcon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
