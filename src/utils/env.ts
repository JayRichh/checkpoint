export function getAppUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) {
    // In development, default to localhost
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000';
    }
    console.error('NEXT_PUBLIC_APP_URL is not defined');
    // In production, try to infer from window location
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
  }
  return url;
}

export function validateClientEnv() {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  if (!clientId) {
    console.error('NEXT_PUBLIC_GITHUB_CLIENT_ID is not configured');
    return null;
  }
  return clientId;
}

export function validateServerEnv() {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'GitHub OAuth configuration is incomplete. Please check NEXT_PUBLIC_GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.'
    );
  }

  return {
    clientId,
    clientSecret,
  };
}

export function normalizeUrl(baseUrl: string, path: string): string {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  return `${cleanBase}/${cleanPath}`;
}
