"use client";

import { ResponsiveCalendarCanvas } from "@nivo/calendar";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { COLORS } from "../constants";
import { fadeIn } from "~/utils/motion";

interface Contribution {
  day: string;
  value: number;
}

interface YearData {
  year: number;
  contributions: Contribution[];
}

interface CalendarProps {
  direction: "vertical" | "horizontal";
  selectedYear: YearData;
}

export function GitHubCalendar({ direction, selectedYear }: CalendarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;
  const contributionData = selectedYear.contributions.filter((c) => c.value > 0);
  const fromDate = `${selectedYear.year}-01-01`;
  const toDate = `${selectedYear.year}-12-31`;

  const margins = {
    vertical: { top: 30, right: 20, bottom: 60, left: 20 },
    horizontal: { top: 30, right: 40, bottom: 60, left: 40 }
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="w-full h-full"
    >
      <ResponsiveCalendarCanvas
        data={contributionData}
        from={fromDate}
        to={toDate}
        emptyColor={colors.calendar[0]}
        colors={colors.calendar.slice(1)}
        margin={direction === "vertical" ? margins.vertical : margins.horizontal}
        monthBorderColor={colors.border}
        dayBorderWidth={1}
        dayBorderColor={isDark ? "#1b1f23" : "#ffffff"}
        direction={direction}
        legends={[
          {
            anchor: direction === "vertical" ? "bottom" : "bottom-right",
            direction: "row",
            translateY: 50,
            itemCount: 4,
            itemWidth: 42,
            itemHeight: 36,
            itemsSpacing: 14,
            itemDirection: "right-to-left",
            itemTextColor: colors.text,
            symbolSize: 16,
          },
        ]}
        theme={{
          text: {
            fontSize: 12,
            fill: colors.text,
            fontWeight: 500,
          },
          tooltip: {
            container: {
              background: colors.background,
              color: colors.text,
              fontSize: "12px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              padding: "8px 12px",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            },
          },
        }}
        tooltip={({ day, value }) => (
          <div>
            <strong>{value} contributions</strong> on {new Date(day).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}
      />
    </motion.div>
  );
}
