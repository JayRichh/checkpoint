"use client";

import React from "react";
import { Button } from "./ui/Button";

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

type FallbackComponent = React.ComponentType<FallbackProps>;

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode | FallbackComponent;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        if (React.isValidElement(this.props.fallback)) {
          return this.props.fallback;
        }
        
        const FallbackComponent = this.props.fallback as FallbackComponent;
        return (
          <FallbackComponent
            error={this.state.error}
            resetErrorBoundary={this.handleReset}
          />
        );
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <h2 className="mb-2 text-lg font-semibold">Something went wrong</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              {this.state.error.message || "An unexpected error occurred"}
            </p>
            <Button onClick={this.handleReset} variant="secondary">
              Try again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
