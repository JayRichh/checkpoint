import { useEffect } from 'react';
import { useAuthStore } from '~/lib/auth';
import { useGitHubStore } from '~/lib/github';

export function useGitHubData() {
  const { token, username } = useAuthStore();
  const { 
    yearData, 
    languageData, 
    isLoading, 
    error,
    lastFetched,
    fetchGitHubContributions 
  } = useGitHubStore();

  useEffect(() => {
    // Clear data when auth state changes
    if (!token || !username) {
      useGitHubStore.getState().reset();
      return;
    }

    // Fetch data if not already loaded or stale
    const shouldFetch = !lastFetched || Date.now() - lastFetched > 5 * 60 * 1000; // 5 minutes
    if (shouldFetch && !isLoading) {
      fetchGitHubContributions().catch(console.error);
    }
  }, [token, username, lastFetched, isLoading, fetchGitHubContributions]);

  return {
    yearData,
    languageData,
    isLoading,
    error,
    refetch: fetchGitHubContributions
  };
}
