"use client";

import React from 'react';
import { create } from 'zustand';
import { motion } from 'framer-motion';
import { Text } from '~/components/ui/Text';
import { cn } from '~/utils/cn';
import { fadeInUp } from '~/utils/motion';

interface FilterState {
  excludeForks: boolean;
  setExcludeForks: (value: boolean) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  excludeForks: true,
  setExcludeForks: (excludeForks) => set({ excludeForks }),
}));

interface FilterControlsProps {
  onFilterChange?: () => void;
}

export function FilterControls({ onFilterChange }: FilterControlsProps) {
  const { excludeForks, setExcludeForks } = useFilterStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExcludeForks(e.target.checked);
    onFilterChange?.();
  };

  return (
    <motion.div 
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="mb-8 flex items-center justify-center"
    >
      <label className="group flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-background/50 transition-colors cursor-pointer">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            checked={excludeForks}
            onChange={handleFilterChange}
            className={cn(
              "peer h-4 w-4 appearance-none rounded",
              "border border-border/60",
              "bg-background/50",
              "checked:bg-primary checked:border-primary",
              "focus:outline-none focus:ring-2 focus:ring-primary/30",
              "transition-all duration-200"
            )}
            aria-label="Exclude forked repositories"
          />
          <motion.svg
            className="absolute left-0 top-0 h-4 w-4 stroke-white stroke-[3]"
            viewBox="0 0 16 16"
            initial={false}
            animate={excludeForks ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
          >
            <motion.path
              fill="none"
              d="M3.5 8L6.5 11L12.5 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: excludeForks ? 1 : 0 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            />
          </motion.svg>
        </div>
        <Text 
          variant="body-sm" 
          className="text-foreground/70 group-hover:text-foreground transition-colors"
        >
          Exclude forks
        </Text>
      </label>
    </motion.div>
  );
}
