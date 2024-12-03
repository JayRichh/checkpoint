"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, getGitHubOAuthURL } from "../lib/auth";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";
import { Badge } from "./ui/Badge";

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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <div className="flex gap-8">
            <Link
              href="/"
              className="flex items-center space-x-2 font-bold"
            >
              <span>Committed</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/github"
                className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                  pathname === "/github" ? "text-foreground" : "text-foreground/60"
                }`}
              >
                Analytics
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {mounted && (
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="w-9 px-0"
              >
                <span className="sr-only">Toggle theme</span>
                {theme === "dark" ? "🌙" : "☀️"}
              </Button>
            )}
            {username && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:inline-block">
                  {username}
                </span>
                {isDemoProfile && (
                  <Badge variant="secondary" className="hidden md:inline-flex">
                    Demo
                  </Badge>
                )}
              </div>
            )}
            {token ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
              >
                {isDemoProfile ? "Exit Demo" : "Logout"}
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleConnect}
              >
                Connect GitHub
              </Button>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
