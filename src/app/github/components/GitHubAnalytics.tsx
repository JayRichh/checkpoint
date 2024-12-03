"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore, getGitHubOAuthURL } from "~/lib/auth";
import { useGitHubData } from "~/hooks/useGitHubData";
import { ProgressLoader } from "~/components/ui/progress-loader";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Text } from "~/components/ui/Text";
import { GitHubCalendar } from "./GitHubCalendar";
import { LanguageDistribution } from "./LanguageDistribution";
import { Header } from "./Header";
import { FilterControls } from "./FilterControls";
import { YearNavigation } from "./YearNavigation";
import { fadeInUp, stagger, scaleIn } from "~/utils/motion";
import { YearContributions } from "~/lib/github";
import { setCookie } from 'cookies-next';
import { Container } from "~/components/ui/Container";

export function GitHubAnalytics() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { yearData, isLoading, error, refetch, loadingYears } = useGitHubData();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const initialLoadRef = useRef(true);
  
  const { 
    setToken, 
    setUsername, 
    setIsOAuth, 
    token, 
    username, 
    isOAuth, 
    isDemoProfile,
    logout,
    enableDemoMode 
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
    if (!token || !username) return;

    if (initialLoadRef.current || !yearData.some((d: YearContributions) => d.year === selectedYear)) {
      refetch(selectedYear).catch(console.error);
      initialLoadRef.current = false;
    }
  }, [token, username, selectedYear, yearData, refetch]);

  const handleLogin = () => {
    setCookie('isDemoMode', 'false', { maxAge: 0 });
    window.location.href = getGitHubOAuthURL();
  };

  const handleViewDemo = () => {
    setCookie('isDemoMode', 'true', { maxAge: 60 * 60 * 24 });
    enableDemoMode();
    setTimeout(() => {
      router.push("/github");
    }, 100);
  };

  const handleLogout = () => {
    logout();
    initialLoadRef.current = true;
    window.location.reload();
  };

  const handlePreviousYear = async () => {
    const prevYear = selectedYear - 1;
    setSelectedYear(prevYear);
    if (!yearData.some((d: YearContributions) => d.year === prevYear)) {
      await refetch(prevYear);
    }
  };

  const handleNextYear = () => {
    const nextYear = selectedYear + 1;
    if (nextYear <= new Date().getFullYear()) {
      setSelectedYear(nextYear);
    }
  };

  if (isLoading && yearData.length === 0) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <ProgressLoader isDataReady={yearData.length > 0} />
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="outlined" className="p-8 text-center max-w-2xl mx-auto">
        <Text variant="h3" className="mb-4 text-destructive">
          Unable to Load GitHub Data
        </Text>
        <Text variant="body" className="text-foreground/60 mb-6">
          {error}
        </Text>
        {!token ? (
          <Button variant="primary" size="lg" onClick={handleLogin}>
            Connect GitHub
          </Button>
        ) : (
          <Button variant="primary" size="lg" onClick={() => refetch()}>
            Retry
          </Button>
        )}
      </Card>
    );
  }

  if (!yearData.length) {
    return (
      <Card variant="outlined" className="p-8 text-center max-w-2xl mx-auto">
        <Text variant="h3" className="mb-4">
          {isDemoProfile ? "Loading Demo Profile..." : "No GitHub Data Available"}
        </Text>
        <Text variant="body" className="text-foreground/60 mb-6">
          {isDemoProfile 
            ? "Please wait while we load the demo data."
            : "Connect your GitHub account to view your contribution analytics."}
        </Text>
        <Container className="flex gap-5">
          <Button variant="primary" size="lg" onClick={handleViewDemo}>
            View Demo Content
          </Button>
          <Button variant="primary" size="lg" onClick={handleLogin}>
            Connect GitHub
          </Button>
        </Container>
      </Card>
    );
  }

  const currentYearData = yearData.find((d: YearContributions) => d.year === selectedYear);
  const isLoadingYear = loadingYears.has(selectedYear);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <Header
          username={username || undefined}
          isOAuth={isOAuth}
          isDemoProfile={isDemoProfile}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <FilterControls onFilterChange={refetch} />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <YearNavigation
          selectedYear={selectedYear}
          loadingYears={loadingYears}
          onPreviousYear={handlePreviousYear}
          onNextYear={handleNextYear}
        />
      </motion.div>

      {isLoadingYear ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <ProgressLoader />
        </div>
      ) : currentYearData ? (
        <>
          <motion.div variants={fadeInUp} className="text-center">
            <Text variant="h3">
              {currentYearData.totalContributions.toLocaleString()} contributions
              in {currentYearData.year}
            </Text>
          </motion.div>

          <motion.div variants={scaleIn}>
            <Card variant="elevated" className="p-4 md:p-8">
              <div className="h-[600px] md:hidden">
                <GitHubCalendar direction="vertical" selectedYear={currentYearData} />
              </div>

              <div className="hidden md:block h-[300px]">
                <GitHubCalendar direction="horizontal" selectedYear={currentYearData} />
              </div>
            </Card>
          </motion.div>

          {currentYearData.languageData && (
            <motion.div variants={scaleIn}>
              <LanguageDistribution
                languages={currentYearData.languageData.languages}
                totalLines={currentYearData.languageData.totalLines}
                totalFiles={currentYearData.languageData.totalFiles}
              />
            </motion.div>
          )}
        </>
      ) : (
        <motion.div variants={fadeInUp} className="text-center">
          <Text variant="body">No contribution data available for {selectedYear}</Text>
        </motion.div>
      )}
    </motion.div>
  );
}
