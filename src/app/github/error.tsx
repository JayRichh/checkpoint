"use client";

import { useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { getAppUrl } from "~/utils/env";

export default function GitHubError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center">
        <h1 className="mb-4 text-2xl font-bold text-destructive">
          Something went wrong!
        </h1>
        <p className="text-muted-foreground mb-6">
          {error.message || "An error occurred while loading GitHub data."}
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="primary"
            onClick={reset}
          >
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = `${getAppUrl()}/`}
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
