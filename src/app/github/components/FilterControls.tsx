import React from 'react';
import { create } from 'zustand';

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
    <div className="mb-6 flex items-center justify-center gap-4">
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={excludeForks}
          onChange={handleFilterChange}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        Exclude forks
      </label>
    </div>
  );
}
