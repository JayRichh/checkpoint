import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage, StorageValue } from "zustand/middleware";
import { getAuthToken, getCurrentUsername, useAuthStore } from "./auth";
import { useFilterStore } from "../app/github/components/FilterControls";

const GITHUB_API = "https://api.github.com/graphql";
const MAX_REPOS_PER_PAGE = 50;
const MAX_LANGUAGES_PER_REPO = 10;
const EXCLUDED_LANGUAGES = new Set(["Roff"]);
const CACHE_DURATION = 2 * 60 * 1000; // Reduced to 2 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface YearContributions {
  year: number;
  contributions: Array<{ day: string; value: number }>;
  totalContributions: number;
}

export interface LanguageStats {
  languages: Array<{
    name: string;
    percentage: number;
    color: string;
    size: number;
    lineCount: number;
    fileCount: number;
  }>;
  totalSize: number;
  totalFiles: number;
  totalLines: number;
}

interface Repository {
  name: string;
  isPrivate: boolean;
  isFork: boolean;
  owner: {
    login: string;
  };
  languages?: {
    edges?: Array<{
      size: number;
      node: {
        name: string;
        color: string;
      };
    }>;
    totalSize?: number;
  };
}

type GitHubStateData = {
  yearData: YearContributions[];
  languageData: LanguageStats | null;
  lastFetched: number | null;
  progress: number;
  error: string | null;
  isLoading: boolean;
  loadingYears: Set<number>;
  currentRequest: Promise<any> | null;
  retryCount: number;
};

interface GitHubState extends GitHubStateData {
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setLoadingYear: (year: number, loading: boolean) => void;
  setYearData: (data: YearContributions[]) => void;
  setLanguageData: (data: LanguageStats | null) => void;
  setCurrentRequest: (request: Promise<any> | null) => void;
  updateLastFetched: () => void;
  reset: () => void;
  fetchGitHubContributions: () => Promise<YearContributions[]>;
}

type GitHubStorageState = Pick<GitHubStateData, 'yearData' | 'languageData' | 'lastFetched'>;

const createPerUserStorage = () => {
  const STORAGE_VERSION = '1.0';
  const storage = createJSONStorage<GitHubStorageState>(() => ({
    getItem: (name): string | null => {
      const username = getCurrentUsername();
      const key = `${name}-${username || 'anonymous'}-v${STORAGE_VERSION}`;
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: (name, value): void => {
      const username = getCurrentUsername();
      const key = `${name}-${username || 'anonymous'}-v${STORAGE_VERSION}`;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Handle storage errors silently
      }
    },
    removeItem: (name): void => {
      const username = getCurrentUsername();
      const key = `${name}-${username || 'anonymous'}-v${STORAGE_VERSION}`;
      try {
        localStorage.removeItem(key);
      } catch {
        // Handle storage errors silently
      }
    }
  }));
  return storage;
};

async function makeGraphQLRequest(query: string, variables: any, retryCount = 0): Promise<any> {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No auth token available");

    const response = await axios.post(
      GITHUB_API,
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.errors) {
      const message = response.data.errors[0]?.message;
      if (message?.includes('rate limit')) {
        throw new Error("API rate limit exceeded. Please try again later.");
      }
      throw new Error(message || "GraphQL Error");
    }

    return response;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return makeGraphQLRequest(query, variables, retryCount + 1);
    }
    throw error;
  }
}

