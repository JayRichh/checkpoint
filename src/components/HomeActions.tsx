"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Github, PlayCircle } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuthStore, getGitHubOAuthURL } from "../lib/auth";
import { setCookie } from 'cookies-next';

const buttonVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
  },
  animate: (delay: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      delay: delay * 0.1,
      ease: [0.16, 1, 0.3, 1]
    }
  }),
  hover: { 
    scale: 1.01,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  tap: { 
    scale: 0.99,
    transition: {
      duration: 0.1,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export function HomeActions() {
  const router = useRouter();
  const { enableDemoMode } = useAuthStore();

  const handleDemoView = async () => {
    setCookie('isDemoMode', 'true', { maxAge: 60 * 60 * 24 });
    enableDemoMode();
    setTimeout(() => {
      router.push("/github");
    }, 100);
  };

  const handleGitHubConnect = () => {
    setCookie('isDemoMode', 'false', { maxAge: 0 });
    window.location.href = getGitHubOAuthURL();
  };

  return (
    <div className="flex flex-col sm:flex-row items-start gap-3">
      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        custom={0}
        className="w-full sm:w-auto"
      >
        <Button 
          variant="primary" 
          size="lg" 
          onClick={handleGitHubConnect}
          className="w-full relative group bg-gradient-to-r from-primary/90 via-primary to-primary/90 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
        >
          <span className="flex items-center justify-center gap-2.5">
            <Github className="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-105" />
            <span className="font-medium tracking-tight">Connect GitHub</span>
          </span>
        </Button>
      </motion.div>

      <motion.div
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        custom={1}
        className="w-full sm:w-auto"
      >
        <Button 
          variant="secondary" 
          size="lg" 
          onClick={handleDemoView}
          className="w-full relative group bg-secondary/90 hover:bg-secondary hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300"
        >
          <span className="flex items-center justify-center gap-2.5">
            <PlayCircle className="w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-105" />
            <span className="font-medium tracking-tight">View Demo Profile</span>
          </span>
        </Button>
      </motion.div>
    </div>
  );
}
