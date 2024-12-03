"use client";

import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "next-themes";
import { InfoTooltip } from "./InfoTooltip";
import { COLORS } from "../constants";
import { formatNumber } from "../utils";
import { Language } from "../types";

interface LanguageDistributionProps {
  languages: Language[];
  totalLines: number;
  totalFiles: number;
}

export function LanguageDistribution({ languages, totalLines, totalFiles }: LanguageDistributionProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  const pieLanguages = languages.map(({ name, percentage, color }) => ({
    id: name,
    label: name,
    value: percentage,
    color: color || "#666",
  }));

  return (
    <div className="mt-16">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-primary">
          Language Distribution
        </h2>
      </div>
      <div className="rounded-xl border border-border/50 bg-background/30 backdrop-blur-sm p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[600px] relative order-2 lg:order-1">
            <ResponsivePie
              data={pieLanguages}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.6}
              padAngle={0.5}
              cornerRadius={4}
              activeOuterRadiusOffset={8}
              colors={{ datum: "data.color" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              enableArcLinkLabels={true}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor={colors.text}
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor="#ffffff"
              motionConfig="gentle"
              transitionMode="pushIn"
              theme={{
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
          </div>
          <div className="flex flex-col order-1 lg:order-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">
                Code Composition Analysis
              </h3>
              <InfoTooltip 
                content="Lines of code and file counts are estimated based on language-specific averages. Actual numbers may vary based on coding style and file organization."
                size="sm"
              />
            </div>
            <div className="relative flex-1 min-h-0">
              <div className="absolute inset-0 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                  {languages.map((lang) => (
                    <div
                      key={lang.name}
                      className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:border-border transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className="font-medium"
                          style={{ color: lang.color }}
                        >
                          {lang.name}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">
                          {lang.percentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${lang.percentage}%`,
                            backgroundColor: lang.color,
                          }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                        <span>{formatNumber(lang.lineCount || 0)} lines</span>
                        <span>{formatNumber(lang.fileCount || 0)} files</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 text-sm text-muted-foreground border-t border-border/50 pt-4">
              <div className="flex justify-between">
                <span>Total Lines: {formatNumber(totalLines)}</span>
                <span>Total Files: {formatNumber(totalFiles)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