async function fetchAllData() {
  const { excludeForks } = useFilterStore.getState();
  const username = getCurrentUsername();
  if (!username) throw new Error("GitHub username not found");

  const currentYear = new Date().getFullYear();

  const query = `
    query ($username: String!, $from: DateTime!, $excludeForks: Boolean!) {
      user(login: $username) {
        contributionsCollection(from: $from) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
        repositories(
          first: ${MAX_REPOS_PER_PAGE},
          ownerAffiliations: [OWNER],
          isFork: $excludeForks,
          orderBy: {field: PUSHED_AT, direction: DESC}
        ) {
          nodes {
            name
            isPrivate
            isFork
            owner {
              login
            }
            languages(first: ${MAX_LANGUAGES_PER_REPO}, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                  color
                }
              }
              totalSize
            }
          }
        }
      }
    }
  `;

  const variables = {
    username,
    from: `${currentYear}-01-01T00:00:00Z`,
    excludeForks: !excludeForks
  };

  const response = await makeGraphQLRequest(query, variables);
  const data = response.data.data.user;

  const calendar = data.contributionsCollection.contributionCalendar;
  const weeks: ContributionWeek[] = calendar.weeks;
  const yearStart = new Date(currentYear, 0, 1);
  const yearEnd = new Date(currentYear, 11, 31);
  const allDays = new Map();

  for (let d = new Date(yearStart); d <= yearEnd; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    allDays.set(dateStr, { day: dateStr, value: 0 });
  }

  weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      const value = day.contributionCount;
      allDays.set(day.date, { day: day.date, value });
    });
  });

  const contributions = Array.from(allDays.values());
  const yearContributions = {
    year: currentYear,
    contributions,
    totalContributions: calendar.totalContributions,
  };

  const languageMap = new Map<string, { size: number; color: string; lineCount: number; fileCount: number }>();
  let totalSize = 0;
  let totalFiles = 0;
  let totalLines = 0;

  data.repositories.nodes.forEach((repo: Repository) => {
    if (!repo.languages?.edges) return;

    repo.languages.edges.forEach((edge) => {
      const { name, color } = edge.node;
      if (EXCLUDED_LANGUAGES.has(name)) return;
      
      const size = edge.size;
      const lineCount = Math.round(size / 30);
      const fileCount = Math.max(1, Math.round(size / 10000));

      const current = languageMap.get(name) || { 
        size: 0, 
        color, 
        lineCount: 0,
        fileCount: 0
      };
      
      languageMap.set(name, {
        size: current.size + size,
        color,
        lineCount: current.lineCount + lineCount,
        fileCount: current.fileCount + fileCount
      });
      
      totalSize += size;
      totalFiles += fileCount;
      totalLines += lineCount;
    });
  });

  const languages = Array.from(languageMap.entries())
    .map(([name, { size, color, lineCount, fileCount }]) => ({
      name,
      size,
      color: color || "#666",
      percentage: Math.round((size / totalSize) * 100 * 10) / 10,
      lineCount,
      fileCount
    }))
    .sort((a, b) => b.size - a.size);

  return {
    yearData: [yearContributions],
    languageData: {
      languages,
      totalSize,
      totalFiles,
      totalLines
    }
  };
}

export const useGitHubStore = create<GitHubState>()(
  persist(
    (set, get) => ({
      progress: 0,
      error: null,
      isLoading: false,
      loadingYears: new Set(),
      yearData: [],
      languageData: null,
      lastFetched: null,
      currentRequest: null,
      retryCount: 0,
      setProgress: (progress) =>
        set((state) => ({
          progress: Math.max(state.progress, progress),
        })),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
      setLoadingYear: (year, loading) =>
        set((state) => {
          const newLoadingYears = new Set(state.loadingYears);
          if (loading) {
            newLoadingYears.add(year);
          } else {
            newLoadingYears.delete(year);
          }
          return { loadingYears: newLoadingYears };
        }),
      setYearData: (yearData) => set({ yearData }),
      setLanguageData: (languageData) => set({ languageData }),
      setCurrentRequest: (request) => set({ currentRequest: request }),
      updateLastFetched: () => set({ lastFetched: Date.now() }),
      reset: () =>
        set({
          progress: 0,
          error: null,
          isLoading: false,
          loadingYears: new Set(),
          yearData: [],
          languageData: null,
          lastFetched: null,
          currentRequest: null,
          retryCount: 0,
        }),
      fetchGitHubContributions: async () => {
        const store = get();
        const { setProgress, setError, setYearData, setLanguageData, setLoading, updateLastFetched, currentRequest, setCurrentRequest } = store;

        // Force refresh if no data or stale
        const forceRefresh = !store.lastFetched || Date.now() - store.lastFetched > CACHE_DURATION;

        // Check if data is still fresh and valid
        if (!forceRefresh && store.yearData.length > 0) {
          return store.yearData;
        }

        // Clear any existing request if the username changes
        const username = getCurrentUsername();
        if (!username) {
          store.reset();
          throw new Error("No username available");
        }

        if (currentRequest) {
          return currentRequest;
        }

        try {
          setLoading(true);
          store.reset();
          setProgress(10);

          const request = fetchAllData();
          setCurrentRequest(request);

          const { yearData, languageData } = await request;
          
          setYearData(yearData);
          setLanguageData(languageData);
          updateLastFetched();
          setProgress(100);

          return yearData;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Error fetching GitHub data";
          setError(message);
          return [];
        } finally {
          setLoading(false);
          setCurrentRequest(null);
        }
      }
    }),
    {
      name: 'github-storage',
      storage: createPerUserStorage(),
      partialize: (state): GitHubStorageState => ({
        yearData: state.yearData,
        languageData: state.languageData,
        lastFetched: state.lastFetched,
      }),
    }
  )
);

// Listen for auth events to handle cache invalidation
if (typeof window !== 'undefined') {
  window.addEventListener('auth-token-changed', () => {
    useGitHubStore.getState().reset();
  });

  window.addEventListener('auth-logout', () => {
    useGitHubStore.getState().reset();
  });
}

// Subscribe to auth changes to clear data when needed
useAuthStore.subscribe((state, prevState) => {
  if (prevState.username !== state.username || !state.token) {
    useGitHubStore.getState().reset();
    // Clear all stored data for previous user
    try {
      const previousKey = `github-storage-${prevState.username || 'anonymous'}`;
      localStorage.removeItem(previousKey);
    } catch {
      // Handle storage errors silently
    }
  }
});
