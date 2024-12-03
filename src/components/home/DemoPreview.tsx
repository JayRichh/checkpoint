"use client";

import { motion } from "framer-motion";
import { PlayCircle, BarChart3, GitBranch, GitCommit } from "lucide-react";
import { Text } from "~/components/ui/Text";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { fadeInUp, stagger, scaleIn } from "~/utils/motion";
import { useState, useEffect } from "react";

export function DemoPreview() {
  const [activityCells, setActivityCells] = useState<boolean[]>([]);
  const [statWidths, setStatWidths] = useState<number[]>([]);

  useEffect(() => {
    setActivityCells(Array(35).fill(false).map(() => Math.random() > 0.7));
    setStatWidths(Array(3).fill(0).map(() => Math.random() * 40 + 60));
  }, []);

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={stagger}
      className="py-24 md:py-32 relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--brand)/0.15),transparent_70%)]" />

      <div className="relative w-full max-w-[1920px] mx-auto px-6 md:px-8">
        <motion.div 
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-20 md:mb-28"
        >
          <div className="flex items-center justify-center gap-8 mb-10">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -10 }}
              className="p-4 rounded-2xl bg-primary/5 backdrop-blur-sm"
            >
              <BarChart3 className="w-14 h-14 text-primary" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="p-4 rounded-2xl bg-accent/5 backdrop-blur-sm"
            >
              <GitBranch className="w-14 h-14 text-accent" />
            </motion.div>
          </div>

          <Text variant="h1" className="mb-8 tracking-tight font-semibold text-5xl md:text-6xl lg:text-7xl bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
            Experience Your GitHub Journey
          </Text>
          
          <Text variant="body-lg" className="text-foreground/70 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
            Get detailed insights into your coding activity, track progress, and visualize your development journey.
          </Text>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-20 md:mb-28">
          <motion.div variants={scaleIn}>
            <Card variant="elevated" className="group aspect-[4/3] p-8 md:p-10">
              <div className="relative h-full flex flex-col">
                <div className="flex items-center gap-4 mb-10">
                  <GitCommit className="w-6 h-6 text-primary/80" />
                  <div className="h-2.5 w-32 rounded-full bg-foreground/[0.08]" />
                </div>
                
                <div className="flex-1 grid grid-cols-7 gap-2 p-6">
                  {activityCells.map((isActive, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        transition: {
                          duration: 0.5,
                          delay: i * 0.02,
                          ease: [0.32, 0.72, 0, 1]
                        }
                      }}
                      className={`
                        aspect-square rounded-md transition-all duration-300
                        ${isActive 
                          ? "bg-primary/20 group-hover:bg-primary/30 group-hover:scale-110" 
                          : "bg-foreground/[0.04] group-hover:bg-foreground/[0.08]"
                        }
                      `}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card variant="elevated" className="group aspect-[4/3] p-8 md:p-10">
              <div className="relative h-full flex flex-col">
                <div className="flex items-center gap-4 mb-10">
                  <BarChart3 className="w-6 h-6 text-accent/80" />
                  <div className="h-2.5 w-32 rounded-full bg-foreground/[0.08]" />
                </div>
                
                <div className="flex-1 flex flex-col justify-center gap-8 p-6">
                  {statWidths.map((width, i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-2.5 w-24 rounded-full bg-foreground/[0.08]" />
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${width}%`,
                          transition: {
                            duration: 0.8,
                            delay: i * 0.15,
                            ease: [0.32, 0.72, 0, 1]
                          }
                        }}
                        className="h-4 rounded-full bg-accent/20 group-hover:bg-accent/30 group-hover:scale-y-110 transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          variants={fadeInUp}
          className="text-center"
        >
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={() => window.location.href = "/demo"}
            className="
              bg-accent hover:bg-accent/90 text-white
              shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30
              transition-all duration-300 scale-110
              px-8 py-6
            "
          >
            <span className="flex items-center gap-3 text-lg">
              <PlayCircle className="w-6 h-6" />
              Try Demo Version
            </span>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
