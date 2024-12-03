"use client";

import { motion } from "framer-motion";
import { Badge } from "../ui/Badge";
import { Text } from "../ui/Text";
import { HomeActions } from "../HomeActions";
import { fadeInUp, stagger, scaleIn } from "~/utils/motion";
import Image from "next/image";

const techStack = [
  "Next.js 15",
  "GitHub OAuth",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion"
] as const;

export function HeroSection() {
  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center py-16 md:py-24"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Logo Image - Left Side */}
          <motion.div
            variants={scaleIn}
            className="relative w-full max-w-[440px] mx-auto lg:ml-auto order-1 lg:order-none"
          >
            <div className="relative aspect-square">
              <div className="absolute inset-0" />
              <Image
                src="/committed.png"
                alt="Committed Logo"
                fill
                sizes="(max-width: 440px) 100vw, 440px"
                className="object-contain dark:invert [image-rendering:crisp-edges] dark:filter dark:hue-rotate-[180deg]  dark:brightness-[0.8] dark:contrast-[1.2] dark:sepia-[0.1]"
                priority
              />
            </div>
          </motion.div>

          {/* Content - Right Side */}
          <motion.div 
            className="text-left space-y-8 max-w-xl lg:pl-4 mx-auto lg:mx-0 order-2 lg:order-none"
            variants={fadeInUp}
          >
            <div className="space-y-6">
              <Text 
                variant="h1" 
                className="tracking-tight font-semibold leading-[1.1] text-4xl md:text-5xl lg:text-6xl bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent"
              >
                View Your
                <br />
                <span className="text-foreground">GitHub Journey</span>
              </Text>
              <motion.div variants={fadeInUp}>
                <Text variant="body-lg" className="text-foreground/60 text-lg md:text-xl leading-relaxed">
                  Visualize your GitHub activity, analyze code contributions, and track your development journey.
                  Login with GitHub to see your personalized dashboard.
                </Text>
              </motion.div>
            </div>
            
            <motion.div 
              variants={fadeInUp}
              className="pt-2 md:pt-4"
            >
              <HomeActions />
            </motion.div>

            {/* Tech Stack Pills */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap gap-2 md:gap-3 pt-2 md:pt-4"
            >
              {techStack.map((tech) => (
                <motion.div
                  key={tech}
                  variants={scaleIn}
                >
                  <Badge 
                    variant="default"
                    size="md"
                  >
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
