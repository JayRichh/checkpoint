import { Suspense } from "react";
import { Metadata } from "next";
import { GitHubAnalytics } from "./components/GitHubAnalytics";
import { LoadingState } from "../../components/loading-state";
import { ErrorBoundary } from "../../components/error-boundary";

export const metadata: Metadata = {
  title: "GitHub Analytics | Committed",
  description: "View your GitHub contribution analytics and language statistics",
};

export default async function GitHubPage() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong loading GitHub data</div>}>
      <Suspense fallback={<LoadingState />}>
        <GitHubAnalytics />
      </Suspense>
    </ErrorBoundary>
  );
}
