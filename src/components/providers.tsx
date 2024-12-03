"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "./ui/Tooltip";
import { ErrorBoundary } from "./error-boundary";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  );
}
