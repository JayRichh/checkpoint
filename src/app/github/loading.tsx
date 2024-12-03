import { LoadingState } from "../../components/loading-state";

export default function GitHubLoading() {
  return (
    <div className="flex h-[calc(100vh-112px)] items-center justify-center">
      <LoadingState />
    </div>
  );
}
