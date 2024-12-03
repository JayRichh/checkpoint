declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      NEXT_PUBLIC_GITHUB_TOKEN: string;
      NEXT_PUBLIC_APP_URL: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};
