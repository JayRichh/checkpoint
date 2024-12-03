"use client";

import { ProgressLoader } from "../../../components/ui/progress-loader";

interface YearNavigationProps {
  selectedYear: number;
  currentYearIndex: number;
  availableYears: number[];
  loadingYears: Set<number>;
  onPreviousYear: () => Promise<void>;
  onNextYear: () => void;
}

export function YearNavigation({
  selectedYear,
  currentYearIndex,
  availableYears,
  loadingYears,
  onPreviousYear,
  onNextYear,
}: YearNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <button
        onClick={onPreviousYear}
        disabled={
          currentYearIndex === availableYears.length - 1 ||
          loadingYears.has(availableYears[currentYearIndex + 1])
        }
        className={`flex min-w-[120px] items-center justify-center rounded-md px-4 py-2 transition-colors ${
          currentYearIndex === availableYears.length - 1
            ? "cursor-not-allowed opacity-50"
            : "bg-muted hover:bg-muted/80"
        }`}
        aria-label="Previous year"
      >
        {loadingYears.has(availableYears[currentYearIndex + 1]) ? (
          <ProgressLoader compact />
        ) : (
          "Previous Year"
        )}
      </button>
      <span className="text-lg font-semibold">{selectedYear}</span>
      <button
        onClick={onNextYear}
        disabled={currentYearIndex === 0}
        className={`flex min-w-[120px] items-center justify-center rounded-md px-4 py-2 transition-colors ${
          currentYearIndex === 0
            ? "cursor-not-allowed opacity-50"
            : "bg-muted hover:bg-muted/80"
        }`}
        aria-label="Next year"
      >
        Next Year
      </button>
    </div>
  );
}
