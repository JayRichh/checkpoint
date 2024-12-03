import { Suspense } from "react";
import { GitHubAnalytics } from "./components/GitHubAnalytics";
import { LoadingState } from "../../components/loading-state";

export default async function GitHubPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <GitHubAnalytics />
    </Suspense>
  );
}
