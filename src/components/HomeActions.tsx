"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { useAuthStore, getGitHubOAuthURL } from "../lib/auth";
import { setCookie } from 'cookies-next';

export function HomeActions() {
  const router = useRouter();
  const { enableDemoMode } = useAuthStore();

  const handleDemoView = async () => {
    // Set demo mode cookie first
    setCookie('isDemoMode', 'true', { maxAge: 60 * 60 * 24 }); // 24 hours
    
    // Enable demo mode in store
    enableDemoMode();

    // Use setTimeout to ensure state is set before navigation
    setTimeout(() => {
      router.push("/github");
    }, 100);
  };

  const handleGitHubConnect = () => {
    // Clear any existing demo mode
    setCookie('isDemoMode', 'false', { maxAge: 0 });
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
