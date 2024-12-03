import { create } from "zustand";
import { persist } from "zustand/middleware";

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
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      expiresAt: null,
      isOAuth: false,
      username: null,
      isDemoProfile: false,
      setToken: (token, refreshToken = null, expiresAt = null) => 
        set({ token, refreshToken, expiresAt }),
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
      logout: () => set({
        token: null,
        refreshToken: null,
        expiresAt: null,
        isOAuth: false,
        username: null,
        isDemoProfile: false
      }),
    }),
    {
      name: "github-auth-storage",
    }
  )
);

export const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
export const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

export async function initiateDeviceFlow(): Promise<DeviceCodeResponse> {
  const response = await fetch(`${APP_URL}/api/auth/device`, {
    method: "POST",
  });
  
  if (!response.ok) {
    throw new Error("Failed to initiate device flow");
  }

  return response.json();
}

export async function pollDeviceCode(deviceCode: string): Promise<any> {
  const response = await fetch(`${APP_URL}/api/auth/device?device_code=${deviceCode}`);
  
  if (!response.ok) {
    throw new Error("Failed to poll device code");
  }

  return response.json();
}

export function getGitHubOAuthURL(state?: string) {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID || "",
    redirect_uri: `${APP_URL}/api/auth/callback`,
    scope: "repo read:user",
    state: state || Math.random().toString(36).substring(7),
  });

  return `${GITHUB_OAUTH_URL}?${params.toString()}`;
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch(`${APP_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

export function isTokenExpired(): boolean {
  const { expiresAt } = useAuthStore.getState();
  if (!expiresAt) return false;
  
  return Date.now() > expiresAt - 5 * 60 * 1000;
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
