import { useEffect, useRef } from 'react';
import { useAuthStore } from '~/lib/auth';
import { useGitHubStore } from '~/lib/github';

export function useGitHubData() {
  const { token, username } = useAuthStore();
  const { 
    yearData, 
    isLoading, 
    error,
    lastFetched,
    loadingYears,
    fetchGitHubContributions,
    reset 
  } = useGitHubStore();

  // Use a ref to track auth state changes
  const prevAuthRef = useRef({ token, username });

  useEffect(() => {
    const prevAuth = prevAuthRef.current;
    
    // Only reset if auth state actually changed
    if ((!token && prevAuth.token) || (prevAuth.username && prevAuth.username !== username)) {
      reset();
      prevAuthRef.current = { token, username };
      return;
    }

    // Update ref without triggering reset
    prevAuthRef.current = { token, username };

    // Fetch data if authenticated and needed
    if (token && username) {
      const currentYear = new Date().getFullYear();
      const shouldFetch = !lastFetched?.[currentYear] || 
        (Date.now() - (lastFetched[currentYear] || 0)) > 5 * 60 * 1000; // 5 minutes
      
      if (shouldFetch && !isLoading) {
        fetchGitHubContributions().catch(console.error);
      }
    }
  }, [token, username, lastFetched, isLoading, fetchGitHubContributions, reset]);

  return {
    yearData,
    isLoading,
    error,
    loadingYears,
    refetch: fetchGitHubContributions
  };
}
