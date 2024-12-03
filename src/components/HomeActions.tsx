"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { useAuthStore, getGitHubOAuthURL } from "../lib/auth";

export function HomeActions() {
  const router = useRouter();
  const { enableDemoMode } = useAuthStore();

  const handleDemoView = () => {
    enableDemoMode();
    router.push("/github");
  };

  const handleGitHubConnect = () => {
    window.location.href = getGitHubOAuthURL();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Button 
        variant="primary" 
        size="lg" 
        onClick={handleGitHubConnect}
        className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
      >
        Connect GitHub
      </Button>
      <Button 
        variant="secondary" 
        size="lg" 
        onClick={handleDemoView}
        className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
      >
        View Demo Profile
      </Button>
    </div>
  );
}
