"use client";

import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { InfoTooltip } from "./InfoTooltip";
import { COLORS } from "../constants";
import { formatNumber } from "../utils";
import { Language } from "../types";
import { Card } from "~/components/ui/Card";
import { Text } from "~/components/ui/Text";
import { fadeInUp, stagger, scaleIn } from "~/utils/motion";

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
    color: color || colors.muted,
  }));

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
        <Text variant="h2" className="text-primary">
          Language Distribution
        </Text>
      </motion.div>

      <motion.div variants={scaleIn}>
        <Card variant="elevated" className="p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-[500px] relative order-2 lg:order-1">
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
                arcLabelsTextColor={isDark ? "#ffffff" : "#000000"}
                motionConfig={{
                  mass: 1,
                  tension: 170,
                  friction: 26,
                }}
                transitionMode="pushIn"
                theme={{
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
              />
            </div>

            <div className="flex flex-col order-1 lg:order-2 gap-4">
              <div className="flex items-center gap-2">
                <Text variant="h3">
                  Code Composition Analysis
                </Text>
                <InfoTooltip 
                  content="Lines of code and file counts are estimated based on language-specific averages. Actual numbers may vary based on coding style and file organization."
                  size="sm"
                />
              </div>

              <div className="relative flex-1 min-h-0">
                <div className="absolute inset-0 overflow-y-auto pr-2 custom-scrollbar">
                  <motion.div 
                    variants={stagger}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {languages.map((lang) => (
                      <motion.div
                        key={lang.name}
                        variants={scaleIn}
                      >
                        <Card variant="outlined" className="p-4 hover:border-border/60 transition-all duration-300">
                          <div className="flex justify-between items-center mb-2">
                            <Text variant="body-sm" className="font-medium" style={{ color: lang.color }}>
                              {lang.name}
                            </Text>
                            <Text variant="body-sm" className="text-foreground/60 font-medium">
                              {lang.percentage}%
                            </Text>
                          </div>
                          <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${lang.percentage}%` }}
                              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: lang.color }}
                            />
                          </div>
                          <div className="mt-2 flex justify-between">
                            <Text variant="body-sm" className="text-foreground/50">
                              {formatNumber(lang.lineCount || 0)} lines
                            </Text>
                            <Text variant="body-sm" className="text-foreground/50">
                              {formatNumber(lang.fileCount || 0)} files
                            </Text>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>

              <div className="border-t border-border/40 pt-4">
                <div className="flex justify-between">
                  <Text variant="body-sm" className="text-foreground/60">
                    Total Lines: {formatNumber(totalLines)}
                  </Text>
                  <Text variant="body-sm" className="text-foreground/60">
                    Total Files: {formatNumber(totalFiles)}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
