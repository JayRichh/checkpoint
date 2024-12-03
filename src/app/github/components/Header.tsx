"use client";

import { Button } from "../../../components/ui/Button";
import { InfoTooltip } from "./InfoTooltip";

interface HeaderProps {
  username?: string;
  isOAuth: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ username, isOAuth, onLogin, onLogout }: HeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold text-primary">
            GitHub Activity
          </h1>
          <InfoTooltip 
            content="Data sourced from GitHub's GraphQL API. Shows contributions across all repositories, including commits, issues, pull requests, and code reviews."
            size="lg"
          />
        </div>
        <div className="flex items-center gap-4">
          {username && (
            <span className="text-muted-foreground">
              {username}
            </span>
          )}
          {username ? (
            <Button
              variant="secondary"
              onClick={onLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={onLogin}
            >
              Connect GitHub
            </Button>
          )}
        </div>
      </div>
      <p className="text-lg text-muted-foreground mt-4">
        A visualization of {isOAuth ? "your" : "repository"} activity, showing contribution
        patterns and language distribution across all repositories.
      </p>
    </div>
  );
}
