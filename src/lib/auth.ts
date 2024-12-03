import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAppUrl, validateClientEnv, normalizeUrl } from "~/utils/env";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isOAuth: boolean;
  username: string | null;
  isDemoProfile: boolean;
  setToken: (token: string | null, refreshToken?: string | null, expiresAt?: number | null) => void;
  setUsername: (username: string | null) => void;
  setIsOAuth: (isOAuth: boolean) => void;
  setIsDemoProfile: (isDemoProfile: boolean) => void;
  enableDemoMode: () => void;
  logout: () => void;
}

const DEMO_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const DEMO_USERNAME = "jayrichh";

// Token refresh buffer (10 minutes)
const REFRESH_BUFFER = 10 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      expiresAt: null,
      isOAuth: false,
      username: null,
      isDemoProfile: false,
      setToken: (token, refreshToken = null, expiresAt = null) => {
        set({ token, refreshToken, expiresAt });
        // Trigger GitHub store reset on token change
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth-token-changed'));
        }
      },
      setUsername: (username) => set({ username }),
      setIsOAuth: (isOAuth) => set({ isOAuth }),
      setIsDemoProfile: (isDemoProfile) => set({ isDemoProfile }),
      enableDemoMode: () => set({
        token: DEMO_TOKEN || null,
        refreshToken: null,
        expiresAt: null,
        isOAuth: false,
        username: DEMO_USERNAME,
        isDemoProfile: true
      }),
      logout: () => {
        set({
          token: null,
          refreshToken: null,
          expiresAt: null,
          isOAuth: false,
          username: null,
          isDemoProfile: false
        });
        // Clear GitHub store on logout
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth-logout'));
        }
      },
    }),
    {
      name: "github-auth-storage",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isOAuth: state.isOAuth,
        username: state.username,
        isDemoProfile: state.isDemoProfile,
      }),
    }
  )
);

export const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

export async function initiateDeviceFlow(): Promise<DeviceCodeResponse> {
  const appUrl = getAppUrl();
  const response = await fetch(normalizeUrl(appUrl, 'api/auth/device'), {
    method: "POST",
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to initiate device flow");
  }

  return response.json();
}

export async function pollDeviceCode(deviceCode: string): Promise<any> {
  const appUrl = getAppUrl();
  const response = await fetch(normalizeUrl(appUrl, `api/auth/device?device_code=${deviceCode}`), {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to poll device code");
  }

  return response.json();
}

export function getGitHubOAuthURL(state?: string) {
  try {
    const clientId = validateClientEnv();
    if (!clientId) {
      throw new Error('GitHub Client ID is not configured');
    }

    const appUrl = getAppUrl();
    const redirectUri = normalizeUrl(appUrl, 'api/auth/callback');
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "repo read:user",
      state: state || Math.random().toString(36).substring(7),
    });

    return `${GITHUB_OAUTH_URL}?${params.toString()}`;
  } catch (error) {
    console.error('Failed to generate GitHub OAuth URL:', error);
    throw error;
  }
}

let refreshPromise: Promise<any> | null = null;

export async function refreshAccessToken(refreshToken: string) {
  const appUrl = getAppUrl();
  
  // Ensure only one refresh request at a time
  if (refreshPromise) {
    return refreshPromise;
  }

  try {
    refreshPromise = fetch(normalizeUrl(appUrl, 'api/auth/refresh'), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const response = await refreshPromise;

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  } finally {
    refreshPromise = null;
  }
}

export function isTokenExpired(): boolean {
  const { expiresAt } = useAuthStore.getState();
  if (!expiresAt) return false;
  
  // Check if token will expire within the buffer period
  return Date.now() > expiresAt - REFRESH_BUFFER;
}

export async function ensureValidToken(): Promise<string | null> {
  const { token, refreshToken, setToken } = useAuthStore.getState();

  if (!token || !refreshToken) {
    return token;
  }

  if (isTokenExpired()) {
    try {
      const { access_token, refresh_token, expires_in } = await refreshAccessToken(refreshToken);
      const expiresAt = Date.now() + expires_in * 1000;
      setToken(access_token, refresh_token, expiresAt);
      return access_token;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // Clear invalid tokens
      setToken(null);
      return null;
    }
  }

  return token;
}

export function isAuthenticated() {
  const { token, isOAuth, isDemoProfile } = useAuthStore.getState();
  return token !== null && (isOAuth || isDemoProfile);
}

export function getCurrentUsername() {
  return useAuthStore.getState().username;
}

export async function getAuthToken() {
  return ensureValidToken();
}
