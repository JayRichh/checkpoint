"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Boxes, Fingerprint, Sparkles } from "lucide-react";

const icons = [
  { 
    Icon: Boxes,
    color: "primary",
    tooltip: "System Architecture",
    ariaLabel: "System Architecture Icon"
  },
  { 
    Icon: Fingerprint,
    color: "accent",
    tooltip: "Developer Identity",
    ariaLabel: "Developer Identity Icon"
  },
  { 
    Icon: Sparkles,
    color: "secondary",
    tooltip: "Achievements",
    ariaLabel: "Achievements Icon"
  }
] as const;

type IconColor = typeof icons[number]["color"];

const getIconStyles = (color: IconColor): string => ({
  primary: "text-primary/80",
  accent: "text-accent/80",
  secondary: "text-secondary/80"
}[color]);

const IconWrapper = memo(function IconWrapper({ 
  Icon, 
  color, 
  tooltip, 
  ariaLabel 
}: typeof icons[number]) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="flex justify-center"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="group relative rounded-2xl p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={ariaLabel}
        role="button"
        tabIndex={0}
      >
        <div className="relative z-10">
          <Icon 
            className={`
              w-10 h-10 
              ${getIconStyles(color)}
              transition-all duration-300
              group-hover:filter group-hover:drop-shadow-[0_0_6px_hsl(var(--${color}))]
            `}
            aria-hidden="true"
          />
        </div>

        <div 
          className={`
            absolute inset-0 z-0 rounded-2xl
            bg-gradient-to-br from-background/5 to-background/10
            backdrop-blur-[1px] border border-border/40
            transition-all duration-300
            group-hover:from-background/10 group-hover:to-background/20
            group-hover:border-border/60
          `}
          aria-hidden="true"
        />
        
        <div 
          className={`
            absolute inset-0 -z-10 rounded-2xl opacity-0
            bg-[radial-gradient(circle_at_center,hsl(var(--${color})/0.1),transparent_70%)]
            group-hover:opacity-100
            transition-opacity duration-300
          `}
          aria-hidden="true"
        />

        <div 
          role="tooltip"
          className="
            absolute -bottom-8 left-1/2 -translate-x-1/2
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            pointer-events-none z-20
          "
        >
          <span className="
            text-xs text-foreground/60
            whitespace-nowrap
            bg-background/80 backdrop-blur-sm
            px-2 py-1 rounded-md
            border border-border/40
          ">
            {tooltip}
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
});

export const ColorSpacer = memo(function ColorSpacer() {
  return (
    <section 
      className="relative h-64 w-full my-20"
      aria-label="Feature highlights"
    >
      <div 
        className="absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
      </div>

      <div className="relative h-full w-full max-w-[1920px] mx-auto px-4">
        <div className="h-full grid grid-cols-3 items-center gap-4 md:gap-8">
          {icons.map((iconProps) => (
            <IconWrapper key={iconProps.color} {...iconProps} />
          ))}
        </div>
      </div>
    </section>
  );
});
