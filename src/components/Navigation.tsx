"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useAuthStore, getGitHubOAuthURL } from "../lib/auth";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const linkVariants = {
  initial: { opacity: 0.7 },
  hover: { 
    opacity: 1,
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { token, username, isDemoProfile, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!theme) setTheme("dark");
  }, [theme, setTheme]);

  const handleLogout = () => {
    logout();
    if (pathname === "/github") {
      router.push("/");
    } else {
      window.location.reload();
    }
  };

  const handleConnect = () => {
    window.location.href = getGitHubOAuthURL();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="w-full sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 dark:border-border/50 bg-background dark:bg-background-secondary"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <motion.span 
                className="text-lg font-bold tracking-tight gradient-text"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Checkpoint
              </motion.span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <motion.div
                variants={linkVariants}
                initial="initial"
                whileHover="hover"
              >
                <Link
                  href="/github"
                  className={`nav-link ${pathname === "/github" ? "active" : ""}`}
                >
                  Analytics
                </Link>
              </motion.div>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {mounted && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="w-9 h-9 p-0 rounded-full"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={theme}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="sr-only">Toggle theme</span>
                      {theme === "dark" ? (
                        <Moon className="h-4 w-4" />
                      ) : (
                        <Sun className="h-4 w-4" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </motion.div>
            )}
            {username && (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm text-foreground/80 hidden md:inline-block">
                  {username}
                </span>
                {isDemoProfile && (
                  <Badge variant="secondary" size="sm" className="hidden md:inline-flex">
                    Demo
                  </Badge>
                )}
              </motion.div>
            )}
            {token ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="font-medium"
                >
                  {isDemoProfile ? "Exit Demo" : "Logout"}
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="primary"
                  onClick={handleConnect}
                  className="font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                >
                  Connect GitHub
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
