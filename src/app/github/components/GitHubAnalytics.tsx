"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { fetchGitHubContributions, useGitHubStore } from "../../../lib/github";
import { useAuthStore, getGitHubOAuthURL } from "../../../lib/auth";
import { ProgressLoader } from "../../../components/ui/progress-loader";
import { Button } from "../../../components/ui/Button";
import { GitHubCalendar } from "./GitHubCalendar";
import { LanguageDistribution } from "./LanguageDistribution";
import { Header } from "./Header";
import { FilterControls } from "./FilterControls";

export function GitHubAnalytics() {
  const searchParams = useSearchParams();
  const {
    yearData,
    languageData,
    isLoading,
    error,
    lastFetched
  } = useGitHubStore();
  
  const { 
    setToken, 
    setUsername, 
    setIsOAuth, 
    token, 
    username, 
    isOAuth, 
    isDemoProfile,
    logout 
  } = useAuthStore();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const usernameParam = searchParams.get("username");
    const isOAuthParam = searchParams.get("oauth") === "true";

    if (tokenParam && usernameParam) {
      setToken(tokenParam);
      setUsername(usernameParam);
      setIsOAuth(isOAuthParam);
      window.history.replaceState({}, "", "/github");
    }
  }, [searchParams, setToken, setUsername, setIsOAuth]);

  useEffect(() => {
    const shouldFetch = token && (!lastFetched || !yearData.length);
    if (shouldFetch) {
      fetchGitHubContributions().catch(console.error);
    }
  }, [token, lastFetched, yearData.length]);

  const handleLogin = () => {
    window.location.href = getGitHubOAuthURL();
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-112px)] items-center justify-center">
        <ProgressLoader isDataReady={yearData.length > 0} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-destructive">
            Error Loading GitHub Data
          </h1>
          <p className="text-muted-foreground">{error}</p>
          {!token && (
            <Button variant="primary" size="lg" className="mt-4" onClick={handleLogin}>
              Connect GitHub
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!yearData.length) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="rounded-xl border border-border/50 bg-background/30 backdrop-blur-sm p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-primary">
            {isDemoProfile ? "Loading Demo Profile..." : "No GitHub Data Available"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isDemoProfile 
              ? "Please wait while we load the demo data."
              : "Connect your GitHub account to view your contribution analytics."}
          </p>
          {!isDemoProfile && (
            <Button variant="primary" size="lg" onClick={handleLogin}>
              Connect GitHub
            </Button>
          )}
        </div>
      </div>
    );
  }

  const currentYear = yearData[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-16"
    >
      <Header
        username={username || undefined}
        isOAuth={isOAuth}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <FilterControls />

      <div className="mb-6 text-xl font-semibold text-center">
        {currentYear.totalContributions.toLocaleString()} contributions
        in {currentYear.year}
        {isDemoProfile && (
          <div className="text-sm text-muted-foreground mt-1">
            Viewing demo profile data. <button onClick={handleLogin} className="text-primary hover:underline">Connect your GitHub</button>
          </div>
        )}
      </div>

      <motion.div
        key={currentYear.year}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border/50 bg-background/30 backdrop-blur-sm p-4 md:p-8"
      >
        {/* Mobile View - Vertical Calendar */}
        <div className="h-[600px] md:hidden">
          <GitHubCalendar direction="vertical" selectedYear={currentYear} />
        </div>

        {/* Desktop View - Horizontal Calendar */}
        <div className="hidden md:block h-[300px]">
          <GitHubCalendar direction="horizontal" selectedYear={currentYear} />
        </div>
      </motion.div>

      {languageData && (
        <LanguageDistribution
          languages={languageData.languages}
          totalLines={languageData.totalLines}
          totalFiles={languageData.totalFiles}
        />
      )}
    </motion.div>
  );
}
