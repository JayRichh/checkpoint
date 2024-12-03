"use client";

import { ResponsiveCalendarCanvas } from "@nivo/calendar";
import { useTheme } from "next-themes";
import { COLORS } from "../constants";

interface CalendarProps {
  direction: "vertical" | "horizontal";
  selectedYear: {
    year: number;
    contributions: Array<{ day: string; value: number }>;
  };
}

export function GitHubCalendar({ direction, selectedYear }: CalendarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;
  const contributionData = selectedYear.contributions.filter((c) => c.value > 0);
  const fromDate = `${selectedYear.year}-01-01`;
  const toDate = `${selectedYear.year}-12-31`;

  return (
    <ResponsiveCalendarCanvas
      data={contributionData}
      from={fromDate}
      to={toDate}
      emptyColor={colors.calendar[0]}
      colors={colors.calendar.slice(1)}
      margin={
        direction === "vertical"
          ? { top: 40, right: 20, bottom: 40, left: 20 }
          : { top: 40, right: 40, bottom: 40, left: 40 }
      }
      monthBorderColor={colors.border}
      dayBorderWidth={1}
      dayBorderColor={isDark ? "#1b1f23" : "#fff"}
      direction={direction}
      legends={[
        {
          anchor: direction === "vertical" ? "bottom" : "bottom-right",
          direction: "row",
          translateY: 36,
          itemCount: 4,
          itemWidth: 42,
          itemHeight: 36,
          itemsSpacing: 14,
          itemDirection: "right-to-left",
          itemTextColor: colors.text,
        },
      ]}
      theme={{
        text: {
          fontSize: 12,
          fill: colors.text,
        },
        tooltip: {
          container: {
            background: colors.background,
            color: colors.text,
            fontSize: "12px",
            borderRadius: "6px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          },
        },
      }}
    />
  );
}
