"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/Button";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <h2 className="mb-2 text-lg font-semibold">Something went wrong</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred"}
          {error.digest && (
            <span className="block text-xs text-muted-foreground/60">
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => reset()} variant="secondary">
            Try again
          </Button>
          <Button onClick={() => window.location.href = `${APP_URL}/`} variant="outline">
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
