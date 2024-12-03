import React, { useCallback, useRef } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchGitHubContributions } from '../../../lib/github';

interface FilterState {
  excludeForks: boolean;
  setExcludeForks: (value: boolean) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      excludeForks: true,
      setExcludeForks: (value) => set({ excludeForks: value }),
    }),
    {
      name: 'github-filters',
    }
  )
);

export function FilterControls() {
  const {
    excludeForks,
    setExcludeForks,
  } = useFilterStore();

  const debounceTimer = useRef<NodeJS.Timeout>();

  const handleChange = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      fetchGitHubContributions();
    }, 500);
  }, []);

  const handleCheckboxChange = useCallback((value: boolean) => {
    setExcludeForks(value);
    handleChange();
  }, [handleChange, setExcludeForks]);

  return (
    <div className="mb-6 space-y-4 rounded-xl border border-border/50 bg-background/30 backdrop-blur-sm p-4">
      <h3 className="text-lg font-semibold mb-4">Filter Controls</h3>
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={excludeForks}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span>Show only code I created (exclude forks)</span>
        </label>
      </div>
    </div>
  );
}
