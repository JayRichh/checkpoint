"use client";

import { Suspense } from "react";
import { GitHubAnalytics } from "./components/GitHubAnalytics";
import { LoadingState } from "~/components/loading-state";
import { ErrorBoundary } from "~/components/error-boundary";
import { Card } from "~/components/ui/Card";
import { Text } from "~/components/ui/Text";
import { Button } from "~/components/ui/Button";
import { RefreshCw } from "lucide-react";

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="py-12">
      <Card variant="outlined" className="p-8 text-center max-w-2xl mx-auto">
        <Text variant="h3" className="mb-4">
          Unable to Load GitHub Data
        </Text>
        <Text variant="body" className="text-foreground/60 mb-6">
          {error.message || "An error occurred while fetching your GitHub data. Please try again."}
        </Text>
        <Button 
          onClick={resetErrorBoundary}
          className="inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </Card>
    </div>
  );
}

export default function GitHubPage() {
  return (
    <div className="space-y-8">
      <ErrorBoundary fallback={ErrorFallback}>
        <Suspense fallback={
          <div className="py-12">
            <LoadingState />
          </div>
        }>
          <GitHubAnalytics />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
