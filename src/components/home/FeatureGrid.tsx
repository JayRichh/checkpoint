"use client";

import { motion } from "framer-motion";
import { Text } from "~/components/ui/Text";
import { Card } from "~/components/ui/Card";
import { BarChart3, GitBranch, Zap, Star, GitCommit, Users } from "lucide-react";
import { fadeInUp, stagger, scaleIn } from "~/utils/motion";

const features = [
  {
    title: "Contribution Analytics",
    description: "Interactive visualization of your GitHub activity with detailed contribution calendars.",
    icon: BarChart3,
    color: "primary"
  },
  {
    title: "Language Insights",
    description: "Comprehensive breakdown of programming languages across repositories.",
    icon: GitBranch,
    color: "accent"
  },
  {
    title: "Real-time Sync",
    description: "Always up-to-date with your latest GitHub activity and contributions.",
    icon: Zap,
    color: "secondary"
  },
  {
    title: "Repository Metrics",
    description: "Track stars, forks, and engagement metrics across your repositories.",
    icon: Star,
    color: "primary"
  },
  {
    title: "Contribution Trends",
    description: "Analyze your coding patterns and contribution frequency over time.",
    icon: GitCommit,
    color: "accent"
  },
  {
    title: "Team Collaboration",
    description: "Monitor team activity and project contributions in real-time.",
    icon: Users,
    color: "secondary"
  }
] as const;

type FeatureColor = typeof features[number]["color"];

const getFeatureStyles = (color: FeatureColor) => ({
  primary: "text-primary/80 group-hover:text-primary/90",
  accent: "text-accent/80 group-hover:text-accent/90",
  secondary: "text-secondary/80 group-hover:text-secondary/90"
}[color]);

export function FeatureGrid() {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={stagger}
      className="py-16 md:py-24 relative"
    >
      {/* Single Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05),transparent_70%)]" />

      <div className="relative w-full max-w-[1920px] mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <Text variant="h2" className="mb-6 tracking-tight font-semibold text-4xl md:text-5xl lg:text-6xl bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
            Powerful Features
          </Text>
          <Text variant="body-lg" className="text-foreground/60 text-lg md:text-xl">
            Everything you need to track and visualize your GitHub development journey.
          </Text>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={scaleIn}
                className="group"
              >
                <Card variant="outlined" className="p-6 md:p-8 hover:border-border/60 transition-all duration-300">
                  <div className="mb-6">
                    <Icon className={`w-10 h-10 ${getFeatureStyles(feature.color)} transition-colors duration-300`} />
                  </div>
                  <Text variant="h3" className="text-foreground mb-4 tracking-tight font-medium text-xl">
                    {feature.title}
                  </Text>
                  <Text variant="body" className="text-foreground/60">
                    {feature.description}
                  </Text>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
