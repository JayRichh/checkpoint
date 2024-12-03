"use client";

import { motion } from "framer-motion";
import { Button } from "~/components/ui/Button";
import { Text } from "~/components/ui/Text";
import { Badge } from "~/components/ui/Badge";
import { InfoTooltip } from "./InfoTooltip";
import { fadeInUp, stagger } from "~/utils/motion";

interface HeaderProps {
  username?: string;
  isOAuth: boolean;
  isDemoProfile?: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ username, isOAuth, isDemoProfile, onLogin, onLogout }: HeaderProps) {
  return (
    <motion.div 
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="mb-12"
    >
      <motion.div 
        variants={fadeInUp}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Text variant="h1" className="text-primary font-bold">
            GitHub Activity
          </Text>
          <InfoTooltip 
            content="Data sourced from GitHub's GraphQL API. Shows contributions across all repositories, including commits, issues, pull requests, and code reviews."
            size="lg"
          />
          {isDemoProfile && (
            <Badge variant="default" size="lg" className="font-medium animate-pulse">
              Demo Mode
            </Badge>
          )}
        </div>
        <motion.div 
          variants={fadeInUp}
          className="flex items-center gap-4"
        >
          {username && !isDemoProfile && (
            <Badge variant="secondary" size="lg" className="font-medium">
              {username}
            </Badge>
          )}
          {isDemoProfile ? (
            <Button
              variant="primary"
              onClick={onLogin}
              className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            >
              Exit Demo
            </Button>
          ) : username ? (
            <Button
              variant="outline"
              onClick={onLogout}
              className="hover:border-border/60"
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={onLogin}
              className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            >
              Connect GitHub
            </Button>
          )}
        </motion.div>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Text 
          variant="body-lg" 
          className="text-foreground/60 mt-6"
        >
          {isDemoProfile ? (
            "Viewing demo data. Connect your GitHub account to see your own activity."
          ) : (
            `A visualization of ${isOAuth ? "your" : "repository"} activity, showing contribution
            patterns and language distribution across all repositories.`
          )}
        </Text>
      </motion.div>
    </motion.div>
  );
}
