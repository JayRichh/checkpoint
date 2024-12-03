"use client";

import { HeroSection } from "~/components/home/HeroSection";
import { FeatureGrid } from "~/components/home/FeatureGrid";
import { ColorSpacer } from "~/components/home/ColorSpacer";
import { DemoPreview } from "~/components/home/DemoPreview";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Grid */}
      <FeatureGrid />

      {/* Flowing Color Spacer */}
      <ColorSpacer />

      {/* Demo Preview Section */}
      <DemoPreview />

      {/* Single Ambient Light Effect */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(85%_85%_at_50%_50%,hsl(var(--primary)/0.05),transparent_100%)]" />
      </div>
    </div>
  );
}
